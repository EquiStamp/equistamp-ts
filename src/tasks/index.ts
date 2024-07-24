import type {FilterConfig, Eval, Task, ID, SchemaHistory} from 'equistamp/types'
import {Post, Put, Search} from 'equistamp/server'

export const getHumanTasks = async (evalId: string, restart?: boolean): Promise<Eval> =>
  Post('/evaluationsession', {evaluation_id: evalId, restart})
export const checkAnswer = async (params: any) => Post('/response', params)

export const getTasks = async (evaluation_id: ID, query: FilterConfig) =>
  Search('/task', {
    ...query,
    filters: {...(query.filters || {}), evaluation_id},
  })

export const updateTask = async (task: Task) => Put('/task', task)
export const createTask = async (task: Task) => Post('/task', task)

export const getSchemas = async (evaluation_id: ID, query: FilterConfig) =>
  Search('/schema', {
    ...query,
    filters: {...(query.filters || {}), evaluation_id},
  })

export const updateSchema = async (schema: SchemaHistory) => Put('/schema', schema)
export const createSchema = async (schema: SchemaHistory) => Post('/schema', schema)
