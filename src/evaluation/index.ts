import {ID, Evaluation, EvaluationCheck, Model, ModelConnection} from 'equistamp/types'
import {Get, Post, Put, Delete} from 'equistamp/server'

export const createEvaluation = async (e: Evaluation): Promise<Evaluation> => Post('/evaluation', e)
export const getEvaluation = async (evalID: ID): Promise<Evaluation> =>
  Get('/evaluation', {id: evalID})
export const updateEvaluation = async (e: Evaluation) => Put('/evaluation', e)

export const connectModels = async (connections: ModelConnection[]) =>
  Post('/modelsconnecter', {connections})

export const getModelConnections = async (
  item: Model | Evaluation,
  item_type: 'model' | 'evaluation',
) =>
  Get('/modelsconnecter', {
    [item_type === 'model' ? 'evaluatee_id' : 'evaluation_id']: item.id,
  })

export const removeSubscription = async ({id}: ModelConnection) => Delete('/modelsconnecter', {id})

export const bulkTasksUpload = async ({
  id,
  csv_url,
  default_task_type,
  columns_mapping,
  references,
  dry_run,
}: Evaluation & {dry_run?: boolean}): Promise<EvaluationCheck> => {
  const params = {
    evaluation_id: id,
    csv_url,
    default_task_type,
    dry_run,
    columns_mapping,
    references,
  }
  return Post('/evaluationbuilderhandler', params)
}
export const checkEvaluationUrl = async (e: Evaluation): Promise<EvaluationCheck> =>
  bulkTasksUpload({...e, dry_run: true})

export const fetchEvaluationTasksHeaders = async (url: string): Promise<EvaluationCheck> =>
  Get('/evaluationbuilderhandler', {csv_url: url, only_header: true})
