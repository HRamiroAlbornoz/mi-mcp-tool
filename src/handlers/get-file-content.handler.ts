import { Octokit } from '@octokit/rest';
import { GetFileContentSchema } from '../schemas/get-file-content.schema';
import { getFileContent, GetFileContentResult } from '../clients/get-file-content';
import { mapGitHubError, ToolError } from '../errors/map-github-error';

export type GetFileContentHandlerResult = GetFileContentResult | ToolError;

export async function getFileContentHandler(
    input: unknown,
    octokit: Octokit
): Promise<GetFileContentHandlerResult> {
    const parsed = GetFileContentSchema.safeParse(input);

    if (!parsed.success) {
        return {
            isError: true,
            code: 'VALIDATION_ERROR',
            message: 'Input inválido para get_file_content',
            hint: 'owner, repo, path y branch son obligatorios',
        };
    }

    try {
        return await getFileContent(parsed.data, octokit);
    } catch (err) {
        return mapGitHubError(err);
    }
}
