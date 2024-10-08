import type {FilterConfig, Eval, Task, ID, SchemaHistory} from '@equistamp/types'
import {Endpoint} from '@equistamp/server'

export default class Tasks extends Endpoint<Task>('/task') {
  checkAnswer = async (params: any) => {
    return this.Post('/response', params)
  }

  getTasks = async (evaluation_id: ID, query: FilterConfig) => {
    return this.search('/task', {
      ...query,
      filters: {...(query.filters || {}), evaluation_id},
    })
  }
}

export class Schemas extends Endpoint<SchemaHistory>('/schema') {
  forEvaluation = async (evaluation_id: ID, query: FilterConfig) => {
    return this.list({
      ...query,
      filters: {...(query.filters || {}), evaluation_id},
    })
  }
}
