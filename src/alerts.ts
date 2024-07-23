import type {FilterConfig, Alert} from './types'
import {Search, Get, Post, Put, Delete} from './server'

export const getAlerts = async (query: FilterConfig) => {
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
  return Search('/alert', params)
}

export const getAlert = async (alertId: string) => Get('/alert', {id: alertId})
export const setSubscription = async (alertId: string, isSubscribed: boolean) =>
  Put('/alert', {id: alertId, isSubscribed})
export const updateAlert = async (alert: Alert) => Put('/alert', alert)
export const createAlert = async (a: Alert) => Post('/alert', a)
export const deleteAlert = async (a: Alert) => Delete('/alert', a)
