<script setup lang="ts">
import CacheOptions from './CacheOptions.vue'
import VisitorInfoCompositionApi from './VisitorInfoCompositionApi.vue'
import VisitorInfoOptionsApi from './VisitorInfoOptionsApi.vue'
</script>

<template>
  <div class="visitor-data-root">
    <CacheOptions />
    <div class="visitor-data-root__columns">
      <VisitorInfoOptionsApi />
      <VisitorInfoCompositionApi />
    </div>
  </div>
</template>

<style>
.visitor-data-root {
  padding: 1em;
}

.visitor-data-root__columns {
  display: flex;
}

.visitor-data-root__columns section {
  width: 50%;
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
