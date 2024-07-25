import {Endpoint} from 'equistamp/server'
import {Evaluation, Model, ModelConnection} from 'equistamp/types'

export class ModelConnections extends Endpoint<ModelConnection>('/modelsconnecter') {
  connectModels = async (connections: ModelConnection[]) => {
    return this.Post('/modelsconnecter', {connections})
  }

  getModelConnections = async (item: Model | Evaluation, item_type: 'model' | 'evaluation') => {
    return this.list({[item_type === 'model' ? 'evaluatee_id' : 'evaluation_id']: item.id})
  }
}
