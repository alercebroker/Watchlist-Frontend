<template>
  <v-container>
    <v-card class="mx-auto">
      <v-tabs v-model="tab" align-with-title>
        <v-tab v-for="item in items" :key="item">
          {{ item.title }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-for="item in items" :key="item.title">
        <component
          v-if="items[tab].title === item.title"
          v-bind:is="item.content"
        ></component>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import UploadCsv from "./UploadCsv.vue";
import SetFilters from "./SetFilters.vue";
export default Vue.extend({
  components: {
    UploadCsv,
    SetFilters,
  },
  data: () => ({
    tab: 0,
    items: [
      {
        title: "Upload Csv",
        content: "UploadCsv",
      },
      {
        title: "Set Filters",
        content: "SetFilters",
      },
    ],
  }),
});
</script>

<style>
.csv {
  font-family: monospace;
}
</style>
