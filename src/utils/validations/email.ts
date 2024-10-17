import { z } from 'zod';

export const emailSchema = z.string().email('Digite um email válido');
