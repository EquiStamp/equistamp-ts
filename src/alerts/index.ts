import type {FilterConfig, Alert} from 'equistamp/types'
import {Endpoint} from 'equistamp/server'

export class Alerts extends Endpoint<Alert>('/alert') {
  list = async (query: FilterConfig) => {
    const filters = query.filters || {}
    const fields = filters.fields || [
      'id',
      'last_trigger_date',
      'owner_id',
      'owner',
      'name',
      'description',
      'trigger_cooldown',
      'public',
      'triggers',
    ]
    const params = {...query, filters: {...filters, fields}}
    return this.search(this.endpoint, params)
  }

  setSubscription = async (alertId: string, isSubscribed: boolean) => {
    return this.Put('/alert', {id: alertId, isSubscribed})
  }
}
