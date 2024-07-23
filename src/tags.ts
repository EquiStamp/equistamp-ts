import type {FilterConfig} from './types'
import {Search} from './server'

export const getTags = async (query: FilterConfig) => Search('/tag', query)
