import {Delete, Get, Post, Put} from './server'
import {Schedule, ScheduleResult} from './types'

export const getSchedules = async () =>
  Get('/evaluationmodeljobshandler') as Promise<ScheduleResult>
export const createSchedule = async (s: Schedule) => Post('/evaluationmodeljobshandler', s)
export const updateSchedule = async (s: Schedule) => Put('/evaluationmodeljobshandler', s)
export const deleteSchedule = async (s: Schedule) => Delete('/evaluationmodeljobshandler', s)
