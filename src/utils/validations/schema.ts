/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from 'zod'
import { Type } from '@/@types/types'
import { nuitSchema } from './nuit'
import { fileSchema } from './file'
import { nameSchema } from './name'
import { emailSchema } from './email'
import { phoneSchema } from './phone'
import { birthdaySchema } from './birthday'
import { serialNumberSchema } from './serial_number'

const fieldSchemas = {
  name: nameSchema,
  phoneNumber: phoneSchema,
  birthday: birthdaySchema,
  nuit: nuitSchema,
  email: emailSchema,
  serial_number: serialNumberSchema,
  file: fileSchema,
}

export function CreateSchema(
  formFields: Array<{
    name: string
    required: boolean
    type: Type
  }>,
) {
  const objectSchema = {}
  console.log('formFields', formFields)
  formFields.forEach((field) => {
    const fieldName = field.name

    if (field.type === 'EMAIL|PHONE') {
      // @ts-ignore
      objectSchema.email = emailSchema.optional()
      // @ts-ignore
      objectSchema.phoneNumber = phoneSchema.optional()
    } else if (field.type === 'FILE|DOCS') {
      // @ts-ignore
      objectSchema[fieldName] = fieldSchemas.file
      if (field.required === false) {
        // @ts-ignore
        objectSchema[fieldName] = fieldSchemas.file.optional()
      }
    } else {
      // @ts-ignore
      if (fieldSchemas[fieldName]) {
        // @ts-ignore
        objectSchema[fieldName] = fieldSchemas[fieldName]
        if (field.required === false) {
          // @ts-ignore
          objectSchema[fieldName] = objectSchema[fieldName].optional()
        }
      }
    }
  })

  // Retornar o esquema Zod com os campos dinâmicos
  return z.object({
    ...objectSchema,
  })
}

//  [x] FAZER UMA FUNCAO QUE RECEBE UM ARRAY DE CAMPOS E RETORNA SCHEMA
//  [x] MELHOR E FILTRAR O ARRAY ANTES (COLOCAR O NAME, REQUIRED COMO PROPS PORQUE NA VERDADE E O QUE PRECISO)
//  [x] FAZER A VERIFICACAO DOS CAMPOS PARA VER SE INCLUIEM NO ARRAY, SE INCLUIREM ADICIONAR AO OBJECTO
//  [x] GERIR ESTADO DE REQUIRED OU NAO

// [] ADICIONAR MAIS CAMPOS NO SCHEMA DO ZUSTAND
// [] ORGANIZAR O SCHEMA SCHEMA DO ZUSTAND PARA ATENDER MELHOR AO SDK
// [] colocar schema de cores na api
// [] TESTAR O FUNCIONAMENTO
// [] DOCUMENTAR O OBJECTO
