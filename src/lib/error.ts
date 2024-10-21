import { AxiosError } from 'axios'
const DEFAULT_ERROR_MESSAGE = ''

export type HttpError = AxiosError<{ message: string; statusCode?: string }>

export const errorTransformer = (_props: unknown) => {
  const isAxiosError = _props instanceof AxiosError

  if (!isAxiosError) return { message: DEFAULT_ERROR_MESSAGE, statusCode: null }

  const { status, response } = _props as HttpError
  let message: string = DEFAULT_ERROR_MESSAGE

  if (response?.data && response.data.message) {
    if (Array.isArray(response.data.message)) {
      message = response.data.message.reduce(
        (value, current) => value.concat(current.toUpperCase(), '. '),
        '',
      )
    } else {
      message = response?.data?.message
    }
  }

  return {
    message: message || DEFAULT_ERROR_MESSAGE,
    statusCode: response?.data.statusCode || status,
  }
}
