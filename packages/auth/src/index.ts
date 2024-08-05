import type {LoginParams, TokenStorage} from '@equistamp/types'
import {API_TOKEN, COOKIE} from '@equistamp/constants'
import BaseAPI from '@equistamp/server'

const getSessionId = () =>
  typeof document !== 'undefined' &&
  Object.fromEntries(document.cookie.split('; ').map((v) => v.split('='))).sessionId

export const setSessionCookie = (session_token: string, expiration: Date) => {
  // Convert the date to UTC format for the cookie expiration
  const expires = '; expires=' + expiration.toUTCString()

  // Set the session ID cookie with the provided expiration date
  document.cookie = 'sessionId=' + session_token + expires + '; path=/; SameSite=Strict; Secure'

  return true
}

export default class Auth extends BaseAPI {
  /** Log in to the service
   *
   *  `login` can be either a user name or an email address.
   *
   *  The server will return a session token upon successful log in. This can be used for
   *  up to 7 days for authentication by setting it in the `Session-Token` header.
   *  For longer usage, use the `Api-Token` header. This can be done by setting `storage` to `api_token`
   *  when calling this function. So:
   *
   *  For short term session, e.g. in browsers use the following (note - this will set a `sessionId` cookie):
   *  await auth.login({login: <user email or user name>, password: <user password>})
   *
   *  For short term sessions without setting a `sessionId` cookie, use:
   *  await auth.login({login: <user email or user name>, password: <user password>, storage: 'session_token'})
   *
   *  For longer running usage:
   *
   *  await auth.login({login: <user email or user name>, password: <user password>, storage: 'api_token'})
   *  console.log(auth.apiToken)
   */
  login = async ({storage, ...params}: LoginParams) => {
    const response = await this.Put('/auth', params)
    this.setTokens(response.session_token)

    if (!storage || storage === COOKIE) {
      this.setSession(response)
    } else if (storage == API_TOKEN) {
      this.setTokens(undefined, await this.getApiToken())
    }
    return true
  }

  /** Log out the user
   *
   * This will clear out all credentials from the object.
   * In browsers, this will also clear any sessionId cookie.
   */
  logout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }
    this.setTokens(undefined, undefined)
    return true
  }

  isLoggedIn = () => !!(getSessionId() || this.sessionToken || this.apiToken)

  /** Fetch the logged in user's information
   *
   * `fields` can be used to specify exactly which fields should be returned - the default is to return everything
   * other than the API token.
   * You can use this to get the API token by calling:
   *
   *  await auth.me(['api_token'])
   *
   */
  me = async (fields?: string[]) => {
    if (!this.isLoggedIn()) return null

    return this.Get('/auth', {fields}).catch(async (e) => {
      if ((e || '').toString().includes('Unauthorised')) {
        this.logout()
      }
      return null
    })
  }

  setSession = async (response: any) => {
    if (typeof document === 'undefined') {
      return false
    }
    const {session_token, token_expiration} = response
    const expirationDate = new Date(token_expiration)
    setSessionCookie(session_token, expirationDate)
    this.setTokens(session_token)
    return response
  }

  /** Load session id from storage
   *
   *  Currently only supports browser cookies
   */
  getSessionId = (storage?: TokenStorage) => {
    if (!storage || storage == COOKIE) {
      this.setTokens(getSessionId())
    }
    return this.sessionToken
  }

  getApiToken = async () => {
    const res = await this.me(['api_token'])
    return res?.api_token
  }

  revokeTokens = async () => this.Put('/auth', {revoke: true})
}
