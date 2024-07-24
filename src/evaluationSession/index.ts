import type {FilterConfig, ID, Eval} from 'equistamp/types'
import {Get, Search, Post, Delete} from 'equistamp/server'

export const getEvaluationSession = async (id: ID): Promise<Eval> => Get('/evaluationsession', {id})

export const getResponses = async (params: FilterConfig) =>
  params?.filters?.evaluation_session_id ? Search('/response', params) : {items: [], count: 0}

export const buyReport = async (eval_session_id: ID) =>
  Post('/paymentshandler', {
    type: 'report',
    evaluation_session_id: eval_session_id,
  })

export const cancelEvaluationSession = async (id: ID) => Delete('/evaluationsession', {id})
