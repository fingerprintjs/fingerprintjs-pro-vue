import { flushPromises, mount } from '@vue/test-utils'
import { createApp, defineComponent, getCurrentInstance } from 'vue'
import { FingerprintPlugin } from '../src'
import type { FingerprintPluginOptions, FingerprintVueGlobalClient } from '../src'

export const apiKey = 'API_KEY'

export const testData = {
  visitor_id: '#visitor_id',
  event_id: 'event123',
  sealed_result: null,
}

export const pluginConfig: FingerprintPluginOptions = {
  apiKey,
}

export const EmptyComponent = { template: '<div />' }

export function mountWithPlugin(component: Parameters<typeof mount>[0], options?: Parameters<typeof mount>[1]) {
  return mount(component, {
    ...options,
    global: {
      ...options?.global,
      plugins: [...(options?.global?.plugins ?? []), [FingerprintPlugin, pluginConfig]],
    },
  })
}

export function createAppWithPlugin(
  rootComponent: Parameters<typeof createApp>[0] = EmptyComponent,
  options: FingerprintPluginOptions = pluginConfig
) {
  const app = createApp(rootComponent)
  app.use(FingerprintPlugin, options)

  return app
}

export function getMountedFingerprintClient(options: FingerprintPluginOptions = pluginConfig) {
  let fingerprint: FingerprintVueGlobalClient | undefined

  const app = createAppWithPlugin(
    defineComponent({
      template: '<div />',
      setup() {
        const instance = getCurrentInstance()

        if (!instance?.proxy?.$fingerprint) {
          throw new Error('Expected $fingerprint on the component instance')
        }

        fingerprint = instance.proxy.$fingerprint

        return {}
      },
    }),
    options
  )

  app.mount(document.createElement('div'))

  if (!fingerprint) {
    throw new Error('Expected mounted component to expose $fingerprint')
  }

  return fingerprint
}

export function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return {
    promise,
    resolve,
    reject,
  }
}

export { flushPromises }
