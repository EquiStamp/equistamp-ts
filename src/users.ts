import type {User, LoginParams} from './types'
import {Get, Post, Put, getSessionId} from './server'

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

export const login = async (params: LoginParams) => {
  const response = await Put('/auth', params)
  // Set the session ID cookie
  return !!(await setSession(response))
}

export const logout = async () => {
  document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  return true
}

export const isLoggedIn = () => !!getSessionId()

export const getMe = async () => {
  if (!isLoggedIn()) return null

  return Get('/auth').catch(async (e) => {
    if ((e || '').toString().includes('Unauthorised')) {
      await logout()
    }
    return null
  })
}

export const updateUser = async (user: User | null) => {
  if (!user) {
    await logout()
  } else if (isLoggedIn()) {
    return await Put('/user', user)
  }
}

export const register = async (user: User) => {
  if (!user.password) {
    throw new Error('Missing password')
  }

  try {
    const response = await Post('/user', user)

    setSession(response)
    return response
  } catch (error) {
    console.error('Failed to register user: ', error)
    throw await error
  }
}

export const resetPassword = async (reset_email: string) => Put('/auth', {reset_email})

export const getUser = async (id: string) => await Get('/user', {id})

export const subscribe = async (level: string) => Get('/paymentshandler', {product: level})
export const manageSubscription = async (user: User, subType?: string) =>
  Put('/paymentshandler', {id: user.id, type: subType})

export const buyCredits = async () => Post('/paymentshandler', {type: 'credits'})
