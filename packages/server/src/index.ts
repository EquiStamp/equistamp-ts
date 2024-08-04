import {GET, POST, DELETE, PUT} from '@equistamp/constants'
import type {
  FilterConfig,
  SearchResult,
  ItemType,
  APISettings,
  Data,
  HTTPMethod,
} from '@equistamp/types'
type Headers = {[k: string]: string}
type QueryProps = {
  server: string
  endpoint: string
  headers?: Headers
  data?: Data
  method?: HTTPMethod
}

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

export const query = async ({
  server,
  endpoint: callEndpoint,
  headers,
  data,
  method: callMethod,
}: QueryProps) => {
  const method = callMethod || GET
  const endpoint = [GET, DELETE].includes(method) ? callEndpoint + paramsString(data) : callEndpoint
  const body = [POST, PUT].includes(method) ? data && JSON.stringify(data) : undefined

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
    apiCallCache[key] = fetch(`${server}${endpoint}`, {
      method,
      body,
      headers,
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

export const Get = async (props: QueryProps) => query(props)
export const Post = async (props: QueryProps) => query({...props, method: POST})
export const Put = async (props: QueryProps) => query({...props, method: PUT})
export const Delete = async (props: QueryProps) => query({...props, method: DELETE})

type ExtraOptions = {
  groupBy?: ItemType
}
export const Search = async (
  props: QueryProps,
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
  return Get({...props, data: queryParams})
}

class BaseAPI {
  baseURL: string
  headers: Headers
  apiToken?: string
  sessionToken?: string

  constructor({server, sessionToken, apiToken}: APISettings) {
    this.baseURL = server || 'http://localhost:3001'
    this.sessionToken = sessionToken
    this.apiToken = apiToken
    this.headers = this.makeHeaders({sessionToken, apiToken})
  }

  setTokens = (sessionToken?: string, apiToken?: string) => {
    this.sessionToken = sessionToken
    this.apiToken = apiToken
    this.headers = this.makeHeaders({sessionToken, apiToken})
  }

  makeHeaders = ({sessionToken, apiToken}: APISettings) => {
    let headers = {
      'Content-Type': 'application/json',
    } as Headers
    if (sessionToken) {
      headers['Session-Token'] = sessionToken
    } else if (apiToken) {
      headers['Api-Token'] = apiToken
    }
    return headers
  }

  request = async (endpoint: string, data?: Data, method?: HTTPMethod) => {
    return query({server: this.baseURL, endpoint, headers: this.headers, data, method})
  }

  Get = async (endpoint: string, data?: Data) => {
    return query({endpoint, server: this.baseURL, headers: this.headers, method: GET, data})
  }

  Post = async (endpoint: string, data?: Data) => {
    return query({endpoint, server: this.baseURL, headers: this.headers, method: POST, data})
  }

  Put = async (endpoint: string, data?: Data) => {
    return query({endpoint, server: this.baseURL, headers: this.headers, method: PUT, data})
  }

  Delete = async (endpoint: string, data?: Data) => {
    return query({endpoint, server: this.baseURL, headers: this.headers, method: DELETE, data})
  }

  search = async (endpoint: string, params: FilterConfig & ExtraOptions) => {
    return Search({endpoint, server: this.baseURL, headers: this.headers}, params)
  }
}

export default BaseAPI

export function Endpoint<T>(endpoint: string) {
  return class extends BaseAPI {
    endpoint = endpoint

    create = async (data: T) => {
      return this.Post(this.endpoint, data as Data)
    }

    list = async (query: FilterConfig) => {
      return this.search(this.endpoint, query)
    }

    fetch = async (id: string) => {
      return this.Get(this.endpoint, {id})
    }

    update = async (item: T) => {
      return this.Put(this.endpoint, item as Data)
    }

    remove = async (item: T) => {
      return this.Delete(this.endpoint, item as Data)
    }
  }
}
