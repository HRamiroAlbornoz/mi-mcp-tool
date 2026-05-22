import { z } from 'zod';

export const GetRepositorySchema = z.object({
    owner: z.string().min(1, 'owner es requerido'),
    repo: z.string().min(1, 'repo es requerido'),
});

export type GetRepositoryInput = z.infer<typeof GetRepositorySchema>;