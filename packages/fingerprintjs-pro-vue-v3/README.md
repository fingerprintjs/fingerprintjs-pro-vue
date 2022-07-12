<p align="center">
  <a href="https://fingerprint.com">
    <picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/fingerprintjs/fingerprintjs-pro-vue/main/resources/logo_light.svg" />
     <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/fingerprintjs/fingerprintjs-pro-vue/main/resources/logo_dark.svg" />
     <img src="https://raw.githubusercontent.com/fingerprintjs/fingerprintjs-pro-vue/main/resources/logo_dark.svg" alt="Fingerprint logo" width="312px" />
   </picture>
  </a>
</p>
<p align="center">
    <a href="https://github.com/fingerprintjs/fingerprintjs-pro-vue/actions/workflows/test.yml">
    <img src="https://github.com/fingerprintjs/fingerprintjs-pro-vue/actions/workflows/test.yml/badge.svg" alt="Build status">
  </a>
   <a href="https://github.com/fingerprintjs/fingerprintjs-pro-vue/actions/workflows/release.yml">
    <img src="https://github.com/fingerprintjs/fingerprintjs-pro-vue/actions/workflows/release.yml/badge.svg" alt="Release status">
   </a>
   <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-vue-v3">
     <img src="https://img.shields.io/npm/v/@fingerprintjs/fingerprintjs-pro-vue-v3.svg" alt="Current NPM version">
   </a>
   <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-vue-v3">
     <img src="https://img.shields.io/npm/dm/@fingerprintjs/fingerprintjs-pro-vue-v3.svg" alt="Monthly downloads from NPM">
   </a>
   <a href="https://opensource.org/licenses/MIT">
     <img src="https://img.shields.io/:license-mit-blue.svg" alt="MIT license">
   </a>
   <a href="https://discord.gg/39EpE2neBg">
     <img src="https://img.shields.io/discord/852099967190433792?style=logo&label=Discord&logo=Discord&logoColor=white" alt="Discord server">
   </a>
</p>

# FingerprintJS Pro Vue 3

FingerprintJS Pro Vue is an easy-to-use Vue 3 plugin for [FingerprintJS Pro](https://fingerprint.com/).

## Installation

To install the plugin run:

```shell
yarn add @fingerprintjs/fingerprintjs-pro-vue-v3
```

Or:

```shell
npm install @fingerprintjs/fingerprintjs-pro-vue-v3
```

## Getting started

To identify visitors, you'll need a FingerprintJS Pro account (you
can [sign up for free](https://dashboard.fingerprint.com/signup/)).
You can learn more about API keys in
the [official FingerprintJS Pro documentation](https://dev.fingerprint.com/docs/quick-start-guide).

Register our plugin in your Vue application:

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import { FpjsVueOptions, fpjsPlugin } from '@fingerprintjs/fingerprintjs-pro-vue-v3';

const app = createApp(App);

const apiKey = '<public-api-key>'

app
  .use(fpjsPlugin, {
    loadOptions: {
      // Provide your API key here
      apiKey,
    },
  } as FpjsVueOptions)
  .mount('#app');

```
Refer to the example usages below.

## Composition API

This plugin exposes the `useVisitorData` function that you can use like this:

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

Our plugin injects `$fpjs` object into your components, and you can use it like this:
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

This plugin works with Nuxt out of the box, however, you need to register it on the client side only.

```typescript
// plugins/fingerprintjs.client.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { fpjsPlugin, FpjsVueOptions } from '@fingerprintjs/fingerprintjs-pro-vue-v3';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  nuxtApp.vueApp.use(fpjsPlugin, {
    loadOptions: {
      apiKey: config.public.API_KEY,
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
      // Inject FingerprintJS Pro API key
      API_KEY: process.env.API_KEY,
    },
  }
});
```

You can also check [example Nuxt Application](../../examples/nuxt-v3-example).

## Documentation

You can find detailed documentation and API reference [here](https://fingerprintjs.github.io/fingerprintjs-pro-vue/vue-3/).

## Caching strategy

:warning: **WARNING** If you use data from the `extendedResult`, please pay additional attention to caching strategy.

FingerprintJS Pro uses API calls as the basis for billing.
Our [best practices](https://dev.fingerprint.com/docs/caching-visitor-information) strongly recommend using cache to
optimize API calls rate. The Library uses the SessionStorage cache strategy by default.

Some fields from the [extendedResult](https://dev.fingerprint.com/docs/js-agent#extendedresult) (e.g `ip`
or `lastSeenAt`) might change for the same visitor. If you need exact current data, it is recommended to
pass `ignoreCache=true` inside the `getVisitorData` function

## Support and feedback

For support or to provide feedback,
please [raise an issue on our issue tracker](https://github.com/fingerprintjs/fingerprintjs-pro-vue/issues). If you
require private support, please email us at oss-support@fingerprint.com. If you'd like to have a similar Vue library
for the [open-source FingerprintJS](https://github.com/fingerprintjs/fingerprintjs),
consider [raising an issue in our issue tracker](https://github.com/fingerprintjs/fingerprintjs-pro-vue/issues).

## Examples

You can find the following examples in the [examples](../../examples) directory:

- [SPA Application](../../examples/spa-v3-example)
- [Nuxt Application](../../examples/nuxt-v3-example)
