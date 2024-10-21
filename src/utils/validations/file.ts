import { z } from 'zod'

const ACCEPTED_FILE_TYPES = ['.docx', '.pdf', '.doc', '.jpg', '.jpeg', '.png']
export const fileSchema = z
  .any()
  .refine((files) => !!(files?.length >= 1), {
    message: 'Arquivo é obrigatório.',
  })
  .refine(
    (files) => {
      return ACCEPTED_FILE_TYPES.some((typeDocs) => files?.includes(typeDocs))
    },
    {
      message: 'Apenas arquivos .pdf, .doc e .docx são aceitos.',
    },
  )
