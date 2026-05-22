import { z } from 'zod';

export const ListRepositoriesSchema = z.object({
    username: z.string().min(1, 'username es requerido'),
});

export type ListRepositoriesInput = z.infer<typeof ListRepositoriesSchema>;