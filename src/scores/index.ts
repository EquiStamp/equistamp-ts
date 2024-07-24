import {Search} from 'equistamp/server'
import type {FilterConfig} from 'equistamp/types'

export const getScores = async (query: FilterConfig) => Search('/scores', query)
