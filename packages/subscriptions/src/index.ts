import {Endpoint} from '@equistamp/server'
import type {Subscription} from '@equistamp/types'

export default class Subscriptions extends Endpoint<Subscription>('/subscriptions') {
  subscribeAlert = async (alertId: string) => {
    return this.Post('/subscription', {item: alertId, type: 'alert'})
  }

  unsubscribeAlert = async (alertId: string) => {
    return this.Delete('/subscription', {item: alertId, type: 'alert'})
  }

  confirm = async (token: string) => {
    return this.Put('/subscription', {id: token, confirmed: true})
  }
}
