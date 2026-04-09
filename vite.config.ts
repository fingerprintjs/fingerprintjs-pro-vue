import { defineConfig } from 'vite'
import licensePlugin from 'vite-plugin-banner'
import dts from 'vite-plugin-dts'
import { dependencies, peerDependencies, version } from './package.json'

const licenseContents = `FingerprintJS Pro Vue v${version} - Copyright (c) FingerprintJS, Inc, ${new Date().getFullYear()} (https://fingerprintjs.com)
Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.`

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      fileName: 'plugin',
      formats: ['cjs', 'es'],
      name: 'FingerprintJSProVue',
    },
    rollupOptions: {
      external: [...Object.keys(dependencies ?? {}), ...Object.keys(peerDependencies ?? {})],
      output: {
        exports: 'named',
      },
    },
  },
  plugins: [
    licensePlugin({
      content: licenseContents,
    }),
    dts({
      rollupTypes: true,
    }),
  ],
})
