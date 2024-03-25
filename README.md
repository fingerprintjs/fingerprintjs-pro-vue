<p align="center">
  <a href="https://fingerprint.com">
    <picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://fingerprintjs.github.io/home/resources/logo_light.svg" />
     <source media="(prefers-color-scheme: light)" srcset="https://fingerprintjs.github.io/home/resources/logo_dark.svg" />
     <img src="https://raw.githubusercontent.com/fingerprintjs/fingerprint-pro-server-api-go-sdk/main/res/logo_dark.svg" alt="Fingerprint logo" width="312px" />
   </picture>
  </a>
</p>
<p align="center">
   <a href="https://github.com/fingerprintjs/fingerprintjs-pro-vue/actions/workflows/ci.yml"><img src="https://github.com/fingerprintjs/fingerprintjs-pro-vue/actions/workflows/ci.yml/badge.svg" alt="Build status"></a>
   <a href="https://github.com/fingerprintjs/fingerprintjs-pro-vue/actions/workflows/release.yml"><img src="https://github.com/fingerprintjs/fingerprintjs-pro-vue/actions/workflows/release.yml/badge.svg" alt="Release status"></a>
   <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-vue-v3"><img src="https://img.shields.io/npm/v/@fingerprintjs/fingerprintjs-pro-vue-v3.svg" alt="Current NPM version"></a>
   <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-vue-v3"><img src="https://img.shields.io/npm/dm/@fingerprintjs/fingerprintjs-pro-vue-v3.svg" alt="Monthly downloads from NPM"></a>
   <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/:license-mit-blue.svg" alt="MIT license"></a>
   <a href="https://discord.gg/39EpE2neBg"><img src="https://img.shields.io/discord/852099967190433792?style=logo&label=Discord&logo=Discord&logoColor=white" alt="Discord server"></a>
</p>

# Fingerprint Pro Vue 3 SDK

[Fingerprint](https://fingerprint.com/) is a device intelligence platform offering 99.5% accurate visitor identification.

Fingerprint Pro Vue SDK is an easy way to integrate [Fingerprint Pro](https://fingerprint.com/) into your Vue 3 application. It supports all capabilities of the Fingerprint JavaScript agent and provides a built-in caching mechanism.

## Requirements

- For Typescript users: Typescript 4.5 or higher
- Vue 3.1 or higher
- For Nuxt users: Nuxt 3.0 or higher

This package works with Fingerprint Pro, it is not compatible with source-available FingerprintJS. See our documentation to learn more about the [difference between Fingerprint Pro and the source-available FingerprintJS](https://dev.fingerprint.com/docs/pro-vs-open-source).

> ⚠️ We no longer provide SDK for Vue2, [due to the end of support](https://v2.vuejs.org/eol/). We recommend upgrading to Vue 3.


## Installation

To install the plugin run:

```shell
yarn add @fingerprintjs/fingerprintjs-pro-vue-v3
```

Or:

```shell
npm install @fingerprintjs/fingerprintjs-pro-vue-v3
```

```shell
pnpm add @fingerprintjs/fingerprintjs-pro-vue-v3
```

## Getting started

To identify visitors, you'll need a Fingerprint Pro account (you
can [sign up for free](https://dashboard.fingerprint.com/signup/)).
Get your API key and get started with the [Fingerprint Pro documentation](https://dev.fingerprint.com/docs/quick-start-guide).

Register our plugin in your Vue application. 

* Set a [region](https://dev.fingerprint.com/docs/regions) if you have chosen a non-global region during registration. 
* Set `endpoint` and `scriptUrlPattern` if you are using one of our proxy integrations to [increase the accuracy and effectiveness](https://dev.fingerprint.com/docs/protecting-the-javascript-agent-from-adblockers) of visitor identification.

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import {
  fpjsPlugin,
  FpjsVueOptions,
  // defaultEndpoint,
  // defaultScriptUrlPattern,
} from '@fingerprintjs/fingerprintjs-pro-vue-v3';

const app = createApp(App);

const apiKey = '<public-api-key>'

app
  .use(fpjsPlugin, {
    loadOptions: {
      apiKey: '<your-public-api-key>',
      // region: 'eu',
      // endpoint: ['metrics.yourwebsite.com', defaultEndpoint],
      // scriptUrlPattern: ['metrics.yourwebsite.com/agent-path', defaultScriptUrlPattern],
    },
  } as FpjsVueOptions)
  .mount('#app');

```
You can use the plugin with Composition API, Options API, or Mixins, with or without Nuxt. See the usage examples below.

## Composition API

The plugin provides a `useVisitorData` function you can use to identify visitors:

```vue
<script setup>
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-vue-v3';
import { watch } from 'vue';

const { data, error, isLoading, getData } = useVisitorData(
  { extendedResult: true }, 
  // Set to true to fetch data on mount
  { immediate: false }
);

watch(data, (currentData) => {
  if (currentData) {
    // Do something with the data
  }
});
</script>

<template>
  <button @click='getData'>Get visitor data</button>
</template>

```

## Options API

The plugin injects a `$fpjs` object into your components that you can use to identify visitors:

```vue

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  methods: {
    async getVisitorData() {
      const visitorData = await this.$fpjs.getVisitorData({
        extendedResult: true
      });

      // Do something with visitorData
    }
  }
});
</script>

<template>
  <button @click='getVisitorData'>Get visitor data</button>
</template> 
```

### Mixins

For your convenience, we also provide mixins that handle all query states.

For the extended result:

```vue

<script lang='ts'>
import { defineComponent } from 'vue';
import { fpjsGetVisitorDataExtendedMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v3';

export default defineComponent({
  // Include our mixin
  mixins: [fpjsGetVisitorDataExtendedMixin],
  async mounted() {
    // You can also fetch data on mount
    // await this.$getVisitorDataExtended();
  }
});
</script>

<template>
  <div>
    <button @click='$getVisitorDataExtended'>
      Get visitor data
    </button>
    <span v-if='visitorDataExtended.isLoading'>
      Loading...
    </span>
    <span v-else-if='visitorDataExtended.isError'>
      Error: {{ visitorDataExtended.error }}
    </span>
    <span v-else>
      <!--Do something with visitorData here-->
    </span>
  </div>
</template>
```

For the default result:

```vue

<script lang='ts'>
import { defineComponent } from 'vue';
import { fpjsGetVisitorDataMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v3';

export default defineComponent({
  // Include our mixin
  mixins: [fpjsGetVisitorDataMixin],
  async mounted() {
    // You can also fetch data on mount
    // await this.$getVisitorData();
  }
});
</script>

<template>
  <div>
    <button @click='$getVisitorData'>
      Get visitor data
    </button>
    <span v-if='visitorData.isLoading'>
      Loading...
    </span>
    <span v-else-if='visitorData.isError'>
      Error: {{ visitorData.error }}
    </span>
    <span v-else>
      <!--Do something with visitorData here-->
    </span>
  </div>
</template>
```

## Nuxt

The plugin works with Nuxt out of the box, however, you need to register it on the client side only.

```typescript
// plugins/fingerprintjs.client.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import {
  fpjsPlugin,
  FpjsVueOptions,
  // defaultEndpoint,
  // defaultScriptUrlPattern,
} from '@fingerprintjs/fingerprintjs-pro-vue-v3';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  nuxtApp.vueApp.use(fpjsPlugin, {
    loadOptions: {
      apiKey: config.public.API_KEY,
      // region: 'eu',
      // endpoint: ['metrics.yourwebsite.com', defaultEndpoint],
      // scriptUrlPattern: ['metrics.yourwebsite.com/agent-path', defaultScriptUrlPattern],
    },
  } as FpjsVueOptions);
});
```

```typescript
//nuxt.config.ts

import { defineNuxtConfig } from 'nuxt';
import path from 'path';

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      // Inject Fingerprint Pro API key
      API_KEY: process.env.API_KEY,
    },
  }
});
```

See the [example Nuxt Application](examples/nuxt-v3-example) for more details.

## Linking and tagging information
The `visitorId` provided by Fingerprint Identification is especially useful when combined with information you already know about your users, for example, account IDs, order IDs, etc. To learn more about various applications of the `linkedId` and `tag`, see [Linking and tagging information](https://dev.fingerprint.com/docs/tagging-information).

Associate your data with a visitor ID using the `linkedId` or `tag` parameter of the options object passed into the `useVisitorData()` hook or the `getData` function:
```vue
<script setup>
 import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-vue-v3';

 const { data, error, isLoading, getData } = useVisitorData({
  linkedId: 'user_1234',
  tag: {
   userAction: 'login',
   analyticsId: 'UA-5555-1111-1',
  },
 })
</script>

<template>
<!--...-->
</template>
```

## Documentation

You can find detailed documentation in the [API reference](https://fingerprintjs.github.io/fingerprintjs-pro-vue).

## Caching strategy

Fingerprint Pro usage is billed per API call. To avoid unnecessary API calls, it is a good practice to [cache identification results](https://dev.fingerprint.com/docs/caching-visitor-information). By default, the SDK uses `sessionStorage` to cache results. 

* Specify `cacheLocation` in `FpjsVueOptions` to instead store results in `memory` or  `localStorage`. Use `none` to disable caching completely.
* Specify `cache` in `FpjsVueOptions` to use your custom cache implementation instead. For more details, see [Creating a custom cache](https://github.com/fingerprintjs/fingerprintjs-pro-spa#creating-a-custom-cache)
 in the Fingerprint Pro SPA repository (a lower-level Fingerprint library used by this SDK).
* Pass `{ignoreCache: true}` to the `getData()`/`getVisitorData()`/`getVisitorDataExtended()` function to ignore cached results for that specific API call. 

> [!NOTE]
> If you use data from [`extendedResult`](https://dev.fingerprint.com/docs/js-agent#extendedresult), pay additional attention to your caching strategy.
> Some fields, for example, `ip` or `lastSeenAt`, might change over time for the same visitor. Use `getData({ ignoreCache: true })` to fetch the latest identification results.

## Support and feedback

To ask questions or provide feedback, use [Issues](https://github.com/fingerprintjs/fingerprintjs-pro-vue/issues). If you need private support, please email us at `oss-support@fingerprint.com`. If you'd like to have a similar Vue wrapper for the [open-source FingerprintJS](https://github.com/fingerprintjs/fingerprintjs), consider creating an issue in the main [FingerprintJS repository](https://github.com/fingerprintjs/fingerprintjs/issues).

## Examples

You can find the following examples in the [examples](examples) directory:

- [SPA Application](examples/spa-v3-example)
- [Nuxt Application](examples/nuxt-v3-example)

## License

This project is licensed under the [MIT license](https://github.com/fingerprintjs/fingerprintjs-pro-vue/blob/main/LICENSE).
