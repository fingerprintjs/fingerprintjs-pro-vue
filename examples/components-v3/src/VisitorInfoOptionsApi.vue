<script lang="ts">
import { defineComponent } from 'vue'
import { fingerprintGetVisitorDataMixin } from '@fingerprint/vue'
import VisitorInfoSection from './VisitorInfoSection.vue'

export default defineComponent({
  components: { VisitorInfoSection },
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
  <VisitorInfoSection
    button-text="Get visitor data using Options API"
    :is-loading="visitorData.isLoading"
    :error="visitorData.error"
    :data="visitorData.data"
    @btn-click="getData"
  />
</template>
