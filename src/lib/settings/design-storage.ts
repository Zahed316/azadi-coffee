import { defaultDesignSettings, type DesignSettings } from "./design-presets";

export const DESIGN_SETTINGS_KEY = "azadi.design.settings.v1";

const colorKeys = Object.keys(defaultDesignSettings.colors) as Array<keyof DesignSettings["colors"]>;
const shapeKeys = Object.keys(defaultDesignSettings.shape) as Array<keyof DesignSettings["shape"]>;
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedSettings: DesignSettings = defaultDesignSettings;

export function readStoredDesignSettings(fallback: DesignSettings = defaultDesignSettings): DesignSettings {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(DESIGN_SETTINGS_KEY);
  if (raw === cachedRaw) {
    return cachedSettings;
  }

  cachedRaw = raw;
  if (!raw) {
    cachedSettings = fallback;
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DesignSettings>;
    cachedSettings = {
      ...fallback,
      ...parsed,
      colors: { ...fallback.colors, ...parsed.colors },
      typography: { ...fallback.typography, ...parsed.typography },
      shape: { ...fallback.shape, ...parsed.shape },
      styles: { ...fallback.styles, ...parsed.styles },
    };
    return cachedSettings;
  } catch {
    cachedSettings = fallback;
    return fallback;
  }
}

export function persistDesignSettings(settings: DesignSettings) {
  const raw = JSON.stringify(settings);
  cachedRaw = raw;
  cachedSettings = settings;
  window.localStorage.setItem(DESIGN_SETTINGS_KEY, raw);
  listeners.forEach((listener) => listener());
}

export function subscribeDesignSettings(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  listeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === DESIGN_SETTINGS_KEY) {
      cachedRaw = null;
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function applyDesignSettings(settings: DesignSettings) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const { colors, typography, shape, styles } = settings;

  colorKeys.forEach((key) => {
    const cssName = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    root.style.setProperty(`--${cssName}`, colors[key]);
  });

  shapeKeys.forEach((key) => {
    const cssName = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    const suffix = key.includes("Radius") || key === "radius" ? "px" : "";
    root.style.setProperty(`--${cssName}`, `${shape[key]}${suffix}`);
  });

  root.style.setProperty("--site-font-family", typography.customFontName ? `"${typography.customFontName}", ${typography.fontFamily}` : typography.fontFamily);
  root.style.setProperty("--site-font-family-fa", typography.persianFont ? `"${typography.persianFont}", var(--site-font-family)` : "var(--site-font-family)");
  root.style.setProperty("--site-font-family-en", typography.englishFont ? `"${typography.englishFont}", var(--site-font-family)` : "var(--site-font-family)");
  root.style.setProperty("--shadow-card", `0 ${Math.round(shape.shadowIntensity / 3)}px ${shape.shadowIntensity}px rgba(0, 0, 0, ${Math.min(shape.shadowIntensity / 180, 0.24)})`);
  root.style.setProperty("--spacing-scale", String(shape.spacingScale));
  root.dataset.headerStyle = styles.header;
  root.dataset.footerStyle = styles.footer;
  root.dataset.landingStyle = styles.landing;
  root.dataset.productCardStyle = styles.productCard;
  root.dataset.blogCardStyle = styles.blogCard;
  root.dataset.buttonStyle = styles.button;

  let fontStyle = document.getElementById("azadi-custom-font");
  if (!fontStyle) {
    fontStyle = document.createElement("style");
    fontStyle.id = "azadi-custom-font";
    document.head.appendChild(fontStyle);
  }

  fontStyle.textContent =
    typography.customFontName && typography.customFontDataUrl && typography.customFontFormat
      ? `@font-face{font-family:"${typography.customFontName}";src:url("${typography.customFontDataUrl}") format("${typography.customFontFormat}");font-weight:100 900;font-style:normal;font-display:swap;}`
      : "";
}

type DesignSettingGroup = "colors" | "typography" | "shape" | "styles";

export function updateDesignSetting<T extends DesignSettingGroup>(
  settings: DesignSettings,
  group: T,
  key: keyof DesignSettings[T],
  value: string | number,
): DesignSettings {
  return {
    ...settings,
    [group]: {
      ...settings[group],
      [key]: value,
    },
  };
}

export function resetCustomFont(settings: DesignSettings): DesignSettings {
  return {
    ...settings,
    typography: {
      ...settings.typography,
      customFontName: "",
      customFontDataUrl: "",
      customFontFormat: "",
    },
  };
}
