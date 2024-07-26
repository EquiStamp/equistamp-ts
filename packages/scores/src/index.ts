import {Endpoint} from '@equistamp/server'
import type {Score} from '@equistamp/types'

export default class Scores extends Endpoint<Score>('/scores') {}
