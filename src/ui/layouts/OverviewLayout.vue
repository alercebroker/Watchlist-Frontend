<template>
  <v-container>
    <v-row>
      <v-col lg="4" class="d-none d-lg-block v-col-auto">
        <slot name="target"></slot>
      </v-col>
      <v-col lg="8" class="d-none d-lg-block v-col-auto">
        <slot name="matches"></slot>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col lg="2" class="d-none d-lg-block mb-2 mr-1">
        <slot name="alertInfo"></slot>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-block d-lg-none">
        <v-tabs v-model="tab">
          <v-tab>Targets</v-tab>
          <v-tab>Matches</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <slot name="target"></slot>
          </v-tab-item>
          <v-tab-item>
            <slot name="matches"></slot>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data: (): {
    tab: number;
  } => ({
    tab: 0,
  }),
});
</script>
