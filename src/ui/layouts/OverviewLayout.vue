<template>
  <v-container>
    <v-row justify="start" class="mx-3">
      <v-col lg="2" class="d-none d-lg-block">
        <slot name="selecter"></slot>
      </v-col>
    </v-row>
    <v-row justify="start">
      <v-col lg="7" class="d-none d-lg-block">
        <slot name="lightcurve"></slot>
      </v-col>
      <v-col lg="4" class="d-none d-lg-block pa-0">
        <v-col class="pa-0">
          <slot name="target"></slot>
        </v-col>
        <v-col class="pa-2">
          <slot name="matches"></slot>
        </v-col>
        <v-col class="pa-2" align="end">
          <slot name="alertInfo"></slot>
        </v-col>
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
            <v-row>
              <v-col>
                <slot name="selecter"></slot>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <slot name="lightcurve"></slot>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <slot name="matches"></slot>
              </v-col>
            </v-row>
            <v-row>
              <v-col align="end">
                <slot name="alertInfo"></slot>
              </v-col>
            </v-row>
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
