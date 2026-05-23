import { Octokit } from '@octokit/rest';
import { GetFileContentInput } from '../schemas/get-file-content.schema';

export type GetFileContentResult = {
    path: string;
    content: string;
    sha: string;
    html_url: string;
    size: number;
};

// Obtiene el contenido de un archivo de un repositorio de GitHub.
// La API devuelve el contenido codificado en base64, por eso se decodifica antes de retornar.
export async function getFileContent(
    input: GetFileContentInput,
    octokit: Octokit
): Promise<GetFileContentResult> {
    const { owner, repo, path, branch } = input;

    const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
    });

    // La API puede devolver un archivo o un directorio — nos aseguramos de que sea un archivo
    if (Array.isArray(data) || data.type !== 'file') {
        throw Object.assign(new Error('La ruta especificada no corresponde a un archivo'), { status: 422 });
    }

    // El contenido viene en base64 con saltos de línea; los eliminamos antes de decodificar
    const decoded = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8');

    return {
        path: data.path,
        content: decoded,
        sha: data.sha,
        html_url: data.html_url ?? '',
        size: data.size,
    };
}
