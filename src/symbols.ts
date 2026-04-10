import type { InjectionKey } from 'vue'
import type { GetVisitorData } from './types'

export const GET_VISITOR_DATA: InjectionKey<GetVisitorData> = Symbol('fingerprint-getVisitorData')
