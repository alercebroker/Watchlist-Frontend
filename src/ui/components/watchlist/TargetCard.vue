<template>
  <v-card id="targetsCard">
    <v-card-title>Target</v-card-title>
    <v-card-text class="white--text">
      <v-container>
        <v-row>
          <v-col>
            <div class="text-body-1">Name:</div>
          </v-col>
          <v-col>
            <div class="text-body-1">{{ target.name }}</div>
          </v-col>
        </v-row>
        <v-divider class="mb-2"></v-divider>
        <v-row>
          <v-col>
            <div class="text-body-1">Ra:</div>
          </v-col>
          <v-col>
            <div class="text-body-1">
              {{ target.ra }}
            </div>
          </v-col>
        </v-row>
        <v-divider  class="mb-2"></v-divider>
        <v-row>
          <v-col> <div class="text-body-1">Dec:</div></v-col>
          <v-col>
            <div class="text-body-1">{{ target.dec }}</div>
          </v-col>
        </v-row>
        <v-divider  class="mb-2"></v-divider>
        <v-row>
          <v-col><div class="text-body-1">nMatches:</div></v-col>
          <v-col
            ><div class="text-body-1">{{ target.nMatches }}</div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { ITargetData } from "@/app/target/domain/Target.types";

import Vue from "vue";
export default Vue.extend({
  props: {
    target: Object,
    loading: Boolean,
  },
  data: (): {
    selectedTarget: ITargetData | null;
  } => ({
    selectedTarget: null,
  }),
});
</script>

<style></style>
