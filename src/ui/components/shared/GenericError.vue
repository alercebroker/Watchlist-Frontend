<template>
  <v-alert outlined color="red"
    >We found an error: {{ error }}. Please contact the ALeRCE Team</v-alert
  >
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    error: String,
  },
});
</script>

<style></style>
