# mi-mcp-tool

Servidor MCP (Model Context Protocol) escrito en TypeScript que expone herramientas para interactuar con la API de GitHub a través de Octokit.

## Tools disponibles

| Tool | Descripción |
|------|-------------|
| `get_repository` | Obtiene información detallada de un repositorio |
| `list_repositories` | Lista los repositorios públicos de un usuario |
| `get_file_content` | Lee el contenido de un archivo de un repositorio |
| `create_file` | Crea o actualiza un archivo en un repositorio |
| `create_commit` | Crea un commit usando la Git Data API |
| `create_branch` | Crea una nueva rama a partir de una rama existente |

## Requisitos

- Node.js
- Una cuenta de GitHub con un Personal Access Token

## Instalación

```bash
npm install
```

## Configuración

Copiá el archivo de ejemplo y completá tus variables:

```bash
cp .env.example .env
```

Variables requeridas en `.env`:

```
GITHUB_TOKEN=tu_token_de_github
DEFAULT_OWNER=tu_usuario
DEFAULT_REPO=tu_repo
```

## Uso

### Desarrollo

```bash
npm run dev
```

### Probar con MCP Inspector

```bash
npx @modelcontextprotocol/inspector npx tsx src/server.ts
```

## Stack

- TypeScript
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- [@octokit/rest](https://github.com/octokit/rest.js)
- [Zod](https://zod.dev)
