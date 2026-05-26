# MCP Servers — Azadi Coffee

> **Knowledge system:** [README](../README.md) · [project-map](./project-map.md) · [agent-corporation](../agents/agent-corporation.md)

## Overview
Model Context Protocol (MCP) servers provide AI tooling with structured access to external systems. All configuration lives in `mcp_servers.json` at the project root.

## Server List

| Server | Package | Purpose |
|---|---|---|
| `open-design` | Custom (local daemon) | Design system integration — theme inspection, token management, visual design tooling |
| `filesystem` | `@modelcontextprotocol/server-filesystem` | Secure read/write file access to project directories |
| `sequential-thinking` | `@modelcontextprotocol/server-sequential-thinking` | Structured reasoning for complex multi-step problems |
| `memory` | `@modelcontextprotocol/server-memory` | Persistent knowledge graph stored in `ai/memory/memory.json` |
| `brave-search` | `@modelcontextprotocol/server-brave-search` | Web search via Brave Search API (requires `BRAVE_API_KEY` env var) |
| `bash` | `bash-mcp` | Shell command execution (use with caution) |

## Server Details

### filesystem
Allowed directories:
- `/home/newuser/azadi-roastery/azadi-coffee` — full project
- `src/` — source code
- `tests/` — test files
- `ai/` — project AI knowledge, agents, skills, memory

### sequential-thinking
No configuration needed. Used for breaking down complex tasks into sequential reasoning steps.

### memory
Stores persistent knowledge in `ai/memory/memory.json`. The server manages a knowledge graph that persists across sessions. Useful for:
- Remembering architectural decisions
- Tracking known bugs and workarounds
- Storing user preferences and context

### brave-search
Requires `BRAVE_API_KEY` environment variable. Set it in your shell or `.env.local`:
```bash
export BRAVE_API_KEY=your-api-key
```
If the key is not set, the server will fail to start (but won't block other servers).

### bash
⚠️ Executes arbitrary shell commands. Only use in trusted environments. The command-code CLI already has its own bash tool — this server is supplementary for scenarios where dedicated bash access is needed.

## Usage
MCP servers are automatically started by compatible AI tooling (like command-code) when they detect the `mcp_servers.json` configuration file. No manual startup needed.

## Adding a New MCP Server
1. Install the package: `npm install --save-dev <package-name>`
2. Add a server entry to `mcp_servers.json`:
   ```json
   "server-name": {
     "command": "npx",
     "args": ["<package-bin-name>"],
     "env": { "API_KEY": "${ENV_VAR}" }
   }
   ```
3. Document it in this file
4. Update `ai/architecture/project-map.md`

## Files
- `mcp_servers.json` — Server configuration
- `ai/memory/memory.json` — Knowledge graph storage
- `ai/architecture/mcp.md` — This documentation
