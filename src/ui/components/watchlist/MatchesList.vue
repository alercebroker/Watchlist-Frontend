<template>
  <v-card>
    <v-card-title>Matches</v-card-title>
    <v-card-text>
      <v-container>
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
                          target != undefined &&
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
import { createNamespacedHelpers } from "vuex";
import { IMatchData } from "@/app/match/domain/Match.types";
import { MatchesState } from "@/ui/store/matches/state";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";

const matchesHelper = createNamespacedHelpers("matches");
const watchlistHelper = createNamespacedHelpers("singleWatchlist");

export default Vue.extend({
  props: {
    ObjectId: {
      type: String,
      default: () => "",
    },
    target: {
      type: Object,
      default: () => undefined,
    },
  },
  data: (): {
    selectedMatch: IMatchData | null;
    dateFormat: string;
    page: number;
    itemsPerPage: number;
  } => ({
    selectedMatch: null,
    dateFormat: "mjd",
    page: 1,
    itemsPerPage: 4,
  }),
  mounted() {
    this.matchesLoad();
  },
  computed: {
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
    filteredMatches(): IMatchData[] {
      return this.ObjectId
        ? this.formattedMatches.filter((e) => e.object_id == this.ObjectId)
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
        url: this.target.url,
        watchlistId: this.watchlistId,
        targetId: this.target.id,
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
  },
});
</script>

<style></style>
