import {EvaluationsResult, ItemType, FilterConfig, SearchResult} from 'equistamp/types'
import {Search} from 'equistamp/server'

export const getEvaluations = async (query: FilterConfig): Promise<SearchResult> => {
  const filters = query.filters || {}
  const fields = filters.fields || [
    'id',
    'name',
    'description',
    'public',
    'tags',
    'modalities',
    'task_types',
    'num_tasks',
    'min_questions_to_complete',
    'last_updated',
  ]
  const params = {...query, filters: {...filters, fields}}
  return Search('/evaluation', params)
}

export const getEvaluationRuns = async (
  params: FilterConfig,
  group: ItemType,
): Promise<EvaluationsResult> => {
  const filters = {...(params.filters || {}), binned: true}
  const query = {...params, groupBy: group, filters}
  return (await Search('/evaluationsession', query)) as unknown as EvaluationsResult
}

export const getRuns = async (params: FilterConfig): Promise<SearchResult> => {
  if (!params?.filters?.evaluations && !params?.filters?.models) {
    return {count: 0, items: []}
  }
  return fetchRuns(params)
}
export const fetchRuns = async (params: FilterConfig): Promise<SearchResult> =>
  Search('/evaluationsession', params)
