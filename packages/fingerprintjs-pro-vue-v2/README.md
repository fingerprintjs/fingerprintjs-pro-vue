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
   <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-vue-v2">
     <img src="https://img.shields.io/npm/v/@fingerprintjs/fingerprintjs-pro-vue-v2.svg" alt="Current NPM version">
   </a>
   <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-vue-v2">
     <img src="https://img.shields.io/npm/dm/@fingerprintjs/fingerprintjs-pro-vue-v2.svg" alt="Monthly downloads from NPM">
   </a>
   <a href="https://opensource.org/licenses/MIT">
     <img src="https://img.shields.io/:license-mit-blue.svg" alt="MIT license">
   </a>
   <a href="https://discord.gg/39EpE2neBg">
     <img src="https://img.shields.io/discord/852099967190433792?style=logo&label=Discord&logo=Discord&logoColor=white" alt="Discord server">
   </a>
</p>

# FingerprintJS Pro Vue 2

[Fingerprint](https://fingerprint.com/) is a device intelligence platform offering 99.5% accurate visitor identification.

FingerprintJS Pro Vue is an easy way to integrate [Fingerprint Pro](https://fingerprint.com/) into your Vue 2 application.

## Requirements

- For Typescript users: Typescript 4.5 or higher
- Vue 2.6 or higher
- For Nuxt users: Nuxt 2.16 or higher

This package works with Fingerprint Pro, it is not compatible with open-source FingerprintJS. See our documentation to learn more about the [difference between Fingerprint Pro and the open-source FingerprintJS](https://dev.fingerprint.com/docs/pro-vs-open-source).

## Installation

To install the plugin run:

```shell
yarn add @fingerprintjs/fingerprintjs-pro-vue-v2
```

Or:

```shell
npm install @fingerprintjs/fingerprintjs-pro-vue-v2
```

## Getting started

To identify visitors, you'll need a FingerprintJS Pro account (you
can [sign up for free](https://dashboard.fingerprint.com/signup/)).
Get your API key and get started with the [FingerprintJS Pro documentation](https://dev.fingerprint.com/docs/quick-start-guide).

1. Register the plugin in your Vue application. Set a [region](https://dev.fingerprint.com/docs/regions) if you have chosen a non-global region during registration. Set `endpoint` and `scriptUrlPattern` if you are using one of our proxy integrations to [increase the accuracy and effectiveness](https://dev.fingerprint.com/docs/protecting-the-javascript-agent-from-adblockers) of visitor identification.

```typescript
import Vue from 'vue';
import App from './App.vue';
import {
  fpjsPlugin,
  FpjsVueOptions,
  // defaultEndpoint,
  // defaultScriptUrlPattern,
} from '@fingerprintjs/fingerprintjs-pro-vue-v2';

const app = new Vue(App);

Vue.use(fpjsPlugin, {
  loadOptions: {
    apiKey: '<your-public-api-key>',
    // region: 'eu',
    // endpoint: ['metrics.yourwebsite.com', defaultEndpoint],
    // scriptUrlPattern: ['metrics.yourwebsite.com/agent-path', defaultScriptUrlPattern],
  },
} as FpjsVueOptions);

app.$mount('#app');
```

2. You can now access `$fpjs` inside your components:

```vue

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
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

## Mixins

For your convenience, we also provide mixins that handle all query states.

For the extended result:

```vue

<script lang='ts'>
import Vue from 'vue';
import { fpjsGetVisitorDataExtendedMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v2';

export default Vue.extend({
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

---
For the default result:

```vue

<script lang='ts'>
import Vue from 'vue';
import { fpjsGetVisitorDataMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v2';

export default Vue.extend({
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
import {
  fpjsPlugin,
  FpjsVueOptions,
  // defaultEndpoint,
  // defaultScriptUrlPattern,
} from '@fingerprintjs/fingerprintjs-pro-vue-v2';
import Vue from 'vue';

Vue.use(fpjsPlugin, {
  loadOptions: {
    apiKey: process.env.API_KEY,
    // region: 'eu',
    // endpoint: ['metrics.yourwebsite.com', defaultEndpoint],
    // scriptUrlPattern: ['metrics.yourwebsite.com/agent-path', defaultScriptUrlPattern],
  },
} as FpjsVueOptions);
```

```javascript
//nuxt.config.js

import path from 'path';

export default {
  // Load our plugin, ".client" suffix ensures that it is only loaded on client side.
  plugins: ['~/plugins/fingerprintjs.client.ts'],
  
  // Other configurations...
};
```

You can also check the [example Nuxt Application](../../examples/nuxt-v2-example).

## Documentation

You can find detailed documentation in the [API reference](https://fingerprintjs.github.io/fingerprintjs-pro-vue/vue-2/).

## Caching strategy

Fingerprint Pro usage is billed per API call. To reduce API calls, it is a good practice to [cache identification results](https://dev.fingerprint.com/docs/caching-visitor-information). The SDK uses SessionStorage to cache results by default.

:warning: **WARNING** If you use data from `extendedResult`, please pay additional attention to caching strategy.

Some fields from the [extendedResult](https://dev.fingerprint.com/docs/js-agent#extendedresult) (e.g `ip` or `lastSeenAt`) might change for the same visitor. If you need to get the current data, it is recommended to pass `ignoreCache=true` inside `getVisitorData` or `getVisitorDataExtended` functions.

## Support and feedback

To ask questions or provide feedback, use [Issues](https://github.com/fingerprintjs/fingerprintjs-pro-vue/issues). If you need private support, please email us at `oss-support@fingerprint.com`. If you'd like to have a similar Vue wrapper for the [open-source FingerprintJS](https://github.com/fingerprintjs/fingerprintjs), consider creating an issue in the main [FingerprintJS repository](https://github.com/fingerprintjs/fingerprintjs/issues).

## Examples

You can find the following examples in the [examples](../../examples) directory:

- [SPA Application](../../examples/spa-v2-example)
- [Nuxt Application](../../examples/nuxt-v2-example)
