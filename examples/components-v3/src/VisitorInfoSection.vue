<script setup lang="ts">
import FetchDataBtn from './FetchDataBtn.vue';
import type { VisitorData as Data } from '@fingerprintjs/fingerprintjs-pro-vue-v3';
import VisitorData from './VisitorData.vue';

const props = defineProps<{
  buttonText: string;
  isLoading: boolean;
  error?: Error | null;
  data?: Data<true> | null;
}>();

const emit = defineEmits<{
  (e: 'btn-click', data: MouseEvent): void;
}>();
</script>

<template>
  <section>
    <fetch-data-btn :is-loading="props.isLoading" :text="props.buttonText" @click="emit('btn-click', $event)" />
    <visitor-data v-if="props.data" :visitor-data="props.data" />
    <p v-if="props.error" class="error">
      {{ props.error.message }}
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
