import {ID, AcceptableOverrides, Overrides} from '@equistamp/types'
import BaseAPI from '@equistamp/server'

export default class Tester extends BaseAPI {
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
