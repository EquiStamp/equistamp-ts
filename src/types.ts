import {
  TOP_MODEL,
  MODEL_RANK_CHANGE,
  MODEL_AVAILABILITY,
  NEW_MODEL,
  NEW_EVALUATION,
  MODEL_CHANGE,
  FREE_RESPONSE_QUESTION,
  MULTIPLE_CHOICE_QUESTION,
  BOOLEAN_QUESTION,
  JSON_QUESTION,
  REDACTED_COLUMN,
  TYPE_COLUMN,
  QUESTION_COLUMN,
  BOOL_CORRECT_COLUMN,
  MCQ_CORRECT_COLUMN,
  MCQ_INCORRECT_COLUMN,
  FRQ_CORRECT_COLUMN,
  FRQ_INCORRECT_COLUMN,
  PARAPHRASE,
  EMAIL,
  TEXT_MESSAGE,
  WEBHOOK,
  PHONE_CALL,
  EVAL_SCORE_THRESHOLD,
  AVERAGE,
  MEDIAN,
  MAX,
  MIN,
  SCORE,
  ELO_SCORE,
  MOST_EXPENSIVE,
  LEAST_EXPENSIVE,
  LATENCY,
  ACCURACY,
} from './constants'

export type APISettings = {
  server?: string
  sessionToken?: string
  apiToken?: string
}
export type Data = {[k: string]: any} | string | undefined | null
export type HTTPMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT' | 'OPTIONS'

export type QuestionType =
  | typeof FREE_RESPONSE_QUESTION
  | typeof MULTIPLE_CHOICE_QUESTION
  | typeof BOOLEAN_QUESTION
  | typeof JSON_QUESTION
  | 'default'

export type ID = string
export type ItemType = 'model' | 'evaluation' | 'user'
export type EvalName = string
export type ModelName = string
export type DSLCode = string
export type CodeOverrides = {
  default?: DSLCode
  [FREE_RESPONSE_QUESTION]?: DSLCode
  [MULTIPLE_CHOICE_QUESTION]?: DSLCode
  [BOOLEAN_QUESTION]?: DSLCode
  [JSON_QUESTION]?: DSLCode
}
export type CodeStage = 'system_prompt' | 'prompt' | 'grader' | 'request' | 'response'

export type Eval = {
  id: ID
  evaluation_id: ID
  evaluatee_id: ID
  evaluation_name: EvalName
  evaluatee_name: ModelName
  datetime_completed?: string
  datetime_started: string
  score: number
  num_answered_correctly: number
  num_questions_answered: number
  num_tasks_to_complete?: number
  median_seconds_per_task?: number
  completed?: boolean
  failed?: boolean
  tasks?: Task[]
  label?: string
  formatted_date?: string
  bin?: number
  report_paid?: number
  price?: number
  estimated_session_cost_usd?: number
}

export type DateMap = {
  [key: string]: Eval
}

export type Threshold = {
  title: string
  mean: number
  min?: number
  max?: number
}
export type EvalRunsHistory = {
  [key: string]: DateMap
}
export type EvaluationsResult = {
  evals: EvalRunsHistory
  thresholds: Threshold[]
}

export type TestTaken = {
  evaluation_id: ID
  name: string
  score: number
}
export type SubscriptionLevel = 'free' | 'pro' | 'enterprise' | 'admin'
export type User = {
  id?: ID
  password?: string
  user_image?: string
  full_name?: string
  user_name: string
  bio?: string
  email_address?: string
  join_date?: string
  subscription_level?: SubscriptionLevel
  display_options?: {[key: string]: boolean}
  human?: boolean
  admin_of?: ID[]
  tests_taken?: TestTaken[]
  credits?: number
}

export type Example = {
  id: string
  question: string
  prompt: string
  response_text: string
  correct_answer: string
  correctness?: number
}

// TODO: Fill in these
export type Modality = string
export type EvaluationType = any
export type Tag = {
  id: ID
  name: string
}
export type Cadence = 'once' | 'daily' | 'weekly' | 'every 2 weeks' | 'monthly' | 'quarterly'

export type ModelStats = {
  num_questions_answered?: number
  num_answered_correctly?: number
  median_accuracy?: number
  avg_accuracy?: number
  min_accuracy?: number
  max_accuracy?: number
  min_latency?: number
  max_latency?: number
  avg_latency?: number
  median_latency?: number
  calculation_date: string
}

export type Model = {
  id: ID
  name: ModelName
  owner?: User
  admin_users?: User[]
  description?: string
  publisher?: string
  architecture?: string
  num_parameters?: number
  modalities?: Modality[]
  score?: number
  average_score?: number
  best_evaluation_session?: Eval
  worst_evaluation_session?: Eval
  best_example?: Example
  worst_example?: Example

  public?: boolean
  public_usable?: boolean
  next_run?: 'now' | Cadence

  request_code?: DSLCode
  response_code?: DSLCode

  cost_per_input_character_usd?: number
  cost_per_output_character_usd?: number
  cost_per_1M_input_tokens_usd?: number
  cost_per_1M_output_tokens_usd?: number
  cost_per_instance_hour_usd?: number
  max_characters_per_minute?: number
  max_request_per_minute?: number
  max_context_window_characters?: number

  price?: number
  token_cost?: number

  statistics?: ModelStats

  // User for managing admins
  add_admins?: string[]
  delete_admins?: string[]
}

export type EvaluationStats = {
  evaluation_id?: ID
  calculation_date?: string
  question_count?: number
  total_seconds?: number
  average_accuracy?: number
  median_accuracy?: number

  min_model_test_seconds?: number
  min_human_test_seconds?: number
  max_model_test_seconds?: number
  max_human_test_seconds?: number
  median_human_test_seconds?: number
  median_model_test_seconds?: number

  min_human_accuracy?: number
  min_model_accuracy?: number
  max_human_accuracy?: number
  max_model_accuracy?: number
  median_human_accuracy?: number
  median_model_accuracy?: number

  median_human_precision?: number
  median_model_precision?: number
  median_human_recall?: number
  median_model_recall?: number

  num_humans_evaluated?: number
  num_models_evaluated?: number
}
export type EvalCheckErrorItem = {
  message: string
  level: 'error' | 'warning'
  type: string
  key?: string
}
export type TaskErrors = {
  task_num: number
  task_type: QuestionType
  errors?: EvalCheckErrorItem[]
}
export type Reference = {
  name?: string
  description?: string
  schema?: string
}
export type References = {
  [k: string]: Reference
}
export type EvaluationCheck = {
  min_questions_to_complete?: number
  num_tasks: number
  errors: TaskErrors[]
  columns: string[]
  invalid_references: {[k: string]: string[]}
}
export type Evaluation = {
  id: ID
  name: EvalName
  description?: string
  owner?: User
  admin_users?: User[]
  task_types?: EvaluationType[]
  modalities?: Modality[]
  min_questions_to_complete?: number
  public?: boolean
  users?: User[]
  samples?: Example[]
  num_tasks?: number
  creationDate?: string
  tags?: Tag[]
  top_model?: Model
  bottom_model?: Model
  humanBaseline?: Model
  stats?: EvaluationStats
  // Tasks importer fields
  csv_url?: string
  default_task_type?: TaskType
  columns_mapping?: ColumnsConfig
  references?: References

  grader?: DSLCode | CodeOverrides
  prompt?: DSLCode | CodeOverrides

  price?: number
  next_run?: 'now' | Cadence

  // User for managing admins
  add_admins?: string[]
  delete_admins?: string[]
}

export type AlertMetric = string
export type TriggerCooldown = 'once' | 'daily' | 'always'
export type TriggerTypes =
  | typeof TOP_MODEL
  | typeof MODEL_RANK_CHANGE
  | typeof MODEL_AVAILABILITY
  | typeof NEW_MODEL
  | typeof NEW_EVALUATION
  | typeof MODEL_CHANGE
  | typeof EVAL_SCORE_THRESHOLD
export type TriggerMetric =
  | typeof MIN
  | typeof MAX
  | typeof AVERAGE
  | typeof MEDIAN
  | typeof SCORE
  | typeof ELO_SCORE
  | typeof MOST_EXPENSIVE
  | typeof LEAST_EXPENSIVE
  | typeof LATENCY
  | typeof ACCURACY

export type SubscriptionType =
  | typeof EMAIL
  | typeof TEXT_MESSAGE
  | typeof WEBHOOK
  | typeof PHONE_CALL
export type Subscription = {
  method: SubscriptionType
  destination?: string
  owner_id?: ID
  alert_id?: ID
}
export type Trigger = {
  id?: ID
  type: TriggerTypes
  models?: FiltersTypes
  evaluations?: FiltersTypes
  threshold?: number
  metric?: TriggerMetric
}
export type Alert = {
  id: ID
  name: string
  description: string
  tags?: Tag[]
  public?: boolean
  trigger_cooldown: TriggerCooldown
  last_trigger_date: string
  creationDate: string

  owner?: User
  triggers?: Trigger[]
  subscriptions?: Subscription[]
  subscribed?: boolean
}

export type ColumnType =
  | typeof TYPE_COLUMN
  | typeof QUESTION_COLUMN
  | typeof BOOL_CORRECT_COLUMN
  | typeof FRQ_CORRECT_COLUMN
  | typeof FRQ_INCORRECT_COLUMN
  | typeof MCQ_CORRECT_COLUMN
  | typeof MCQ_INCORRECT_COLUMN
  | typeof PARAPHRASE
  | typeof REDACTED_COLUMN
export type ColumnConfig = {
  columnType?: ColumnType
  paraphrases?: string[]
  paraphraseOf?: string
}
export type ColumnsConfig = {[k: string]: ColumnConfig}

export type Response = {
  id: ID
  evaluation_session_id: ID
  evaluatee_id: ID
  task_id: ID
  correctness?: number
  response_time_in_seconds: number
  parsed_response_text: string
  raw_task_text: string
  // raw_response_text: string
  correct: boolean
  creation_date: string
}

// Free response question | multiple choice questions
export type TaskType =
  | typeof MULTIPLE_CHOICE_QUESTION
  | typeof FREE_RESPONSE_QUESTION
  | typeof BOOLEAN_QUESTION
  | typeof JSON_QUESTION

export type Question = {
  id: ID
  task_id: ID
  text: string
}
export type Answer = {
  id: ID
  task_id: ID
  text: string
  correct?: boolean
}

type JSONObj = {
  [k: string]: any
}
type Schema = {
  [k: string]: any
}

type BoolQuestion = {
  correct?: boolean
}
type FreeResponseQuestion = {}
type MultipleChoiceQuestion = {
  answers?: Answer[]
}
type JSONQuestion = {
  schema: Schema
  expected: JSONObj
}
export type Task = {
  id: ID
  type: TaskType
  evaluation_id?: ID
  question?: string
  questions?: Question[]
  redacted?: boolean
} & FreeResponseQuestion &
  MultipleChoiceQuestion &
  BoolQuestion &
  JSONQuestion

export type SchemaHistory = {
  id: ID
  key?: string
  name?: string
  description?: string
  evaluation_id: ID
  schema: Schema
  type: typeof JSON_QUESTION
  history: Schema[]
}
export type ModelConnection = {
  id?: ID
  evaluation_id: ID
  evaluatee_id: ID
  name: string
  price: number
  cadence: Cadence
  model?: Model
  evaluation?: Evaluation
}

export type Contact = {
  subject: string
  text?: string
  html?: string
  from?: string
  to: string
}

export type LoginParams = {
  login?: string
  password?: string
  code?: string
  external_auth?: 'google' | 'github'
}

export type Schedule = {
  id?: ID
  job_schedule_arn?: string
  job_name?: string
  job_description?: string
  job_body?: {[k: string]: any}
  start_date?: string
  next_run?: string
  minutes_between_evaluations?: number
  model_id?: ID
  evaluation_id?: ID
  aws_schedule?: AWSSchedule
}
export type AWSSchedule = {
  Arn: string
  CreationDate: string
  GroupName: string
  Name: string
  LastModificationDate: string
  State: string
  Target: any
}
export type ScheduleItem = {
  evaluation: Evaluation
  model: Model
  schedule?: Schedule
}
export type ScheduleResult = {
  items: ScheduleItem[]
  unknown: AWSSchedule[]
}

export type Score = {
  evaluation_session_id: ID
  evaluation_id: ID
  evaluatee_id: ID
  evaluation_name: string
  evaluatee_name: string
  evaluatee_score: number
  score: number
  elo_score: number
  creation_date: string
  cost?: number
}

// Filters
export type ModelsFiltersType = {
  publishers?: string[]
  architecture?: string[]
  minScore?: number
  maxScore?: number
  minNumParameters?: number
  maxNumParameters?: number
  modalities?: Modality[]
  public_useable?: boolean
  evaluation?: ID

  minLatency?: number
  maxLatency?: number
  minInputTokensPrice?: number
  maxInputTokensPrice?: number
  minOutputTokensPrice?: number
  maxOutputTokensPrice?: number
  minInstanceHourPrice?: number
  maxInstanceHourPrice?: number
}

export type EvaluationsFiltersType = {
  types?: EvaluationType[]
  modalities?: Modality[]
  tags?: string[]
  minNumTasks?: number
  maxNumTasks?: number
  startDate?: string
  endDate?: string
  model?: ID
}

export type EvaluationSessionsFiltersType = {
  minScore?: number
  maxScore?: number
  startDatetimeStarted?: string
  endDatetimeStarted?: string
  startDatetimeCompleted?: string
  endDatetimeCompleted?: string
  statuses?: string[]
  evaluation_session_id?: string
  correct?: boolean
  minResponseTime?: number
  maxResponseTime?: number
  latest?: boolean

  completed?: boolean
  failed?: boolean
}

export type AlertsFiltersType = {
  evaluations?: Evaluation[]
  models?: Model[]
  alerts?: Alert[]
  triggerCooldown?: string[]
  triggerType?: TriggerTypes[]
  minThreshold?: number
  maxThreshold?: number
  startCreationDate?: string
  endCreationDate?: string
  startPredictedTriggerDate?: string
  endPredictedTriggerDate?: string
  subscriber?: string[]
  owner_id?: string
  fields?: string[]
  subscribed?: boolean
}

export type TasksFiltersType = {
  evaluation_id?: ID
  taskType?: string[]
  minNumQuestions?: number
  maxNumQuestions?: number
  viewOptions?: string[]
  redacted?: string[]
  export?: 'csv'
}

export type FiltersTypes = {
  search?: string
} & ModelsFiltersType &
  EvaluationsFiltersType &
  EvaluationSessionsFiltersType &
  AlertsFiltersType &
  TasksFiltersType

export type Direction = 'Asc' | 'Desc' | undefined
export type SortOptions = {
  key?: string
  direction?: Direction
  sorter?: (items: any[]) => typeof items
}

export type FilterKey = keyof FiltersTypes
export type FilterConfig = {
  sort?: SortOptions
  sorter?: (items: any[]) => any[]
  filters?: FiltersTypes
  page?: number
  perPage?: number | 'all'
}

export type SearchResult = {
  items: Alert[] | Evaluation[] | Model[] | Task[] | Eval[] | Tag[] | Score[]
  count: number
  page?: number
  per_page?: number
}
