<template>
  <v-alert outlined color="red">
    <p>You have an error on your target list:</p>
    <p>Line: {{ line + 2 }}:</p>
    <p class="errorDetail">
      {{ error }}
    </p>
  </v-alert>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    error: String,
    line: Number,
  },
});
</script>

<style>
.errorDetail {
  padding-left: 2em;
}
</style>
