import {FilterConfig, SearchResult, Evaluation, EvaluationCheck} from '@equistamp/types'
import {Endpoint} from '@equistamp/server'

export default class Evaluations extends Endpoint<Evaluation>('/evaluation') {
  list = async (query: FilterConfig): Promise<SearchResult> => {
    const filters = query.filters || {}
    const fields = filters.fields || [
      'id',
      'name',
      'description',
      'public',
      'public_usable',
      'reports_visible',
      'tags',
      'modalities',
      'task_types',
      'num_tasks',
      'min_questions_to_complete',
      'last_updated',
    ]
    const params = {...query, filters: {...filters, fields}}
    return this.search('/evaluation', params)
  }

  bulkTasksUpload = async ({
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
    return this.Post('/evaluationbuilderhandler', params)
  }

  checkEvaluationUrl = async (e: Evaluation): Promise<EvaluationCheck> => {
    return this.bulkTasksUpload({...e, dry_run: true})
  }

  fetchEvaluationTasksHeaders = async (url: string): Promise<EvaluationCheck> => {
    return this.Get('/evaluationbuilderhandler', {csv_url: url, only_header: true})
  }
}
