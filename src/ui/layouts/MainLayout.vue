<template>
  <v-container :fluid="!$vuetify.breakpoint.xl">
    <v-row>
      <v-col lg="3" class="d-none d-lg-block">
        <slot name="left"></slot>
      </v-col>
      <v-col cols="12" class="d-lg-none">
        <slot name="top"></slot>
      </v-col>
      <v-col cols="12" lg="9">
        <slot name="right"></slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>
<style></style>
