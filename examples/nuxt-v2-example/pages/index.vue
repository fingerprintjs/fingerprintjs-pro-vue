<template>
  <div>
    <client-only>
      <visitor-data-root />
    </client-only>
  </div>
</template>

<script lang="ts">
import VisitorDataRoot from 'components-v2/src/VisitorDataRoot.vue';
import Vue from 'vue';

export default Vue.extend({
  name: 'IndexPage',
  components: { VisitorDataRoot },
});
</script>
