import { Octokit } from '@octokit/rest';
import { CreateBranchInput } from '../schemas/create-branch.schema';

export type CreateBranchResult = {
    name: string;
    sha: string;
    html_url: string;
};

// Crea una nueva rama a partir de una rama existente.
// Obtiene el SHA del último commit de from_branch y crea una nueva ref que apunta a él.
export async function createBranch(
    input: CreateBranchInput,
    octokit: Octokit
): Promise<CreateBranchResult> {
    const { owner, repo, branch, from_branch } = input;

    // PASO 1: Obtener el SHA del último commit de la rama origen
    const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${from_branch}`,
    });
    const sha = refData.object.sha;

    // PASO 2: Crear la nueva rama apuntando a ese SHA
    const { data: newRef } = await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branch}`,
        sha,
    });

    return {
        name: branch,
        sha: newRef.object.sha,
        html_url: `https://github.com/${owner}/${repo}/tree/${branch}`,
    };
}
