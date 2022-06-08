<script lang="ts">
import Vue from 'vue';
import { fpjsGetVisitorDataMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v2';
import VisitorDataSection from './VisitorDataSection.vue';

export default Vue.extend({
  components: { VisitorDataSection },
  mixins: [fpjsGetVisitorDataMixin],
});
</script>

<template>
  <visitor-data-section
    :is-loading="visitorData.isLoading"
    :error="visitorData.error"
    :data="visitorData.data"
    @get-data="$getVisitorData"
  />
</template>
