import dayjs from 'dayjs';
import { z } from 'zod';

function calculateAge(dataNascimento: string): number {
  const hoje: dayjs.Dayjs = dayjs();
  const nascimento: dayjs.Dayjs = dayjs(dataNascimento);
  return hoje.diff(nascimento, 'year');
}

export const birthdaySchema = z.coerce
  .string({
    message: 'Campo obrigatório',
    required_error: 'Campo obrigatório',
  })
  .refine(date => dayjs(date).isValid(), {
    message: 'Digite uma data valida',
  })
  .refine(
    date => {
      const age = calculateAge(date);
      return age >= 18 && age <= 100;
    },
    {
      message: 'A idade deve estar entre 18 e 100 anos',
    },
  );
