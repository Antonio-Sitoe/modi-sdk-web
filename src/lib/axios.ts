import axios from 'axios'
import cancelTokenManager from '../utils/cancelrequest'
import { netErrorConections, retryRequest } from '@/utils/net-conexions'

const token = '$2b$10$LbK5CowvIw/41hisDp0douLnlIkD/LpbTnlkCq2TEoqEGUCQalmGa'
const authorization = 'Bearer ' + token

const api_base = import.meta.env.VITE_API_BASE

const api = axios.create({
  baseURL: api_base,
  headers: {
    Authorization: authorization,
    'Content-Type': 'multipart/form-data',
  },
})

api.interceptors.request.use((config) => {
  config.cancelToken = cancelTokenManager.createToken()
  return config
})

api.interceptors.response.use(undefined, (error) => {
  if (error instanceof axios.AxiosError) {
    const errorMessage = netErrorConections[error.code as string] || null
    if (errorMessage) {
      const retryButton = document.querySelector('.offline-ui-retry')
      retryButton?.addEventListener('click', async (e) => {
        e.preventDefault()
        await retryRequest(error)
      })
    }
    return Promise.reject(error)
  }
  return Promise.reject(error)
})

export { cancelTokenManager, api }
