import type {
  FilterConfig,
  ID,
  EvaluationsResult,
  ItemType,
  SearchResult,
  Eval,
  EvaluationSession,
  Data,
} from '@equistamp/types'
import {Endpoint} from '@equistamp/server'

export default class EvaluationSessions extends Endpoint<Eval>('/evaluationsession') {
  create = async (data: EvaluationSession) => {
    return this.Post(this.endpoint, data as Data)
  }

  getResponses = async (params: FilterConfig) => {
    return params?.filters?.evaluation_session_id
      ? this.search('/response', params)
      : {items: [], count: 0}
  }

  buyReport = async (eval_session_id: ID) =>
    this.Post('/paymentshandler', {
      type: 'report',
      evaluation_session_id: eval_session_id,
    })

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

  getRunsForModel = async (modelId: ID): Promise<SearchResult> => {
    return this.list({filters: {models: [{id: modelId, name: ''}]}})
  }

  getRunsForEvaluation = async (evalId: ID): Promise<SearchResult> => {
    return this.list({filters: {evaluations: [{id: evalId, name: ''}]}})
  }

  getHumanTasks = async (evalId: string, restart?: boolean): Promise<Eval> => {
    return this.Post('/evaluationsession', {
      evaluation_id: evalId,
      is_human_being_evaluated: true,
      restart,
    })
  }
}
