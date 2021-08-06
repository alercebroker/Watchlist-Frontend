<template>
  <v-card class="mx-auto" width="344" height="180" outlined>
    <v-card-text><div v-html="message"></div></v-card-text>
    <v-card-text v-if="icon">
      <div class="text-center">
        <v-icon x-large>{{ icon }}</v-icon>
      </div>
    </v-card-text>
    <v-card-text v-if="spinner" class="mx-auto">
      <div class="text-center">
        <v-progress-circular
          id="spinner"
          :size="70"
          :width="7"
          indeterminate
        /></div
    ></v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    message: {
      type: String,
      default: "",
    },
    icon: {
      type: String || null,
      default: null,
    },
    spinner: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style></style>
