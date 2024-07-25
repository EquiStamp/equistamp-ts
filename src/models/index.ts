import {Endpoint} from 'equistamp/server'
import type {Model, FilterConfig} from 'equistamp/types'

const asMillionTokens = (val?: number) => (val ? val * 4000000 : 0)

const addPricing = (m: Model) => ({
  ...m,
  cost_per_1M_input_tokens_usd: asMillionTokens(m.cost_per_input_character_usd) || undefined,
  cost_per_1M_output_tokens_usd: asMillionTokens(m.cost_per_output_character_usd) || undefined,
})

export class Models extends Endpoint<Model>('/model') {
  list = async (query: FilterConfig) => {
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
    const res = await this.search(this.endpoint, params)
    return {...res, items: (res.items as Model[]).map(addPricing)}
  }
}
