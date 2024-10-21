import { z } from 'zod'
import { removeNonNumeric } from '../general'
export const phoneRegex = /^(84|85|82|83|86|87)\d*$/
export const phoneSchema = z
  .string({
    required_error: 'Campo obrigatório',
  })
  .transform((data) => removeNonNumeric(data))
  .refine((phone) => phone && phoneRegex.test(phone), {
    message: 'Telemóvel deve começar com 84, 85, 82, 83, 86 ou 87',
  })
  .refine((phone) => phone.length === 9, {
    message: 'Digite um número com 9 dígitos',
  })
  .refine(
    (data) => {
      if (data) {
        const staticNumber = ['84', '85', '82', '83', '86', '87']
        return staticNumber.some((prefix) => data.startsWith(prefix))
      }
      return true
    },
    {
      message: 'Digite um número Moçambicano',
      path: ['phone'],
    },
  )
