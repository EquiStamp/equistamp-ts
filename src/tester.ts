import {CodeStage, DSLCode, TaskType, ID} from './types'
import {Post} from './server'

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
  'positive-examples': string[]
  'negative-examples': string[]
}
export const testDSL = async (code: DSLCode, overrides: AcceptableOverrides) =>
  Post('/dsltest', {
    context: overrides,
    code,
    stage: overrides.stage,
    response: overrides.response,
  })

type Overrides = {
  system_prompt?: DSLCode
  prompt?: DSLCode
  request?: DSLCode
  response?: DSLCode
  grader?: DSLCode
}
export const evaluateTask = async (model_id: ID, task_id: ID, overrides?: Overrides) =>
  Post('/queryexternalmodelhandler', {
    model_id,
    task_id,
    ...(overrides || {}),
  })
