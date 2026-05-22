import { Octokit } from '@octokit/rest';
import { ListRepositoriesSchema } from '../schemas/list-repository.schema';
import { mapRepoToDTO, RepoDTO } from '../dtos/repo.dto';
import { mapGitHubError, ToolError } from '../errors/map-github-error';

export type ListRepositoriesResult =
    | { isError: false; data: RepoDTO[] }
    | ToolError;

export async function listRepositoriesHandler(
    input: unknown,
    octokit: Octokit
): Promise<ListRepositoriesResult> {
    const parsed = ListRepositoriesSchema.safeParse(input);

    if (!parsed.success) {
        return {
            isError: true,
            code: 'VALIDATION_ERROR',
            message: 'Input inválido para list_repositories',
            hint: 'username es obligatorio y no puede estar vacío',
        };
    }

    try {
        const response = await octokit.repos.listForUser({
            username: parsed.data.username,
            per_page: 100,
            sort: 'updated',
        });

        return {
            isError: false,
            data: response.data.map(mapRepoToDTO),
        };
    } catch (err) {
        return mapGitHubError(err);
    }
}