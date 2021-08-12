<template>
  <v-row>
    <v-col xs="12">
      <target-list />
    </v-col>
  </v-row>
</template>

<script>
import Vue from "vue";
import TargetList from "./TargetList.vue";
export default Vue.extend({
  components: { TargetList },
});
</script>

<style></style>
