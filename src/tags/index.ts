import type {Tag} from 'equistamp/types'
import {Endpoint} from 'equistamp/server'

export class Tags extends Endpoint<Tag>('/tag') {}
