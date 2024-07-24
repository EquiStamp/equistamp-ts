import type {FilterConfig} from 'equistamp/types'
import {Search} from 'equistamp/server'

export const getTags = async (query: FilterConfig) => Search('/tag', query)
