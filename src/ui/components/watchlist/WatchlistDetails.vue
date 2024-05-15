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
          @updated-tab="handleUpdate"
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
import { ActionTypes } from "@/ui/store/targets/actions";
import { ActionTypes as SingleTargetActions } from "@/ui/store/singleTarget/actions";
import { createNamespacedHelpers } from "vuex";

const targetsHelper = createNamespacedHelpers("targets");
const singleTargetHelper = createNamespacedHelpers("singleTarget");
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
  methods: {
    ...targetsHelper.mapActions([ActionTypes.setDefaultTargets]),
    ...singleTargetHelper.mapActions([SingleTargetActions.setDefault]),
    handleUpdate(val) {
      this.tab = val;
    },
  },
  watch: {
    tab(newValue){
      if (newValue == 0) {
        this.setDefaultTargets();
        this.setDefault();
      }
    }
  }
});
</script>

<style></style>
