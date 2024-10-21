import axios, { AxiosError } from 'axios'
import { netErrorConections } from '@/utils/net-conexions'
import { FaceMatchResult } from '@/@types/interfaces'

export async function simulateAsyncCall(shouldFail: boolean, delay = 1500) {
  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject('sssss')
          throw new Error('Simulated error occurred.')
        } else {
          resolve('Simulated success.')
        }
      }, delay) // 1 second delay
    })
    return {
      data: true,
      error: null,
    }
  } catch (error) {
    return { data: null, error }
  }
}

export async function checkQrCodeSdk<T>(
  token_url: string,
  url: {
    url: string
    token: string
  },
) {
  try {
    const formdata = new FormData()
    formdata.append('token_url', token_url)

    const { data } = await axios.post<T>(url.url, formdata, {
      headers: {
        Authorization: 'Bearer ' + url.token,
        'Content-Type': 'multipart/form-data',
      },
    })

    return { data, error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error }
  }
}

export async function getLinkGenerated({
  contact,
  companyId,
  config,
}: {
  contact?: string
  companyId: string
  config: {
    url: string
    token: string
  }
}) {
  const formData = new FormData()
  formData.append('companyId', companyId)
  if (contact) formData.append('contact', contact)
  try {
    const response = await axios.post(config.url, formData, {
      headers: {
        Authorization: 'Bearer ' + config.token,
        'Content-Type': 'multipart/form-data',
      },
    })
    return { data: response.data, error: null, message: '' }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error('Requisição cancelada:', (error as AxiosError).message)
      return {
        data: null,
        error,
        message: 'Requisição cancelada pelo usuário.',
      }
    } else if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message ||
        'Falha ao tentar enviar o link pelo celular'
      console.error('Erro ao obter token:', message)
      return { data: null, error, message }
    } else {
      console.error('Erro ao obter token:', error)
      return {
        data: null,
        error: true,
        message: 'Falha ao tentar enviar o link pelo celular',
      }
    }
  }
}

export async function search_person({
  selfie,
  config,
}: {
  selfie: Blob
  config: {
    url: string
    token: string
  }
}) {
  const formData = new FormData()
  formData.append('face_picture', selfie, 'self.jpg')
  try {
    const { data } = await axios.post(config.url, formData, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    return { data, error: null, message: '' }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error('Requisição cancelada:', (error as AxiosError).message)
      return {
        data: null,
        error,
        message: 'Requisição cancelada',
      }
    } else if (error instanceof axios.AxiosError) {
      const errorMessage = netErrorConections[error?.code as string] || null
      return { data: null, error, message: errorMessage }
    }
    return { data: null, error, message: '' }
  }
}
export async function CheckSubscriberBpin<T>({
  name,
  birthday,
  cell_number,
  config,
}: {
  name: string
  birthday: string
  cell_number: string
  config: {
    url: string
    token: string
  }
}) {
  try {
    const formdata = new FormData()
    formdata.append('name', name)
    formdata.append('birthday', birthday)
    formdata.append('cell_number', cell_number)
    const { data } = await axios.post<T>(config.url, formdata, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    return { data, error: null, message: '' }
  } catch (error) {
    console.error(error)
    if (axios.isCancel(error)) {
      console.error('Requisição cancelada:', (error as AxiosError).message)
      return {
        data: null,
        error,
        message: 'Requisição cancelada',
      }
    } else if (error instanceof axios.AxiosError) {
      const errorMessage = netErrorConections[error?.code as string] || null
      return { data: null, error, message: errorMessage }
    }
    return { data: null, error, message: '' }
  }
}
export async function scanFaceMatch({
  portrait,
  selfie,
  config,
}: {
  selfie: Blob
  portrait: Blob
  config: {
    url: string
    token: string
  }
}) {
  const formData = new FormData()
  formData.append('selfie', selfie)
  formData.append('portrait', portrait)

  try {
    const response = await axios.post<FaceMatchResult>(config.url, formData, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    return { data: response.data, error: null, message: '' }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error('Requisição cancelada:', (error as AxiosError).message)
      return {
        data: null,
        error,
        message: 'Requisição cancelada pelo usuário.',
      }
    } else if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'Erro desconhecido'
      console.error('Erro ao verificar correspondência facial:', message)
      return { data: null, error, message }
    } else {
      console.error('Erro ao verificar correspondência facial:', error)
      return {
        data: null,
        error: true,
        message: 'Falha ao verificar correspondência facial, tente mais tarde.',
      }
    }
  }
}
export async function Subscriber(
  formData: FormData,
  config: {
    url: string
    token: string
  },
) {
  try {
    const { data } = await axios.post<FaceMatchResult>(config.url, formData, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    return { data, error: null, message: '' }
  } catch (error) {
    console.error('Erro ao adicionar subscritor:', error)
    if (axios.isCancel(error)) {
      console.error('Requisição cancelada:', (error as AxiosError).message)
      return {
        data: null,
        error,
        message: 'Requisição cancelada pelo usuário.',
      }
    } else if (error instanceof AxiosError) {
      const errorMessage = netErrorConections[error.code as string] || null
      const message =
        errorMessage ||
        error.response?.data?.message ||
        'Os dados não foram capturados devidamente.'
      return { data: null, error, message }
    } else {
      return {
        data: null,
        error: true,
        message: 'Os dados não foram capturados devidamente.',
      }
    }
  }
}
