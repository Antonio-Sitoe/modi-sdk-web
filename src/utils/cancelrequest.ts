import axios, { CancelTokenSource } from 'axios'

class CancelTokenManager {
  private sources: CancelTokenSource[] = []

  createToken() {
    const source = axios.CancelToken.source()
    this.sources.push(source)
    return source.token
  }

  cancelAll() {
    this.sources.forEach((source) => source.cancel('Operação Cancelada'))
    this.sources = []
  }
}

const Cancelable = new CancelTokenManager()

export default Cancelable
