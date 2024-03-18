<script lang="ts">
import { defineComponent } from 'vue'
import { fpjsGetVisitorDataExtendedMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v3'
import VisitorInfoSection from './VisitorInfoSection.vue'

export default defineComponent({
  components: { VisitorInfoSection },
  mixins: [fpjsGetVisitorDataExtendedMixin],
  watch: {
    'visitorDataExtended.data': {
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
      return this.$getVisitorDataExtended?.()
    },
  },
})
</script>

<template>
  <visitor-info-section
    button-text="Get visitor data using Options API"
    :is-loading="visitorDataExtended.isLoading"
    :error="visitorDataExtended.error"
    :data="visitorDataExtended.data"
    @btn-click="getData"
  />
</template>
