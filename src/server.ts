import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createOctokit } from './clients/octokit';
import { GetRepositorySchema } from './schemas/get-repository.schema';
import { getRepositoryHandler } from './handlers/get-repository.handler';
import { ListRepositoriesSchema } from './schemas/list-repository.schema';
import { listRepositoriesHandler } from './handlers/list-repository.handler';
import { CreateCommitSchema } from './schemas/create-commit.schema';
import { createCommitHandler } from './handlers/create-commit.handler';

async function main() {
    // PASO 1: Crear el servidor
    const server = new McpServer({
        name: 'mi-mcp-tool',
        version: '1.0.0',
    });

    // PASO 2: Crear el cliente de Octokit
    const octokit = createOctokit();

    // PASO 3: Registrar la tool
    server.tool(
        'get_repository',
        'Obtiene información detallada de un repositorio de GitHub. Requiere owner (usuario u organización) y repo (nombre del repositorio).',
        GetRepositorySchema.shape,
        async (input) => {
            const result = await getRepositoryHandler(input, octokit);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                isError: result.isError,
            };
        }
    );

    // PASO 4: Registrar la segunda tool
    server.tool(
        'list_repositories',
        'Lista los repositorios públicos de un usuario de GitHub. Requiere username (nombre de usuario de GitHub).',
        ListRepositoriesSchema.shape,
        async (input) => {
            const result = await listRepositoriesHandler(input, octokit);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                isError: result.isError,
            };
        }
    );

    // PASO 5: Registrar la tercera tool
    server.tool(
        'create_commit',
        'Crea un commit en un repositorio de GitHub. Requiere owner, repo, branch, path (ruta del archivo), content (contenido del archivo) y message (mensaje del commit).',
        CreateCommitSchema.shape,
        async (input) => {
            const result = await createCommitHandler(input, octokit);
            const isError = 'isError' in result ? result.isError : false;
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                isError,
            };
        }
    );

    console.error('Server MCP iniciado con tools: get_repository, list_repositories, create_commit');

    // PASO 4: Conectar transporte
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((err) => {
    console.error('Error fatal:', err);
    process.exit(1);
});