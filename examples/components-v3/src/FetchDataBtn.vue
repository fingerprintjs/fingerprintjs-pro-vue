<script setup lang="ts">
defineProps<{
  text: string
  isLoading: boolean
}>()
</script>

<template>
  <button :disabled="isLoading">
    <span v-if="!isLoading">{{ text }}</span>
    <span v-if="isLoading"> Loading... </span>
  </button>
</template>

<style scoped></style>
