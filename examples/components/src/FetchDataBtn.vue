<template>
  <button :disabled="props.isLoading">
    <span v-if="!props.isLoading">{{ props.text }}</span>
    <span v-if="props.isLoading"> Loading... </span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string;
  isLoading: boolean;
}>();
</script>

<style scoped></style>
