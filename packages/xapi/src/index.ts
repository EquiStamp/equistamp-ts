import BaseAPI, {ServerError} from '@equistamp/server'
import Auth from '@equistamp/auth'
import Alerts from '@equistamp/alerts'
import EvaluationSessions from '@equistamp/evaluation-sessions'
import Evaluations from '@equistamp/evaluations'
import ModelConnections from '@equistamp/model-connections'
import Models from '@equistamp/models'
import Schedules from '@equistamp/schedules'
import Scores from '@equistamp/scores'
import Subscriptions from '@equistamp/subscriptions'
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
  subscriptions: Subscriptions
  tags: Tags
  tasks: Tasks
  tester: Tester
  users: Users
  _authSetTokens: (sessionToken?: string, apiToken?: string) => void

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
    this.subscriptions = new Subscriptions(config)
    this.tags = new Tags(config)
    this.tasks = new Tasks(config)
    this.tester = new Tester(config)
    this.users = new Users(config)

    this._authSetTokens = this.auth.setTokens
    this.auth.setTokens = this.setTokens
  }

  contact = async (params: Contact) => {
    return this.Post('/contact', params)
  }

  setTokens = (sessionToken?: string, apiToken?: string) => {
    this._authSetTokens(sessionToken, apiToken)
    const endpoints = [
      this.alerts,
      this.evaluations,
      this.evaluationSessions,
      this.modelConnections,
      this.models,
      this.schedules,
      this.schemas,
      this.scores,
      this.subscriptions,
      this.tags,
      this.tasks,
      this.tester,
      this.users,
    ]
    endpoints.forEach((endpoint) => endpoint.setTokens(sessionToken, apiToken))
  }
}

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'
// export const API_BASE_URL = 'https://equistamp.net'

export const makeApi = () => {
  const api = new API({server: API_BASE_URL})
  api.auth.getSessionId()
  return api
}
