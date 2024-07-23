import type {FilterConfig, SearchResult, ItemType, Contact} from './types'

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'
// export const API_BASE_URL = 'https://equistamp.net'

export const getSessionId = () =>
  Object.fromEntries(document.cookie.split('; ').map((v) => v.split('='))).sessionId

type CallCache = {
  [k: string]: Promise<any>
}
const apiCallCache: CallCache = {}

export class ServerError extends Error {
  status: number
  error: string | {[k: string]: any}

  constructor(status: number, error: string | {[k: string]: any}) {
    super()
    this.status = status
    this.error = error
  }
}

const paramsString = (params: any) =>
  !params
    ? ''
    : '?' +
      Object.entries(params)
        .filter(([k, v]) => k && ![null, undefined].includes(v as any))
        .map(([k, v]) => `${k}=${v}`)
        .join('&')

export const query = async (callEndpoint: string, data?: any, callMethod?: string) => {
  const method = callMethod || 'GET'
  const endpoint = ['GET', 'DELETE'].includes(method)
    ? callEndpoint + paramsString(data)
    : callEndpoint
  const body = ['POST', 'PUT'].includes(method) ? data && JSON.stringify(data) : undefined

  const getContents = (resp: Response) => {
    const contentType = resp.headers.get('Content-Type') || 'application/json'
    if (contentType === 'application/json') {
      return resp.json()
    } else if (contentType === 'text/csv') {
      return resp.blob()
    }
    return resp.text()
  }

  // Create a unique key based on the endpoint and serialized parameters
  const key = `${method}${callEndpoint}?${JSON.stringify(data)}`
  if (!apiCallCache[key]) {
    apiCallCache[key] = fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      body,
      headers: {
        'Content-Type': 'application/json',
        'Session-Token': getSessionId() || '',
      },
    })
      .then(async (response) => {
        delete apiCallCache[key]
        if (!response.ok) {
          throw new ServerError(response.status, await getContents(response))
        }
        return getContents(response)
      })
      .catch((error) => {
        delete apiCallCache[key]
        throw error
      })
  }
  return apiCallCache[key]
}

export const Get = async (endpoint: string, params?: any) => query(endpoint, params)
export const Post = async (endpoint: string, data: any) => query(endpoint, data, 'POST')
export const Put = async (endpoint: string, data: any) => query(endpoint, data, 'PUT')
export const Delete = async (endpoint: string, params?: any) => query(endpoint, params, 'DELETE')

type ExtraOptions = {
  groupBy?: ItemType
}
export const Search = async (
  endpoint: string,
  params: FilterConfig & ExtraOptions,
): Promise<SearchResult> => {
  if (!params) return {items: [], count: 0}
  const {sort, filters, groupBy, perPage, page} = params
  const queryParams: any = {groupBy, perPage, page, ...filters}

  if (filters?.evaluations) {
    queryParams.evaluations = filters.evaluations.map((e) => e.id)
  }
  if (filters?.models) {
    queryParams.models = filters.models.map((m) => m.id)
  }

  if (sort) {
    if (sort.direction === 'Asc') {
      queryParams.order_by = sort.key
    } else if (sort.direction === 'Desc') {
      queryParams.order_by_desc = sort.key
    }
  }
  return Get(endpoint, queryParams)
}

export const contact = async (params: Contact) => Post('/contact', params)
