import { z } from 'zod';

export const GetFileContentSchema = z.object({
    owner: z.string().min(1, 'owner es requerido'),
    repo: z.string().min(1, 'repo es requerido'),
    path: z.string().min(1, 'path es requerido'),
    branch: z.string().min(1, 'branch es requerido'),
});

export type GetFileContentInput = z.infer<typeof GetFileContentSchema>;
