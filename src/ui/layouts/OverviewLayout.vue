<template>
  <v-container>
    <v-row justify="start" class="mx-3">
      <v-col lg="2" md="3" sm="3">
        <slot name="selecter"></slot>
      </v-col>
    </v-row>
    <v-row justify="start">
      <v-col lg="7" md="11" sm="11">
        <slot name="lightcurve"></slot>
      </v-col>
      <v-col lg="4" md="11" sm="11" class="pa-0">
        <v-row>
          <v-col lg="12" md="12" sm="12">
            <slot name="target"></slot>
          </v-col>
          <v-row>
            <v-col lg="12" md="12" sm="12">
              <slot name="matches"></slot>
            </v-col>
            <v-col md="12" sm="12" class="pb-8 d-flex flex-row-reverse">
              <slot name="alertInfo"></slot>
            </v-col>
          </v-row>
        </v-row>
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
