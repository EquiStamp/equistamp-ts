import BaseAPI, {ServerError} from '@equistamp/server'
import Auth from '@equistamp/auth'
import Alerts from '@equistamp/alerts'
import EvaluationSessions from '@equistamp/evaluation-sessions'
import Evaluations from '@equistamp/evaluations'
import ModelConnections from '@equistamp/model-connections'
import Models from '@equistamp/models'
import Schedules from '@equistamp/schedules'
import Scores from '@equistamp/scores'
import Tags from '@equistamp/tags'
import Tasks, {Schemas} from '@equistamp/tasks'
import Tester from '@equistamp/tester'
import Users from '@equistamp/users'
import type {APISettings, Contact} from '@equistamp/types'

export {ServerError}

export default class API extends BaseAPI {
  auth: Auth
  alerts: Alerts
  evaluations: Evaluations
  evaluationSessions: EvaluationSessions
  modelConnections: ModelConnections
  models: Models
  schedules: Schedules
  schemas: Schemas
  scores: Scores
  tags: Tags
  tasks: Tasks
  tester: Tester
  users: Users

  constructor(config: APISettings) {
    super(config)
    this.auth = new Auth(config)
    this.alerts = new Alerts(config)
    this.evaluations = new Evaluations(config)
    this.evaluationSessions = new EvaluationSessions(config)
    this.modelConnections = new ModelConnections(config)
    this.models = new Models(config)
    this.schedules = new Schedules(config)
    this.schemas = new Schemas(config)
    this.scores = new Scores(config)
    this.tags = new Tags(config)
    this.tasks = new Tasks(config)
    this.tester = new Tester(config)
    this.users = new Users(config)
  }

  contact = async (params: Contact) => {
    return this.Post('/contact', params)
  }
}

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'
// export const API_BASE_URL = 'https://equistamp.net'

export const getSessionId = () =>
  Object.fromEntries(document.cookie.split('; ').map((v) => v.split('='))).sessionId

export const makeApi = () => {
  return new API({server: API_BASE_URL, sessionToken: getSessionId()})
}
