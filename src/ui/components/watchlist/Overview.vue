<template>
  <v-row>
    <v-col>
      <v-card id="targetsCard">
        <v-card-title>Targets</v-card-title>
        <v-card-text>
          <v-simple-table height="800">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Ra</th>
                  <th class="text-left">Dec</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  :id="'t' + item.id"
                  v-for="item in targets"
                  :key="item.id"
                  @click="onTargetClick(item)"
                  :class="{
                    rowSelected:
                      item.id === (selectedTarget ? selectedTarget.id : -1),
                  }"
                >
                  <td>{{ item.name }}</td>
                  <td>{{ item.ra }}</td>
                  <td>{{ item.dec }}</td>
                </tr>
              </tbody>
              <tfoot id="targetFoot">
                <tr>
                  <td colspan="3">
                    <p v-if="!targets.length">No targets for this watchlist</p>
                  </td>
                </tr>
              </tfoot>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card>
        <v-card-title>Matches</v-card-title>
        <v-card-text>
          <v-simple-table height="800">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Object</th>
                  <th class="text-left">Date</th>
                  <th class="text-left">Candid</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  :id="'m' + item.candid"
                  v-for="item in matches"
                  :key="item.candid"
                  @click="onMatchClick(item)"
                  :class="{
                    rowSelected: item === selectedMatch,
                  }"
                >
                  <td>{{ item.object_id }}</td>
                  <td>{{ item.date }}</td>
                  <td>{{ item.candid }}</td>
                </tr>
              </tbody>
              <tfoot id="matchFoot">
                <tr>
                  <td colspan="3">
                    <p
                      v-if="
                        !matches.length && selectedTarget && !loadingMatches
                      "
                    >
                      No matches for this target
                    </p>
                    <v-progress-linear
                      indeterminate
                      color="white"
                      v-if="loadingMatches"
                    ></v-progress-linear>
                  </td>
                </tr>
              </tfoot>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
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

const targetsHelper = createNamespacedHelpers("targets");
const watchlistHelper = createNamespacedHelpers("singleWatchlist");
const matchesHelper = createNamespacedHelpers("matches");
export default Vue.extend({
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
    }),
    ...matchesHelper.mapState({
      matches: function (state: MatchesState): IMatchData[] {
        return state.matches;
      },
      loadingMatches: function (state: MatchesState): boolean {
        return state.loading;
      },
    }),
    currentOid: function (): string {
      return this.selectedMatch ? this.selectedMatch.object_id : "";
    },
  },
  methods: {
    ...matchesHelper.mapActions(["getAllMatches"]),
    ...matchesHelper.mapMutations([MutationTypes.SET_MATCHES]),
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

<style>
.rowSelected {
  background-color: grey;
}
</style>
