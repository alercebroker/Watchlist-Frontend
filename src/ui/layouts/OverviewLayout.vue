<template>
  <v-row>
    <v-col lg="5" class="d-none d-lg-block">
      <slot name="targets"></slot>
    </v-col>
    <v-col lg="4" class="d-none d-lg-block">
      <slot name="matches"></slot>
    </v-col>
    <v-col lg="3" class="d-none d-lg-block">
      <slot name="alertInfo"></slot>
    </v-col>
    <v-col cols="12" class="d-block d-lg-none">
      <v-tabs v-model="tab">
        <v-tab>Targets</v-tab>
        <v-tab>Matches</v-tab>
        <v-tab>Alert Info</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <slot name="targets"></slot>
        </v-tab-item>
        <v-tab-item>
          <slot name="matches"></slot>
        </v-tab-item>
        <v-tab-item>
          <slot name="alertInfo"></slot>
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-row>
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
