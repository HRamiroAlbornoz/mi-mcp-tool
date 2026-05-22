# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) tool server written in TypeScript. Its purpose is to expose GitHub repository data to LLM clients via the MCP protocol. The only planned tool is `get-repository`, which takes `owner` and `repo` parameters and returns structured repository data.

## Commands

```bash
# Run the development server
npm run dev           # executes tsx src/server.ts directly

# Install dependencies
npm install

# Type-check without compiling
npx tsc --noEmit
```

There are no test or lint scripts defined yet.

## Architecture

The project follows a strict layered architecture where each layer has a single responsibility. Data always flows in one direction:

```
MCP Client → server.ts → handler → client (Octokit) → GitHub API
                                  ↓
                             mapRepoToDTO()  ← raw API response
                                  ↓
                            RepoDTO (returned to LLM)
```

### Layer responsibilities

| Folder | File | Role |
|--------|------|------|
| `src/` | `server.ts` | MCP server bootstrap — registers tools and starts listening |
| `src/handlers/` | `get-repository.handler.ts` | Orchestrates the tool call: validates input, calls Octokit, maps errors and output |
| `src/clients/` | `octokit.ts` | Creates and exports the authenticated Octokit instance |
| `src/schemas/` | `get-repository.schema.ts` | Zod schema for tool input validation; exports `GetRepositoryInput` via `z.infer` |
| `src/dtos/` | `repo.dto.ts` | `RepoDTO` type + `mapRepoToDTO()` — maps raw GitHub response to a minimal DTO for the LLM |
| `src/errors/` | `map-github-error.ts` | Maps Octokit HTTP status codes (401/403/404/422) to structured error objects with `{ isError, code, message, hint }` |

### Error object shape

```ts
{ isError: true, code: string, message: string, hint: string }
```

All user-facing messages and hints are written in Spanish.

### Key design decisions

- **DTO is minimal by design**: `mapRepoToDTO()` intentionally discards most Octokit fields, keeping only what the LLM needs (`full_name`, `description`, `html_url`, `stars`, `open_issues_count`, `language`, `default_branch`). This reduces tokens and keeps the output stable.
- **`zod-to-json-schema`** converts `GetRepositorySchema` to JSON Schema so the MCP SDK can expose it as the tool's `inputSchema`.
- **`@octokit/rest`** is used in `src/clients/octokit.ts` but is **not yet in `package.json`** — it must be installed before the server can run: `npm install @octokit/rest`.

## Environment Variables

Defined in `.env` (gitignored). See `.env.example` for the required variables:

| Variable | Purpose |
|----------|---------|
| `GITHUB_TOKEN` | GitHub Personal Access Token for Octokit authentication |
| `DEFAULT_OWNER` | Default GitHub owner/org when not provided by caller |
| `DEFAULT_REPO` | Default repository name when not provided by caller |

## Current Status

- `src/server.ts` — **empty**, needs MCP server bootstrap with `@modelcontextprotocol/sdk`
- `src/handlers/get-repository.handler.ts` — **empty**, needs implementation
- All supporting layers (client, schema, DTO, error mapping) are complete
