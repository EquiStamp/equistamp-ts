import {Search} from './server'
import type {FilterConfig} from './types'

export const getScores = async (query: FilterConfig) => Search('/scores', query)
