<script lang="ts">
import { defineComponent } from 'vue'
import { fingerprintGetVisitorDataMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v3'

export default defineComponent({
  mixins: [fingerprintGetVisitorDataMixin],
  watch: {
    'visitorData.data': {
      deep: true,
      handler(data) {
        if (data) {
          console.log('Fetched data using Options API', data)
        }
      },
    },
  },
  methods: {
    getData() {
      return this.$getVisitorData?.()
    },
  },
})
</script>

<template>
  <section>
    <button type="button" @click="getData">Get visitor data using Options API</button>
    <pre v-if="visitorData.data">{{ JSON.stringify(visitorData.data, null, 2) }}</pre>
    <p v-if="visitorData.error" class="error">{{ visitorData.error.message }}</p>
  </section>
</template>
