<template>
  <v-card>
    <v-tabs v-model="tab" align-with-title>
      <v-tab v-for="item in items" :key="item.title">{{ item.title }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item.title">
        <component
          v-if="items[tab].title === item.title"
          v-bind:is="item.content"
        ></component>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import Vue from "vue";
import Filters from "./Filters.vue";
import Settings from "./Settings.vue";
import Overview from "./Overview.vue";
export default Vue.extend({
  components: { Filters, Settings, Overview },
  data: () => ({
    tab: 0,
    items: [
      {
        title: "Filters",
        content: "Filters",
      },
      {
        title: "Overview",
        content: "Overview",
      },
      {
        title: "Settings",
        content: "Settings",
      },
    ],
  }),
});
</script>

<style></style>
