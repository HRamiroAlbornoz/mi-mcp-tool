import { Octokit } from '@octokit/rest';
import { GetRepositorySchema } from '../schemas/get-repository.schema';
import { mapRepoToDTO, RepoDTO } from '../dtos/repo.dto';
import { mapGitHubError, ToolError } from '../errors/map-github-error';

export type GetRepositoryResult =
    | { isError: false; data: RepoDTO }
    | ToolError;

export async function getRepositoryHandler(
    input: unknown,
    octokit: Octokit
): Promise<GetRepositoryResult> {
    // PASO 1: Validar el input con Zod
    const parsed = GetRepositorySchema.safeParse(input);

    if (!parsed.success) {
        return {
            isError: true,
            code: 'VALIDATION_ERROR',
            message: 'Input inválido para get_repository',
            hint: 'owner y repo son obligatorios y no pueden estar vacíos',
        };
    }

    // PASO 2: Llamar a GitHub vía Octokit
    try {
        const response = await octokit.repos.get(parsed.data);

        // PASO 3: Mapear a DTO y devolver
        return {
            isError: false,
            data: mapRepoToDTO(response.data),
        };
    } catch (err) {
        // PASO 4: Si algo falla, mapeamos el error
        return mapGitHubError(err);
    }
} 