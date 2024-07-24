import {Get, Search, Post, Put} from 'equistamp/server'
import type {Model, FilterConfig} from 'equistamp/types'

const asMillionTokens = (val?: number) => (val ? val * 4000000 : 0)

const addPricing = (m: Model) => ({
  ...m,
  cost_per_1M_input_tokens_usd: asMillionTokens(m.cost_per_input_character_usd) || undefined,
  cost_per_1M_output_tokens_usd: asMillionTokens(m.cost_per_output_character_usd) || undefined,
})

export const getModels = async (query: FilterConfig) => {
  const filters = query.filters || {}
  const fields = filters.fields || [
    'id',
    'name',
    'description',
    'publisher',
    'score',
    'elo_score',
    'statistics',
    'availability',
    'cost_per_input_character_usd',
    'cost_per_output_character_usd',
    'cost_per_instance_hour_usd',
    'token_cost',
  ]
  const params = {...query, filters: {...filters, fields}}
  const res = await Search('/model', params)
  return {...res, items: (res.items as Model[]).map(addPricing)}
}

export const getModel = async (modelId: string) => Get('/model', {id: modelId})

export const updateModel = async (model: Model) => Put('/model', model)

export const createModel = async (m: Model) => Post('/model', m)

export type CodeParams = {
  stage: 'request' | 'response' | 'grader'
  response?: any
  parsed_response?: any
}
export const testCode = async (code: string, params: CodeParams) =>
  Post('/dsltest', {...params, code})
