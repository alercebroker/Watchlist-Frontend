<template>
  <v-card height="100%">
    <v-card-title>Targets</v-card-title>
    <v-data-table
      :server-items-length="targetCount"
      :headers="headers"
      :items="targets"
      :search="search"
      @update:page="onPageUpdate"
      @update:items-per-page="onItemsPerPageUpdate"
      :options.sync="tableOptions"
      item-key="id"
    >
    </v-data-table>
  </v-card>
</template>
<script lang="ts">
import { ITargetData } from "@/app/target/domain/Target.types";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";
import { ActionTypes } from "@/ui/store/targets/actions";
import { TargetsState } from "@/ui/store/targets/state";
import Vue from "vue";
import { DataOptions } from "vuetify";
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
      { text: "Ra", value: "ra", sortable: false },
      { text: "Dec", value: "dec", sortable: false },
      { text: "radius", value: "radius", sortable: false },
      { text: "N matches", value: "nMatches", sortable: false },
      { text: "", value: "actions", sortable: false },
    ],
    tableOptions: {} as DataOptions,
    currentPage: 1,
  }),
  mounted() {
    this.getTargets({
      params: { url: this.targetsUrl },
      paginationParams: { page_size: this.tableOptions.itemsPerPage },
    });
  },
  computed: {
    ...watchlistHelper.mapState({
      watchlistId: function (state: SingleWatchlistState): number {
        return state.id;
      },
      targetsUrl: function (state: SingleWatchlistState): string {
        return state.targets;
      },
    }),
    ...targetsHelper.mapState({
      targets: function (state: TargetsState): ITargetData[] {
        return state.targets;
      },
      targetCount: function (state: TargetsState): number {
        return state.count;
      },
      nextPage: function (state: TargetsState): string | null {
        return state.nextPage;
      },
      prevPage: function (state: TargetsState): string | null {
        return state.prevPage;
      },
    }),
  },
  methods: {
    ...targetsHelper.mapActions([ActionTypes.getTargets]),
    onPageUpdate(page: number) {
      if (page > this.currentPage && this.nextPage) {
        this.getTargets({
          params: { url: this.nextPage },
          paginationParams: { page_size: this.tableOptions.itemsPerPage },
        });
      }
    },
    onItemsPerPageUpdate(perPage: number) {
      this.getTargets({
        params: { url: this.targetsUrl },
        paginationParams: { page_size: perPage },
      });
    },
  },
});
</script>

<style></style>
