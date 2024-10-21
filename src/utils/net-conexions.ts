import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export const netErrorConections: Record<string, string> = {
  ERR_NETWORK: 'Erro de ligação, verifique a sua internet!',
  ERR_INTERNET_DISCONNECTED: 'Sem conexão com a Internet.',
  ERR_CONNECTION_TIMED_OUT:
    'A conexão com o servidor demorou muito para responder.',
  ERR_NAME_NOT_RESOLVED: 'Não foi possível resolver o nome de domínio.',
  ERR_CONNECTION_REFUSED: 'Conexão recusada pelo servidor.',
  ERR_PROXY_CONNECTION_FAILED: 'Falha na conexão através do proxy.',
  ERR_CONNECTION_RESET: 'A conexão foi reiniciada.',
  ERR_SSL_PROTOCOL_ERROR: 'Erro no protocolo SSL.',
}

export async function retryRequest(
  error: AxiosError,
): Promise<AxiosResponse | never> {
  const config = error.config as AxiosRequestConfig & { retryCount?: number }
  config.retryCount = config.retryCount || 0
  if (config.retryCount < 3) {
    // Tenta até 3 vezes
    config.retryCount += 1
    try {
      const response = await axios.request(config)
      return response
    } catch (retryError) {
      console.error('Retry failed:', retryError)
      throw retryError
    }
  } else {
    throw error
  }
}
