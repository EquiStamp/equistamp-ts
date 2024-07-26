import type {LoginParams} from '@equistamp/types'
import BaseAPI from '@equistamp/server'

const getSessionId = () =>
  Object.fromEntries(document.cookie.split('; ').map((v) => v.split('='))).sessionId

export const setSessionCookie = async (session_token: string, expiration: Date) => {
  // Convert the date to UTC format for the cookie expiration
  const expires = '; expires=' + expiration.toUTCString()

  // Set the session ID cookie with the provided expiration date
  document.cookie = 'sessionId=' + session_token + expires + '; path=/; SameSite=Strict; Secure'

  return true
}

export const setSession = async (response: any) => {
  const {session_token, token_expiration} = response
  const expirationDate = new Date(token_expiration)
  await setSessionCookie(session_token, expirationDate)
  return response
}

export default class Auth extends BaseAPI {
  login = async (params: LoginParams) => {
    const response = await this.Put('/auth', params)
    // Set the session ID cookie
    return !!(await setSession(response))
  }

  logout = async () => {
    document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    return true
  }

  isLoggedIn = () => !!getSessionId()

  me = async () => {
    if (!this.isLoggedIn()) return null

    return this.Get('/auth').catch(async (e) => {
      if ((e || '').toString().includes('Unauthorised')) {
        await this.logout()
      }
      return null
    })
  }

  setSession = async (response: any) => {
    const {session_token, token_expiration} = response
    const expirationDate = new Date(token_expiration)
    await setSessionCookie(session_token, expirationDate)
    return response
  }
}
