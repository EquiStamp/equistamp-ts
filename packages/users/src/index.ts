import type {User, FilterConfig, APISettings} from '@equistamp/types'
import {Endpoint} from '@equistamp/server'
import Auth from '@equistamp/auth'

export default class Users extends Endpoint<User>('/user') {
  auth: Auth

  constructor(settings: APISettings) {
    super(settings)
    this.auth = new Auth(settings)
  }

  list = async (query: FilterConfig) => {
    return {items: [], count: 0}
  }

  update = async (user: User | null) => {
    if (!user) {
      await this.auth.logout()
    } else if (this.auth.isLoggedIn()) {
      return this.Put('/user', user)
    }
  }

  register = async (user: User) => {
    if (!user.password) {
      throw new Error('Missing password')
    }

    try {
      const response = await this.Post('/user', user)

      this.auth.setSession(response)
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
