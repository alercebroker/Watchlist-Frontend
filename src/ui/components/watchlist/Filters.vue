<template>
  <v-row>
    <v-col xs="12">
      <target-list @updated="handleUpdatedTab" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import TargetList from "./TargetList.vue";
export default Vue.extend({
  components: { TargetList },
  methods: {
    handleUpdatedTab(val: number) {
      this.$emit("updated-tab", val);
    },
  },
});
</script>

<style></style>
