import { z } from 'zod';

export const loginSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    phone: z
        .string()
        .min(6, 'Enter a valid phone number')
        .max(20, 'Phone number is too long')
        .regex(/^[0-9+\-\s()]+$/, 'Phone number contains invalid characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
