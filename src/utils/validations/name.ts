import { z } from 'zod';

export const nameSchema = z
  .string({ required_error: 'Campo obrigatório' })
  .refine(
    value => {
      const names = value.trim().split(/\s+/);
      return names.length >= 2;
    },
    {
      message: 'O nome completo deve conter no mínimo dois nomes',
    },
  )
  .refine(
    value => {
      return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value);
    },
    {
      message: 'O nome não deve conter caracteres especiais (@, *, !, etc)',
    },
  )
  .refine(
    value => {
      const forbiddenPatterns = [
        /--/,
        /;/,
        /\b(SELECT|UPDATE|DELETE|INSERT|WHERE|DROP|TABLE|FROM)\b/i,
      ];
      return !forbiddenPatterns.some(pattern => pattern.test(value));
    },
    {
      message: 'O nome contém caracteres ou palavras não permitidas',
    },
  );
