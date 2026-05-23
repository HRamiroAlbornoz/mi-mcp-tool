import { Octokit } from '@octokit/rest';
import { CreateBranchSchema } from '../schemas/create-branch.schema';
import { createBranch, CreateBranchResult } from '../clients/create-branch';
import { mapGitHubError, ToolError } from '../errors/map-github-error';

export type CreateBranchHandlerResult = CreateBranchResult | ToolError;

export async function createBranchHandler(
    input: unknown,
    octokit: Octokit
): Promise<CreateBranchHandlerResult> {
    const parsed = CreateBranchSchema.safeParse(input);

    if (!parsed.success) {
        return {
            isError: true,
            code: 'VALIDATION_ERROR',
            message: 'Input inválido para create_branch',
            hint: 'owner, repo y branch son obligatorios. from_branch es opcional (default: main)',
        };
    }

    try {
        return await createBranch(parsed.data, octokit);
    } catch (err) {
        return mapGitHubError(err);
    }
}
