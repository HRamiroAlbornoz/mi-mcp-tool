import { Octokit } from '@octokit/rest';
import { CreateFileSchema } from '../schemas/create-file.schema';
import { createFile, CreateFileResult } from '../clients/create-file';
import { mapGitHubError, ToolError } from '../errors/map-github-error';

export type CreateFileHandlerResult = CreateFileResult | ToolError;

export async function createFileHandler(
    input: unknown,
    octokit: Octokit
): Promise<CreateFileHandlerResult> {
    const parsed = CreateFileSchema.safeParse(input);

    if (!parsed.success) {
        return {
            isError: true,
            code: 'VALIDATION_ERROR',
            message: 'Input inválido para create_file',
            hint: 'owner, repo, branch, path y message son obligatorios',
        };
    }

    try {
        return await createFile(parsed.data, octokit);
    } catch (err) {
        return mapGitHubError(err);
    }
}
