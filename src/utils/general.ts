/* eslint-disable @typescript-eslint/no-explicit-any */

export function BASE64toBLOB(base64: string): Blob {
  let contentType = 'image/jpeg'
  let byteString: string
  if (base64?.includes(',')) {
    const parts = base64.split(',')
    if (parts[0].includes(':')) {
      contentType = parts[0].split(':')[1].split(';')[0]
    }
    byteString = atob(parts[1])
  } else {
    byteString = atob(base64)
  }
  const byteNumbers = new Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: contentType })
}

export function converteDate(dateString: string) {
  if (typeof dateString === 'string' && dateString?.includes('-')) {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }
  return dateString
}

export function capitalizeString(str: string) {
  if (typeof str === 'string')
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  return str
}

export function getImageSrc(base64: any) {
  if (typeof base64 === 'string') {
    if (!base64.includes('data:image/jpg;base64')) {
      return `data:image/jpg;base64,${base64}`
    } else {
      return base64
    }
  }
  return base64
}

export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 9)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{3})(\d{4})$/, '$1 $2')
}

export const removeNonNumeric = (value: string) => {
  return value.replace(/\D/g, '')
}

export function isFalsy(value: any): boolean {
  if (value === false) {
    return true
  }
  if (!value) {
    if (value === 0 || value === '' || value === null || value === undefined) {
      return true
    }
    if (
      typeof value === 'string' &&
      (value.trim() === '' ||
        value.trim().toLowerCase() === 'undefined' ||
        value.trim().toLowerCase() === 'null')
    ) {
      return true
    }
  }
  return false
}

export function validateData(
  value: any,
  message: string = 'Valor não definido'
): string | any {
  if (isFalsy(value)) {
    return message
  } else {
    return value
  }
}

export function formateDateBirth(input: any): string {
  const defaultDate = input

  if (input == undefined) {
    return defaultDate
  }
  if (input == null) {
    return defaultDate
  }
  const date = new Date(input)

  if (isNaN(date.getTime())) {
    return defaultDate
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function extractToken(url: string) {
  const parts = url.split('token=') // Dividir a URL por '/'
  return parts[parts.length - 1] // Retornar o último elemento que é o token
}

export function getPathData(path: string) {
  const p = path.replaceAll('/', '').trim()

  return p || 'initial'
}
export function isRedTone(hex: string): boolean {
  // Verifica se o hex é válido e tem o formato correto (# seguido de 6 caracteres)
  if (!/^#([0-9A-Fa-f]{6})$/.test(hex)) {
    return false
  }

  // Extrai os valores de R, G e B do hexadecimal
  const red = parseInt(hex.slice(1, 3), 16) // RR
  const green = parseInt(hex.slice(3, 5), 16) // GG
  const blue = parseInt(hex.slice(5, 7), 16) // BB

  // Define uma diferença mínima para garantir que o vermelho seja predominante
  return red > 1.5 * green && red > 1.5 * blue
}

const MAX_FILE_NAME_LENGTH = 20

export function truncateFileName(name: string): string {
  if (name.length <= MAX_FILE_NAME_LENGTH) return name
  const extension = name.split('.').pop()
  const nameWithoutExtension = name.substring(0, name.lastIndexOf('.'))
  const truncatedName = nameWithoutExtension.substring(
    0,
    MAX_FILE_NAME_LENGTH - 3 - (extension?.length || 0)
  )
  return `${truncatedName}...${extension ? `.${extension}` : ''}`
}
