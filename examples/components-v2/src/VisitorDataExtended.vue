<script lang="ts">
import Vue from 'vue';
import { fpjsGetVisitorDataExtendedMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v2';
import VisitorData from './VisitorDataSection.vue';

export default Vue.extend({
  components: { VisitorData },
  mixins: [fpjsGetVisitorDataExtendedMixin],
});
</script>

<template>
  <visitor-data
    label="Get extended user data"
    :is-loading="visitorDataExtended ? visitorDataExtended.isLoading : false"
    :error="visitorDataExtended ? visitorDataExtended.error : null"
    :data="visitorDataExtended ? visitorDataExtended.data : null"
    @get-data="$getVisitorDataExtended"
  />
</template>
