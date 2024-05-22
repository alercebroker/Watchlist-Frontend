<template>
  <v-card class="overflow-y-auto" max-height="700">
    <v-card-title>Matches</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="3">
            <v-select
              v-model="selectedObject"
              :items="Objects"
              density="compact"
              label="Objects"
            ></v-select>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row justify="center">
          <v-col cols="8">
            <div id="lightcurve-app" class="tw-dark" ></div> 
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Object</th>
                    <th class="text-left">
                      Date
                      <v-btn plain @click="toggleDateFormat">{{
                        dateFormat
                      }}</v-btn>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    :id="'m' + item.candid"
                    v-for="(item, index) in paginatedItems"
                    :key="index"
                    @click="onMatchClick(item)"
                    :class="{
                      rowSelected: item === selectedMatch,
                    }"
                  >
                    <td>{{ item.object_id }}</td>
                    <td>{{ item.date }}</td>
                  </tr>
                </tbody>
                <v-card></v-card>
                <tfoot id="matchFoot">
                  <tr>
                    <td colspan="3">
                      <p
                        v-if="
                          paginatedItems.length == 0 &&
                          singleItem != undefined &&
                          !loadingMatches
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
            <v-pagination
              v-model="page"
              :length="numberOfPages"
              :total-visible="7"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import htmx from "htmx.org";
import { createNamespacedHelpers } from "vuex";
import { IMatchData } from "@/app/match/domain/Match.types";
import { ITargetData } from "@/app/target/domain/Target.types";
import { MatchesState } from "@/ui/store/matches/state";
import { SingleTargetState } from "@/ui/store/singleTarget/state";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";

const matchesHelper = createNamespacedHelpers("matches");
const watchlistHelper = createNamespacedHelpers("singleWatchlist");
const singleTargetHelper = createNamespacedHelpers("singleTarget");

export default Vue.extend({
  data: (): {
    selectedMatch: IMatchData | null;
    selectedObject: string | null;
    dateFormat: string;
    page: number;
    itemsPerPage: number;
    loadingLightCurve: boolean;
  } => ({
    selectedMatch: null,
    selectedObject: "",
    dateFormat: "mjd",
    page: 1,
    itemsPerPage: 5,
    loadingLightCurve: false,
  }),
  mounted() {
    this.matchesLoad();
  },
  computed: {
    ...singleTargetHelper.mapState({
      singleItem: function (state: SingleTargetState): ITargetData {
        return state.target;
      },
    }),
    ...watchlistHelper.mapState({
      watchlistId: function (state: SingleWatchlistState): number {
        return state.id;
      },
    }),
    ...matchesHelper.mapState({
      loadingMatches: function (state: MatchesState): boolean {
        return state.loading;
      },
    }),
    ...matchesHelper.mapGetters(["formattedUTCMatches", "formattedMJDMatches"]),
    formattedMatches: function (): IMatchData[] {
      if (this.dateFormat == "mjd") return this.formattedMJDMatches;
      return this.formattedUTCMatches;
    },
    Objects: function (): IMatchData[] {
      return Array.from(
        new Set(this.formattedUTCMatches.map((e: IMatchData) => e.object_id))
      );
    },
    filteredMatches(): IMatchData[] {
      return this.selectedObject
        ? this.formattedMatches.filter(
            (e) => e.object_id == this.selectedObject
          )
        : this.formattedMatches;
    },
    numberOfPages(): number {
      return Math.ceil(this.filteredMatches.length / this.itemsPerPage);
    },
    paginatedItems(): IMatchData[] {
      const startIndex = (this.page - 1) * this.itemsPerPage;
      return this.filteredMatches.slice(
        startIndex,
        startIndex + this.itemsPerPage
      );
    },
  },
  methods: {
    ...matchesHelper.mapActions(["getAllMatches"]),
    matchesLoad() {
      this.getAllMatches({
        url: this.singleItem.url,
        watchlistId: this.watchlistId,
        targetId: this.singleItem.id,
      });
    },
    onMatchClick(item: IMatchData) {
      this.selectedMatch = item;
      this.$emit("matchSelected", item);
    },
    toggleDateFormat() {
      this.dateFormat == "mjd"
        ? (this.dateFormat = "UTC")
        : (this.dateFormat = "mjd");
    },
    callLightCurve() {
      this.loadingLightCurve = true;

      htmx.ajax(
        "GET",
        `https://api.alerce.online/v2/lightcurve/htmx/lightcurve?oid=${this.selectedObject}`,
        {
          target: "#lightcurve-app",
          swap: "innerHTML",
        }
      );
    },
  },
  watch: {
    selectedObject(newVal) {
      this.$emit("objectSelected", newVal);
      this.callLightCurve();
    },
    Objects(newVal) {
      this.selectedObject = newVal.length > 0 ? newVal[0] : null;
    },
  },
});
</script>

<style></style>
