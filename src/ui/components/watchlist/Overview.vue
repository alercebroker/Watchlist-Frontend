<template>
  <v-row>
    <v-col>
      <target-scrolling-list
        :targets="targets"
        :loading="loadingTargets"
        @targetSelected="onTargetClick"
        @nextPage="onTargetsNextPage"
      />
    </v-col>
    <v-col>
      <matches-scroling-list
        :matches="matches"
        :loading="loadingMatches"
        @matchSelected="onMatchClick"
        @nextPage="onMatchesNextPage"
      />
    </v-col>
    <v-col>
      <v-card height="100%">
        <v-card-title>Alert Info</v-card-title>
        <v-card-text>
          Link to Explorer:
          <a :href="'https://alerce.online/object/' + currentOid">{{
            currentOid
          }}</a>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { createNamespacedHelpers } from "vuex";
import { TargetsState } from "@/ui/store/targets/state";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";
import { ITargetData } from "@/app/target/domain/Target.types";
import { MatchesState } from "@/ui/store/matches/state";
import { IMatchData } from "@/app/match/domain/Match.types";
import { MutationTypes } from "@/ui/store/matches/mutations";
import TargetScrollingList from "./TargetScrollingList.vue";
import { ActionTypes as TargetActionTypes } from "@/ui/store/targets/actions";
import MatchesScrolingList from "./MatchesScrolingList.vue";

const targetsHelper = createNamespacedHelpers("targets");
const watchlistHelper = createNamespacedHelpers("singleWatchlist");
const matchesHelper = createNamespacedHelpers("matches");
export default Vue.extend({
  components: { TargetScrollingList, MatchesScrolingList },
  data: (): {
    selectedMatch: IMatchData | null;
    selectedTarget: ITargetData | null;
  } => ({
    selectedMatch: null,
    selectedTarget: null,
  }),
  computed: {
    ...watchlistHelper.mapState({
      watchlistId: function (state: SingleWatchlistState): number {
        return state.id;
      },
    }),
    ...targetsHelper.mapState({
      targets: function (state: TargetsState): ITargetData[] {
        return state.targets;
      },
      targetsNextPage: function (state: TargetsState): string | null {
        return state.nextPage;
      },
      loadingTargets: function (state: TargetsState): boolean {
        return state.loading;
      },
    }),
    ...matchesHelper.mapState({
      matches: function (state: MatchesState): IMatchData[] {
        return state.matches;
      },
      loadingMatches: function (state: MatchesState): boolean {
        return state.loading;
      },
      matchesNextPage: function (state: MatchesState): boolean {
        // TODO return state next page
        return false;
      },
    }),
    currentOid: function (): string {
      return this.selectedMatch ? this.selectedMatch.object_id : "";
    },
  },
  methods: {
    ...matchesHelper.mapActions(["getAllMatches"]),
    ...matchesHelper.mapMutations([MutationTypes.SET_MATCHES]),
    ...targetsHelper.mapActions([TargetActionTypes.getTargets]),
    onTargetClick(item: ITargetData) {
      this.selectedTarget = item;
      this.getAllMatches({
        url: item.url,
        watchlistId: this.watchlistId,
        targetId: item.id,
      });
    },
    onMatchClick(item: IMatchData) {
      this.selectedMatch = item;
    },
    onTargetsNextPage() {
      if (this.targetsNextPage) {
        this.getTargets({
          params: { url: this.targetsNextPage, append: true },
        });
      }
    },
    onMatchesNextPage() {
      if (this.matchesNextPage) {
        this.getAllMatches({
          params: { url: this.matchesNextPage, append: true },
        });
      }
    },
  },
  watch: {
    targets: {
      handler: function () {
        this.selectedMatch = null;
        this.selectedTarget = null;
        this.SET_MATCHES([]);
      },
      deep: true,
    },
  },
});
</script>

<style></style>
