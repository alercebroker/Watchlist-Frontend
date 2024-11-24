<template>
  <v-card v-if="Object.keys(singleItem).length == 0">
    <v-card-text class="d-flex justify-center">
      <h3>No target selected</h3>
    </v-card-text>
  </v-card>
  <v-card v-else id="cardOverview" max-height="800" class="overflow-condition">
    <overview-layout>
      <template v-slot:selecter>
        <v-select
          v-model="selectedObject"
          :items="Objects"
          density="compact"
          label="Objects"
        ></v-select>
      </template>
      <template v-slot:lightcurve>
        <LigthCurveCard
          :ObjectId="selectedObject"
          :loading="loadingLightcurve"
          @loadComplete="handleLoading()"
        />
      </template>
      <template v-slot:target>
        <TargetCard :target="singleItem" :loading="singleItemLoading" />
      </template>
      <template v-slot:matches>
        <matches-list
          :target="singleItem"
          :ObjectId="selectedObject"
          @matchSelected="onMatchClick"
        />
      </template>
      <template v-slot:alertInfo>
        <v-btn
          id="explorer-button"
          class="no-uppercase"
          :disabled="currentOid ? false : true"
          @click="goToLink"
          color="primary"
          small
          dark
        >
          ALeRCE Explorer
        </v-btn>
      </template>
    </overview-layout>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { createNamespacedHelpers } from "vuex";
import { TargetsState } from "@/ui/store/targets/state";
import { SingleTargetState } from "@/ui/store/singleTarget/state";
import { ITargetData } from "@/app/target/domain/Target.types";
import { IMatchData } from "@/app/match/domain/Match.types";
import { ActionTypes as TargetActionTypes } from "@/ui/store/targets/actions";
import TargetCard from "./TargetCard.vue";
import LigthCurveCard from "./LightCurveCard.vue";
import MatchesList from "./MatchesList.vue";
import OverviewLayout from "@/ui/layouts/OverviewLayout.vue";

const targetsHelper = createNamespacedHelpers("targets");
const matchesHelper = createNamespacedHelpers("matches");
const singleTargetHelper = createNamespacedHelpers("singleTarget");

export default Vue.extend({
  components: {
    TargetCard,
    MatchesList,
    OverviewLayout,
    LigthCurveCard,
  },
  data: (): {
    selectedMatch: IMatchData | null;
    selectedObject: string | null;
    dateFormat: string;
    loadingLightcurve: boolean;
  } => ({
    selectedMatch: null,
    selectedObject: "",
    dateFormat: "mjd",
    loadingLightcurve: true,
  }),
  computed: {
    ...matchesHelper.mapGetters(["formattedUTCMatches"]),
    Objects: function (): IMatchData[] {
      return Array.from(
        new Set(this.formattedUTCMatches.map((e: IMatchData) => e.object_id))
      );
    },
    ...targetsHelper.mapState({
      targets: function (state: TargetsState): ITargetData[] {
        return state.targets;
      },
    }),
    ...singleTargetHelper.mapState({
      singleItem: function (state: SingleTargetState): ITargetData {
        return state.target;
      },
      singleItemLoading: function (state: SingleTargetState): boolean {
        return state.loading;
      },
    }),
    currentOid: function (): string {
      return this.selectedObject ? this.selectedObject : "";
    },
  },
  methods: {
    ...targetsHelper.mapActions([TargetActionTypes.getTargets]),
    onMatchClick(item: IMatchData) {
      this.selectedMatch = item;
    },
    onSelectedObject(item: string) {
      this.selectedObject = item;
    },
    goToLink() {
      window.open("https://alerce.online/object/" + this.currentOid, "_blank");
    },
    handleLoading() {
      this.loadingLightcurve = false;
    },
  },
  watch: {
    targets: {
      handler: function () {
        this.selectedMatch = null;
      },
      deep: true,
    },
    Objects(newVal) {
      this.selectedObject = newVal.length > 0 ? newVal[0] : null;
    },
  },
});
</script>

<style scoped>
@media (max-width: 1280px) {
  .overflow-condition {
    overflow: auto;
  }
}

.no-uppercase {
  text-transform: none;
}
</style>
