<script setup lang="ts">
import FetchDataBtn from './FetchDataBtn.vue'
import type { Fingerprint } from '@fingerprintjs/fingerprintjs-pro-vue-v3'
import VisitorData from './VisitorData.vue'

defineProps<{
  buttonText: string
  isLoading: boolean
  error?: Error | null
  data?: Fingerprint.GetResult | null
}>()

const emit = defineEmits<{
  (e: 'btn-click', data: MouseEvent): void
}>()
</script>

<template>
  <section>
    <FetchDataBtn :is-loading="isLoading" :text="buttonText" @click="emit('btn-click', $event)" />
    <VisitorData v-if="data" :visitor-data="data" />
    <p v-if="error" class="error">
      {{ error.message }}
    </p>
  </section>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

.error {
  color: red;
}
</style>
