import type {User, LoginParams, FilterConfig} from 'equistamp/types'
import {Endpoint} from 'equistamp/server'

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

export const logout = async () => {
  document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  return true
}

export const isLoggedIn = () => !!getSessionId()

export class Users extends Endpoint<User>('/user') {
  list = async (query: FilterConfig) => {
    return {items: [], count: 0}
  }

  login = async (params: LoginParams) => {
    const response = await this.Put('/auth', params)
    // Set the session ID cookie
    return !!(await setSession(response))
  }

  me = async () => {
    if (!isLoggedIn()) return null

    return this.Get('/auth').catch(async (e) => {
      if ((e || '').toString().includes('Unauthorised')) {
        await logout()
      }
      return null
    })
  }

  update = async (user: User | null) => {
    if (!user) {
      await logout()
    } else if (isLoggedIn()) {
      return this.Put('/user', user)
    }
  }

  register = async (user: User) => {
    if (!user.password) {
      throw new Error('Missing password')
    }

    try {
      const response = await this.Post('/user', user)

      setSession(response)
      return response
    } catch (error) {
      console.error('Failed to register user: ', error)
      throw await error
    }
  }

  resetPassword = async (reset_email: string) => {
    return this.Put('/auth', {reset_email})
  }

  subscribe = async (level: string) => {
    return this.Get('/paymentshandler', {product: level})
  }

  manageSubscription = async (user: User, subType?: string) => {
    return this.Put('/paymentshandler', {id: user.id, type: subType})
  }

  buyCredits = async () => {
    return this.Post('/paymentshandler', {type: 'credits'})
  }
}
