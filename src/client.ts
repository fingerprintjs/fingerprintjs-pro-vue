import { start } from '@fingerprint/agent'
import type { Agent, GetOptions, GetResult, StartOptions } from '@fingerprint/agent'
import type { GetVisitorData } from './types'

export function makeGetVisitorData(startOptions: StartOptions): GetVisitorData {
  // Eagerly start the agent in browser environments
  const agent: Agent | undefined = typeof window !== 'undefined' ? start(startOptions) : undefined

  return async (options?: GetOptions): Promise<GetResult> => {
    if (!agent) {
      throw new Error(
        'getVisitorData() can only be called in the browser. If you are using nuxt, you should apply our plugin only on client side.'
      )
    }

    return agent.get(options)
  }
}
