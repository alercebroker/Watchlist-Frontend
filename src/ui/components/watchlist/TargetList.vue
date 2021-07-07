<template>
  <v-card height="100%">
    <v-card-title>Targets</v-card-title>
    <v-card-subtitle>
      <v-file-input label="Upload  CSV"></v-file-input>
    </v-card-subtitle>
    <v-data-table
      :headers="headers"
      :items="targets"
      :search="search"
      item-key="id"
    >
    </v-data-table>
  </v-card>
</template>
<script lang="ts">
import { ITargetData } from "@/app/target/domain/Target.types";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";
import { TargetsState } from "@/ui/store/targets/state";
import Vue from "vue";
import { createNamespacedHelpers } from "vuex";
const watchlistHelper = createNamespacedHelpers("singleWatchlist");
const targetsHelper = createNamespacedHelpers("targets");

export default Vue.extend({
  data: () => ({
    search: "",
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Ra", value: "ra" },
      { text: "Dec", value: "dec" },
      { text: "radius", value: "radius" },
      { text: "N matches", value: "nMatches" },
      { text: "", value: "actions", sortable: false },
    ],
  }),
  computed: {
    ...watchlistHelper.mapState({
      watchlistId: function (state: SingleWatchlistState): number {
        return state.id;
      },
    }),
    ...targetsHelper.mapState({
      targets: function (state: TargetsState): ITargetData[] {
        console.log("STATE", state.targets);
        return state.targets;
      },
    }),
  },
  methods: {},
});
</script>

<style></style>
