import { z } from 'zod'

export const nuitSchema = z
  .string({
    message: 'Campo obrigatório',
    required_error: 'Campo obrigatório',
  })

  .refine(
    (value) => {
      if (value) {
        // Verifica se o valor tem exatamente 9 dígitos numéricos
        return /^\d{9}$/.test(value)
      }
      return true // Se o NUIT não for fornecido, é considerado válido (por ser opcional)
    },
    {
      message: 'NUIT deve conter exatamente 9 dígitos numéricos',
    },
  )
