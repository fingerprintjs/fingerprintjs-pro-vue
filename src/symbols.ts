import type { InjectionKey } from 'vue'
import type { ClearCache, GetVisitorData } from './types'

export const GET_VISITOR_DATA: InjectionKey<GetVisitorData> = Symbol('fpjs-getVisitorData')

export const CLEAR_CACHE: InjectionKey<ClearCache> = Symbol('fpjs-clearCache')
