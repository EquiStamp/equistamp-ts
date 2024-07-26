import type {Tag} from '@equistamp/types'
import {Endpoint} from '@equistamp/server'

export default class Tags extends Endpoint<Tag>('/tag') {}
