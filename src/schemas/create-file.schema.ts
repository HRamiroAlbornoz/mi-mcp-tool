import { z } from 'zod';

export const CreateFileSchema = z.object({
    owner: z.string().min(1, 'owner es requerido'),
    repo: z.string().min(1, 'repo es requerido'),
    branch: z.string().min(1, 'branch es requerido'),
    path: z.string().min(1, 'path es requerido'),
    content: z.string(),
    message: z.string().min(1, 'commit message es requerido'),
});

export type CreateFileInput = z.infer<typeof CreateFileSchema>;
