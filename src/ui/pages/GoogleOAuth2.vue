<template>
  <v-progress-circular></v-progress-circular>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data: (): {
    code: string;
    state: string;
  } => ({
    code: "",
    state: "",
  }),
  mounted() {
    this.code = this.$route.query.code as string;
    this.state = this.$route.query.state as string;
  },
});
</script>

<style></style>
