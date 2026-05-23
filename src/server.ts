import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createOctokit } from './clients/octokit';
import { GetRepositorySchema } from './schemas/get-repository.schema';
import { getRepositoryHandler } from './handlers/get-repository.handler';
import { ListRepositoriesSchema } from './schemas/list-repository.schema';
import { listRepositoriesHandler } from './handlers/list-repository.handler';
import { CreateCommitSchema } from './schemas/create-commit.schema';
import { createCommitHandler } from './handlers/create-commit.handler';
import { CreateFileSchema } from './schemas/create-file.schema';
import { createFileHandler } from './handlers/create-file.handler';
import { GetFileContentSchema } from './schemas/get-file-content.schema';
import { getFileContentHandler } from './handlers/get-file-content.handler';
import { CreateBranchSchema } from './schemas/create-branch.schema';
import { createBranchHandler } from './handlers/create-branch.handler';

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

    // PASO 6: Registrar la cuarta tool
    server.tool(
        'create_file',
        'Crea o actualiza un archivo en un repositorio de GitHub. Requiere owner, repo, branch, path (ruta del archivo), content (contenido del archivo) y message (mensaje del commit).',
        CreateFileSchema.shape,
        async (input) => {
            const result = await createFileHandler(input, octokit);
            const isError = 'isError' in result ? result.isError : false;
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                isError,
            };
        }
    );

    // PASO 7: Registrar la quinta tool
    server.tool(
        'get_file_content',
        'Lee el contenido de un archivo de un repositorio de GitHub. Requiere owner, repo, path (ruta del archivo) y branch.',
        GetFileContentSchema.shape,
        async (input) => {
            const result = await getFileContentHandler(input, octokit);
            const isError = 'isError' in result ? result.isError : false;
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                isError,
            };
        }
    );

    // PASO 8: Registrar la sexta tool
    server.tool(
        'create_branch',
        'Crea una nueva rama en un repositorio de GitHub a partir de una rama existente. Requiere owner, repo, branch (nombre de la nueva rama) y from_branch (rama origen, por defecto "main").',
        CreateBranchSchema.shape,
        async (input) => {
            const result = await createBranchHandler(input, octokit);
            const isError = 'isError' in result ? result.isError : false;
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                isError,
            };
        }
    );

    console.error('Server MCP iniciado con tools: get_repository, list_repositories, create_commit, create_file, get_file_content, create_branch');

    // PASO 4: Conectar transporte
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((err) => {
    console.error('Error fatal:', err);
    process.exit(1);
});