<script setup lang="ts">
import { watch } from 'vue'
import VisitorInfoSection from './VisitorInfoSection.vue'
import { useVisitorData } from '@fingerprint/vue'

const { data, error, isLoading, getData } = useVisitorData({ immediate: false })

watch(data, (currentData) => {
  if (currentData) {
    console.log('Fetched data using Composition API', currentData)
  }
})
</script>

<template>
  <VisitorInfoSection
    button-text="Get visitor data using Composition API"
    :data="data"
    :error="error"
    :is-loading="isLoading"
    @btn-click="getData()"
  />
</template>
