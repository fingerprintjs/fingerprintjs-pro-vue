<p align="center">
  <a href="https://fingerprintjs.com">
    <img src="https://raw.githubusercontent.com/fingerprintjs/fingerprintjs-pro-vue/main/resources/logo.svg" alt="FingerprintJS" width="312px" />
  </a>
</p>
<p align="center">
  <a href="https://github.com/fingerprintjs/fingerprintjs-pro-vue/actions/workflows/build.yml">
    <img src="https://github.com/fingerprintjs/fingerprintjs-pro-vue/actions/workflows/build.yml/badge.svg" alt="Build status">
  </a>
   <a href="https://github.com/fingerprintjs/fingerprintjs-pro-vue/actions/workflows/release.yml">
    <img src="https://github.com/fingerprintjs/fingerprintjs-pro-vue/actions/workflows/release.yml/badge.svg" alt="Release status">
   </a>
   <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-vue">
     <img src="https://img.shields.io/npm/v/@fingerprintjs/fingerprintjs-pro-vue.svg" alt="Current NPM version">
   </a>
   <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-vue">
     <img src="https://img.shields.io/npm/dm/@fingerprintjs/fingerprintjs-pro-vue.svg" alt="Monthly downloads from NPM">
   </a>
   <a href="https://opensource.org/licenses/MIT">
     <img src="https://img.shields.io/:license-mit-blue.svg" alt="MIT license">
   </a>
   <a href="https://discord.gg/39EpE2neBg">
     <img src="https://img.shields.io/discord/852099967190433792?style=logo&label=Discord&logo=Discord&logoColor=white" alt="Discord server">
   </a>
</p>

# FingerprintJS Pro Vue 2

FingerprintJS Pro Vue is an easy-to-use Vue 2 plugin for [FingerprintJS Pro](https://fingerprintjs.com/).

## Installation

To install the plugin run:

```shell
yarn add @fingerprintjs/fingerprintjs-pro-vue-2
```

Or:

```shell
npm install @fingerprintjs/fingerprintjs-pro-vue-2
```

## Getting started

To identify visitors, you'll need a FingerprintJS Pro account (you
can [sign up for free](https://dashboard.fingerprintjs.com/signup/)).
You can learn more about API keys in
the [official FingerprintJS Pro documentation](https://dev.fingerprintjs.com/docs/quick-start-guide).

1. Register our plugin in your Vue application:

```typescript
import Vue from 'vue';
import App from './App.vue';
import { FpjsVueOptions, fpjsPlugin } from '@fingerprintjs/fingerprintjs-pro-vue-v2';

const app = new Vue(App);
const apiKey = '<public-api-key>'

Vue.use(fpjsPlugin, {
  loadOptions: {
    // Set your API Key
    apiKey,
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
import { fpjsPlugin, FpjsVueOptions } from '@fingerprintjs/fingerprintjs-pro-vue-v2';
import Vue from 'vue';

Vue.use(fpjsPlugin, {
  loadOptions: {
    apiKey: process.env.API_KEY,
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

You can find detailed documentation and API reference [here](https://fingerprintjs.github.io/fingerprintjs-pro-vue/vue-2/).

## Caching strategy

:warning: **WARNING** If you use data from the `extendedResult`, please pay additional attention to caching strategy.

FingerprintJS Pro uses API calls as the basis for billing.
Our [best practices](https://dev.fingerprintjs.com/docs/caching-visitor-information) strongly recommend using cache to
optimize API calls rate. The Library uses the SessionStorage cache strategy by default.

Some fields from the [extendedResult](https://dev.fingerprintjs.com/docs/js-agent#extendedresult) (e.g `ip`
or `lastSeenAt`) might change for the same visitor. If you need exact current data, it is recommended to
pass `ignoreCache=true` inside the `getVisitorData` function,

## Support and feedback

For support or to provide feedback,
please [raise an issue on our issue tracker](https://github.com/fingerprintjs/fingerprintjs-pro-vue/issues). If you
require private support, please email us at oss-support@fingerprintjs.com. If you'd like to have a similar Vue library
for the [open-source FingerprintJS](https://github.com/fingerprintjs/fingerprintjs),
consider [raising an issue in our issue tracker](https://github.com/fingerprintjs/fingerprintjs-pro-vue/issues).

## Examples

You can find the following examples in the [examples](../../examples) directory:

- [SPA Application](../../examples/spa-v2-example)
- [Nuxt Application](../../examples/nuxt-v2-example)
