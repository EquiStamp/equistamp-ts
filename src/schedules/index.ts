import {Endpoint} from 'equistamp/server'
import {Schedule, ScheduleResult} from 'equistamp/types'

export class Schedules extends Endpoint<Schedule>('/evaluationmodeljobshandler') {
  all = async () => {
    return this.Get('/evaluationmodeljobshandler') as Promise<ScheduleResult>
  }
}
