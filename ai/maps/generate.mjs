// Generates symbols.json, imports.json, and impact.json from TypeScript source.
// Usage: node ai/maps/generate.mjs

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");
const srcDir = join(root, "src");
const outDir = join(root, "ai", "maps");

const SRC_EXTS = [".ts", ".tsx"];

// --- Collect all source files ---
function collectFiles(dir) {
  const results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === "node_modules" || entry === ".next" || entry === "test-results") continue;
      results.push(...collectFiles(full));
    } else if (SRC_EXTS.some((ext) => entry.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

// Also collect test and config files outside src
function collectExtra() {
  const results = [];
  const extraFiles = [
    join(root, "next.config.ts"),
    join(root, "vitest.config.ts"),
    join(root, "playwright.config.ts"),
    join(root, "eslint.config.mjs"),
    join(root, "postcss.config.mjs"),
  ];
  for (const f of extraFiles) {
    if (existsSync(f)) results.push(f);
  }
  const testsDir = join(root, "tests");
  if (existsSync(testsDir)) results.push(...collectFiles(testsDir));
  return results;
}

const allFiles = [...collectFiles(srcDir), ...collectExtra()];

// --- Regex-based extraction (robust for JSX/TSX without needing ts.resolveModuleName) ---
function extractExports(content, filePath) {
  const symbols = [];
  const relPath = relative(root, filePath);

  // Named exports: export function/const/class/type/interface
  const named = /^export\s+(async\s+)?(function|const|class|type|interface|enum)\s+(\w+)/gm;
  let match;
  while ((match = named.exec(content)) !== null) {
    const kind = match[2];
    symbols.push({
      name: match[3],
      kind,
      file: relPath,
      exported: true,
      signature: extractSignature(content, match.index, match[0]),
    });
  }

  // Export default function/class
  const defaultExp = /^export\s+default\s+(async\s+)?(function|class)\s+(\w+)/gm;
  while ((match = defaultExp.exec(content)) !== null) {
    symbols.push({
      name: match[3],
      kind: match[2],
      file: relPath,
      exported: true,
      signature: extractSignature(content, match.index, match[0]),
    });
  }

  // export { x } or export { x as y }
  const barrel = /^export\s*\{\s*([^}]+)\s*\}/gm;
  while ((match = barrel.exec(content)) !== null) {
    const names = match[1].split(",").map((s) => s.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
    for (const name of names) {
      symbols.push({ name, kind: "re-export", file: relPath, exported: true });
    }
  }

  // React component detection: function ComponentName() or const ComponentName = ... => JSX
  const componentPattern = /^(?:export\s+)?(?:default\s+)?(?:function|const)\s+(\w+)/gm;
  // We'll mark components during import graph building

  return symbols;
}

function extractSignature(content, startIndex, declLine) {
  // Capture from the match position to the next { or ) at the right nesting level
  const fromStart = content.slice(startIndex);
  const lines = fromStart.split("\n");
  let sig = "";
  let braceDepth = 0;
  let parenDepth = 0;
  let started = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!started && trimmed.length === 0) continue;
    started = true;
    sig += (sig ? "\n" : "") + "  " + trimmed;
    for (const ch of trimmed) {
      if (ch === "(") parenDepth++;
      if (ch === ")") parenDepth--;
      if (ch === "{") braceDepth++;
      if (ch === "}") braceDepth--;
    }
    if (braceDepth > 0 && braceDepth === 1 && trimmed.endsWith("{")) {
      break;
    }
  }
  return sig.length > 400 ? sig.slice(0, 397) + "..." : sig;
}

// --- Extract imports ---
function extractImports(content, filePath) {
  const relPath = relative(root, filePath);
  const imports = [];

  // import { x, y } from "module"
  const namedImport = /^import\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']/gm;
  let match;
  while ((match = namedImport.exec(content)) !== null) {
    const names = match[1].split(",").map((s) => {
      const parts = s.trim().split(/\s+as\s+/);
      return { name: parts[0].trim(), alias: parts[1]?.trim() || parts[0].trim() };
    });
    for (const n of names) {
      imports.push({ name: n.name, alias: n.alias, source: resolveImport(match[2], relPath) });
    }
  }

  // import X from "module"
  const defaultImport = /^import\s+(\w+)\s+from\s*["']([^"']+)["']/gm;
  while ((match = defaultImport.exec(content)) !== null) {
    imports.push({ name: "default", alias: match[1], source: resolveImport(match[2], relPath) });
  }

  // import * as X from "module"
  const namespaceImport = /^import\s+\*\s+as\s+(\w+)\s+from\s*["']([^"']+)["']/gm;
  while ((match = namespaceImport.exec(content)) !== null) {
    imports.push({ name: "*", alias: match[1], source: resolveImport(match[2], relPath) });
  }

  return imports;
}

function resolveImport(specifier, fromFile) {
  if (specifier.startsWith(".")) {
    const base = join(root, dirname(fromFile));
    return relative(root, resolve(base, specifier));
  }
  if (specifier.startsWith("@/")) {
    return specifier.replace("@/", "src/");
  }
  return specifier; // External package
}

// Resolve a bare module path (no extension) to an actual file in the filesystem
function resolveToFile(barePath) {
  // Already has extension and exists
  if (barePath.match(/\.\w+$/) && existsSync(join(root, barePath))) {
    return barePath;
  }
  // Try adding extensions
  for (const ext of [".ts", ".tsx", ".mjs", ".js", ".jsx", "/index.ts", "/index.tsx"]) {
    const candidate = barePath + (ext.startsWith("/") ? ext : "");
    if (existsSync(join(root, candidate))) {
      return candidate;
    }
    // Also try matching as bare + extension (for when barePath is like "src/lib/cart/cart-reducer")
    if (!barePath.includes("/index") && !barePath.endsWith("/")) {
      const withExt = barePath + (ext.startsWith("/") ? "" : "");
      if (existsSync(join(root, withExt))) {
        return withExt;
      }
    }
  }
  return barePath; // Couldn't resolve, return as-is
}

// Build a reverse map: actual file path -> all bare paths that resolve to it
function buildResolutionMap(fileList) {
  const map = {}; // actualFile -> Set<barePath>
  for (const file of fileList) {
    const relPath = relative(root, file);
    // Generate all names someone might import this file by
    const variants = new Set();
    variants.add(relPath);
    // Strip extension
    const noExt = relPath.replace(/\.\w+$/, "");
    variants.add(noExt);
    // Strip /index
    const noIndex = noExt.replace(/\/index$/, "");
    if (noIndex !== noExt) variants.add(noIndex);
    // Without src/ prefix (some imports use relative paths)
    if (relPath.startsWith("src/")) {
      variants.add(relPath.replace("src/", ""));
    }

    for (const v of variants) {
      if (!map[v]) map[v] = new Set();
      map[v].add(relPath);
    }
  }
  return map;
}

// --- Also detect React component declarations (for marking) ---
function detectReactComponent(content) {
  // Heuristic: function/const that returns JSX
  return /[Rr]eactElement|<\w+[/>]/.test(content);
}

// --- Main ---
const allSymbols = {};
const allImports = {};
const allExportsByFile = {};

for (const file of allFiles) {
  const relPath = relative(root, file);
  const content = readFileSync(file, "utf-8");

  const exports = extractExports(content, file);
  const imports = extractImports(content, file);

  allExportsByFile[relPath] = exports.map((e) => ({ name: e.name, kind: e.kind }));
  allImports[relPath] = imports.map((i) => ({ name: i.name, alias: i.alias, source: i.source }));

  for (const exp of exports) {
    if (!allSymbols[exp.name]) {
      allSymbols[exp.name] = { name: exp.name, kinds: [] };
    }
    allSymbols[exp.name].kinds.push({
      kind: exp.kind,
      file: exp.file,
      signature: exp.signature || null,
    });
  }
}

// Build the resolution map (bare source -> actual files)
const resolutionMap = buildResolutionMap(allFiles);

// Resolve an import source to actual file paths
function resolveToActual(source) {
  if (!source.startsWith("src/") && !source.includes("next.config") && !source.includes("vitest") && !source.includes("playwright")) {
    return null; // External, skip
  }
  return resolutionMap[source] || resolutionMap[source.replace(/\.\w+$/, "")] || null;
}

// --- Build importers (reverse of imports) ---
const importersOf = {}; // actual file -> [files that import from it]
const importersOfSymbol = {}; // symbolName -> [files that import it]

for (const [file, imports] of Object.entries(allImports)) {
  for (const imp of imports) {
    const actualSources = resolveToActual(imp.source);
    if (actualSources) {
      for (const actualSource of actualSources) {
        if (!importersOf[actualSource]) importersOf[actualSource] = [];
        if (!importersOf[actualSource].includes(file)) {
          importersOf[actualSource].push(file);
        }
      }
    }

    if (imp.name !== "*" && imp.name !== "default" && imp.name !== "type" && !imp.name.startsWith("type ") && actualSources) {
      const cleanName = imp.name.replace(/^type\s+/, "");
      if (!importersOfSymbol[cleanName]) importersOfSymbol[cleanName] = [];
      if (!importersOfSymbol[cleanName].includes(file)) {
        importersOfSymbol[cleanName].push(file);
      }
    }
  }
}

// --- Build symbols.json ---
const symbolsOut = {};
for (const [name, data] of Object.entries(allSymbols)) {
  symbolsOut[name] = {
    name,
    files: data.kinds.map((k) => ({ kind: k.kind, file: k.file, signature: k.signature })),
    usedBy: importersOfSymbol[name] || [],
  };
}

// --- Build imports.json ---
const importsOut = {};
for (const [file, imports] of Object.entries(allImports)) {
  importsOut[file] = {
    imports: imports.map((i) => ({
      name: i.name,
      alias: i.alias,
      source: i.source,
      resolved: resolveToActual(i.source) ? [...resolveToActual(i.source)] : null,
    })),
    importedBy: importersOf[file] || [],
    exports: allExportsByFile[file] || [],
  };
}

// --- Build impact.json ---
function getTransitiveConsumers(file, visited = new Set()) {
  if (visited.has(file)) return [];
  visited.add(file);
  const direct = importersOf[file] || [];
  const transitive = [];
  for (const consumer of [...direct]) {
    transitive.push(...getTransitiveConsumers(consumer, visited));
  }
  return [...new Set([...direct, ...transitive])].sort();
}

function findTests(file) {
  // Heuristic: matching test file patterns
  const base = file.replace(/\.(ts|tsx|mjs|js)$/, "");
  const testPatterns = [
    `${base}.test.ts`,
    `${base}.test.tsx`,
    `${base}.spec.ts`,
    `${base}.spec.tsx`,
    file.replace(/^src\//, "src/__tests__/"),
  ];

  // Also check if any test file imports from this file
  const tests = [];
  for (const [testFile, testImports] of Object.entries(allImports)) {
    if ((testFile.includes(".test.") || testFile.includes(".spec.") || testFile.includes("/tests/")) &&
        testImports.some((i) => i.source === file || i.source.startsWith(file.replace(/\.[^.]+$/, "")))) {
      tests.push(testFile);
    }
  }

  // Also common test location patterns
  if (tests.length === 0) {
    const filename = file.split("/").pop();
    for (const [testFile] of Object.entries(allImports)) {
      if (testFile.includes(".test.") && testFile.includes(filename.replace(/\.[^.]+$/, ""))) {
        tests.push(testFile);
      }
    }
  }

  return [...new Set(tests)].sort();
}

function assessRisk(file, transitiveConsumerCount) {
  const count = transitiveConsumerCount || 0;
  const isMiddleware = file.includes("proxy.ts") || file.includes("middleware");
  const isLayout = file.includes("layout.tsx");
  const isConfig = file.includes("config.") || file.includes(".config.") || file === "Dockerfile" || file === "package.json";
  const isData = file.startsWith("src/data/");
  const isRootPage = file === "src/app/page.tsx" || file === "src/app/layout.tsx";
  const isError = file.includes("error.tsx") || file.includes("not-found.tsx");
  const isApiRoute = file.startsWith("src/app/api/");
  const isServerAction = file.startsWith("src/app/actions/");

  if (isMiddleware || isLayout || isConfig || isRootPage) return "high";
  if (isApiRoute || isServerAction || isError) return "medium";
  if (isData) return "medium";
  if (count > 10) return "medium";
  if (count > 3) return "low";
  return "low";
}

const impactOut = {};
for (const file of allFiles) {
  const relPath = relative(root, file);
  const directImporters = importersOf[relPath] || [];
  const transitive = getTransitiveConsumers(relPath);
  const tests = findTests(relPath);
  const risk = assessRisk(relPath, transitive.length);

  // Only include files that have imports, exports, or are in key paths
  const hasExports = allExportsByFile[relPath] && allExportsByFile[relPath].length > 0;
  const hasImporters = directImporters.length > 0;
  const isKey = relPath.startsWith("src/app/") || relPath.startsWith("next.config") || relPath.includes("layout");

  if (hasExports || hasImporters || isKey) {
    impactOut[relPath] = {
      directImporters,
      transitiveConsumers: transitive.filter((t) => t !== relPath),
      tests,
      testCount: tests.length,
      risk,
      suggestedValidation: tests.length > 0
        ? tests.map((t) => `npx vitest ${t}`)
        : [`npm run build`],
    };
  }
}

// --- Write outputs ---
writeFileSync(join(outDir, "symbols.json"), JSON.stringify(symbolsOut, null, 2));
writeFileSync(join(outDir, "imports.json"), JSON.stringify(importsOut, null, 2));
writeFileSync(join(outDir, "impact.json"), JSON.stringify(impactOut, null, 2));

console.log(`Generated:
  ${join(outDir, "symbols.json")} — ${Object.keys(symbolsOut).length} symbols
  ${join(outDir, "imports.json")} — ${Object.keys(importsOut).length} files
  ${join(outDir, "impact.json")} — ${Object.keys(impactOut).length} files tracked
`);
