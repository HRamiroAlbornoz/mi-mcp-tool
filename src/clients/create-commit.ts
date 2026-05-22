import { Octokit } from '@octokit/rest';
import { CreateCommitInput } from '../schemas/create-commit.schema';

export type CreateCommitResult = {
    sha: string;
    html_url: string;
    message: string;
};

// Crea un commit con un archivo en una rama usando la Git Data API de GitHub.
// Encapsula los 6 pasos necesarios: ref → tree → blob → new tree → commit → update ref.
export async function createCommit(
    input: CreateCommitInput,
    octokit: Octokit
): Promise<CreateCommitResult> {
    const { owner, repo, branch, path, content, message } = input;

    // PASO 1: Obtener el SHA del último commit de la rama
    const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${branch}`,
    });
    const latestCommitSha = refData.object.sha;

    // PASO 2: Obtener el árbol del último commit
    const { data: commitData } = await octokit.git.getCommit({
        owner,
        repo,
        commit_sha: latestCommitSha,
    });
    const baseTreeSha = commitData.tree.sha;

    // PASO 3: Crear el blob con el contenido del archivo
    const { data: blobData } = await octokit.git.createBlob({
        owner,
        repo,
        content,
        encoding: 'utf-8',
    });

    // PASO 4: Crear el nuevo árbol con el archivo
    const { data: newTree } = await octokit.git.createTree({
        owner,
        repo,
        base_tree: baseTreeSha,
        tree: [
            {
                path,
                mode: '100644', // archivo regular
                type: 'blob',
                sha: blobData.sha,
            },
        ],
    });

    // PASO 5: Crear el commit apuntando al nuevo árbol
    const { data: newCommit } = await octokit.git.createCommit({
        owner,
        repo,
        message,
        tree: newTree.sha,
        parents: [latestCommitSha],
    });

    // PASO 6: Actualizar la referencia de la rama al nuevo commit
    await octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: newCommit.sha,
    });

    return {
        sha: newCommit.sha,
        html_url: `https://github.com/${owner}/${repo}/commit/${newCommit.sha}`,
        message: newCommit.message,
    };
}
