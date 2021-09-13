<template>
  <v-alert outlined color="red">
    <p>You have an error on your target list:</p>
    <p>Line: {{ errorLine + 2 }}:</p>
    <p class="errorDetail" v-for="(error, index) in errorDetails" :key="index">
      {{ error }}
    </p>
  </v-alert>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    errors: Array as () => Array<Record<string, unknown>>,
  },
  computed: {
    errorLine: function (): number {
      return this.errors.findIndex((val) => JSON.stringify(val) != "{}");
    },
    errorDetails: function (): Array<string> {
      const error: Record<string, unknown> = this.errors[this.errorLine];
      let messages: string[] = [];
      Object.keys(error).forEach((key) => {
        messages.push(key + ": " + error[key]);
      });
      return messages;
    },
  },
});
</script>

<style>
.errorDetail {
  padding-left: 2em;
}
</style>
