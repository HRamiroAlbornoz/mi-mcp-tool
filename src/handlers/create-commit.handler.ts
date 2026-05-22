import { Octokit } from '@octokit/rest';
import { CreateCommitSchema } from '../schemas/create-commit.schema';
import { createCommit, CreateCommitResult } from '../clients/create-commit';
import { mapGitHubError, ToolError } from '../errors/map-github-error';

export type CreateCommitHandlerResult = CreateCommitResult | ToolError;

export async function createCommitHandler(
    input: unknown,
    octokit: Octokit
): Promise<CreateCommitHandlerResult> {
    const parsed = CreateCommitSchema.safeParse(input);

    if (!parsed.success) {
        return {
            isError: true,
            code: 'VALIDATION_ERROR',
            message: 'Input inválido para create_commit',
            hint: 'owner, repo, branch, path y message son obligatorios',
        };
    }

    try {
        return await createCommit(parsed.data, octokit);
    } catch (err) {
        return mapGitHubError(err);
    }
}
