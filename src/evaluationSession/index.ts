import type {
  FilterConfig,
  ID,
  EvaluationsResult,
  ItemType,
  SearchResult,
  Eval,
} from 'equistamp/types'
import {Endpoint} from 'equistamp/server'

export class EvaluationSessions extends Endpoint<Eval>('/evaluationsession') {
  getResponses = async (params: FilterConfig) => {
    return params?.filters?.evaluation_session_id
      ? this.search('/response', params)
      : {items: [], count: 0}
  }

  buyReport = async (eval_session_id: ID) => {
    return this.Post('/paymentshandler', {
      type: 'report',
      evaluation_session_id: eval_session_id,
    })
  }

  getEvaluationRuns = async (params: FilterConfig, group: ItemType): Promise<EvaluationsResult> => {
    const filters = {...(params.filters || {}), binned: true}
    const query = {...params, groupBy: group, filters}
    return (await this.search(this.endpoint, query)) as unknown as EvaluationsResult
  }

  getRuns = async (params: FilterConfig): Promise<SearchResult> => {
    if (!params?.filters?.evaluations && !params?.filters?.models) {
      return {count: 0, items: []}
    }
    return this.list(params)
  }
}
