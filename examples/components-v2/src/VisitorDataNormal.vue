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
    :is-loading="visitorData ? visitorData.isLoading : false"
    :error="visitorData ? visitorData.error : null"
    :data="visitorData ? visitorData.data : null"
    @get-data="$getVisitorData"
  />
</template>
