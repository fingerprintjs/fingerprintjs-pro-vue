<script lang="ts">
import Vue from 'vue';
import VisitorDataNormal from './VisitorDataNormal.vue';
import VisitorDataExtended from './VisitorDataExtended.vue';

export default Vue.extend({
  components: { VisitorDataNormal, VisitorDataExtended },
});
</script>

<template>
  <div class="visitor-data-root">
    <visitor-data-normal />
    <visitor-data-extended />
  </div>
</template>

<style>
.visitor-data-root {
  display: flex;
}

.visitor-data-root section {
  width: 50%;
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
