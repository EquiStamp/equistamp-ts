import {CodeStage, DSLCode, TaskType, ID} from '@equistamp/types'
import BaseAPI from '@equistamp/server'

export type AcceptableOverrides = {
  stage?: CodeStage
  code: DSLCode
  request?: string
  response?: string
  'endpoint-type'?: string
  schema?: string
  'task-type'?: TaskType
  task?: string
  'choices-text'?: string
  'letter-choices'?: string
  'num-choices'?: number
  prompt?: string
  expected?: string
  correct?: boolean
  'positive-examples'?: string[]
  'negative-examples'?: string[]
}

type Overrides = {
  system_prompt?: DSLCode
  prompt?: DSLCode
  request?: DSLCode
  response?: DSLCode
  grader?: DSLCode
}

export class Tester extends BaseAPI {
  testDSL = async ({code, stage, response, ...overrides}: AcceptableOverrides) => {
    return this.Post('/dsltest', {
      context: overrides,
      code,
      stage,
      response,
    })
  }

  evaluateTask = async (model_id: ID, task_id: ID, overrides?: Overrides) => {
    this.Post('/queryexternalmodelhandler', {
      model_id,
      task_id,
      ...(overrides || {}),
    })
  }
}
