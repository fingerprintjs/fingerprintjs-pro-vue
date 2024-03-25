<script setup lang="ts">
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-vue-v3'
import VisitorInfoSection from './VisitorInfoSection.vue'
import { watch } from 'vue'

const { data, error, isLoading, getData } = useVisitorData({ extendedResult: true }, { immediate: false })

watch(data, (currentData) => {
  if (currentData) {
    console.log('Fetched data using Composition API', currentData)
  }
})
</script>

<template>
  <visitor-info-section
    button-text="Get visitor data using Composition API"
    :data="data"
    :error="error"
    :is-loading="isLoading"
    @btn-click="getData()"
  />
</template>
