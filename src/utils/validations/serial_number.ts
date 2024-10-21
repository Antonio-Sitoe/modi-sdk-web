import { z } from 'zod'

export const serialNumberSchema = z
  .string({
    required_error: 'Digite o número do provedor',
  })
  .min(1, 'Digite o número do provedor')
