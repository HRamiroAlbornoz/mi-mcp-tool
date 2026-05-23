import { Octokit } from '@octokit/rest';
import { CreateFileInput } from '../schemas/create-file.schema';

export type CreateFileResult = {
    sha: string;
    html_url: string;
    message: string;
};

// Crea o actualiza un archivo en un repositorio usando el endpoint de alto nivel de GitHub.
// A diferencia de create-commit, este endpoint maneja internamente todos los pasos de la Git Data API.
export async function createFile(
    input: CreateFileInput,
    octokit: Octokit
): Promise<CreateFileResult> {
    const { owner, repo, branch, path, content, message } = input;

    // Codifica el contenido en base64, que es el formato que exige la API de GitHub
    const encodedContent = Buffer.from(content, 'utf-8').toString('base64');

    const { data } = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        branch,
        path,
        content: encodedContent,
        message,
    });

    return {
        sha: data.commit.sha ?? '',
        html_url: data.content?.html_url ?? `https://github.com/${owner}/${repo}/blob/${branch}/${path}`,
        message,
    };
}
