<template>
  <v-btn
    small
    id="downloadBtn"
    color="primary"
    class="mb-2 mr-2"
    :loading="loading"
    @click="downloadTargets({ watchlistId })"
  >
    <v-icon left> mdi-cloud-download </v-icon>
    Download Targets
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";

import { createNamespacedHelpers } from "vuex";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";
import { TargetsState } from "@/ui/store/targets/state";
import { ActionTypes } from "@/ui/store/targets/actions";
const targetsHelper = createNamespacedHelpers("targets");
const watchlistHelper = createNamespacedHelpers("singleWatchlist");

export default Vue.extend({
  computed: {
    ...targetsHelper.mapState({
      loading: function (state: TargetsState): boolean {
        return state.loading;
      },
    }),
    ...watchlistHelper.mapState({
      watchlistId: function (state: SingleWatchlistState): number {
        return state.id;
      },
    }),
  },
  methods: {
    ...targetsHelper.mapActions([ActionTypes.downloadTargets]),
  },
});
</script>
