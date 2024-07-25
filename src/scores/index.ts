import {Endpoint} from 'equistamp/server'
import type {Score} from 'equistamp/types'

export class Scores extends Endpoint<Score>('/scores') {}
