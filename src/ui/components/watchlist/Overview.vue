<template>
  <overview-layout>
    <template v-slot:target>
      <TargetCard :target="singleItem" :loading="singleItemLoading" />
    </template>
    <template v-slot:matches>
      <matches-scroling-list
        @matchSelected="onMatchClick"
        @objectSelected="onSelectedObject"
      />
    </template>
    <template v-slot:alertInfo>
      <v-btn
        :disabled="currentOid ? false : true"
        @click="goToLink"
        color="primary"
        small
        dark
        >Alert Info</v-btn
      >
    </template>
  </overview-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { createNamespacedHelpers } from "vuex";
import { TargetsState } from "@/ui/store/targets/state";
import { ITargetData } from "@/app/target/domain/Target.types";
import { IMatchData } from "@/app/match/domain/Match.types";
import TargetCard from "./TargetCard.vue";
import { ActionTypes as TargetActionTypes } from "@/ui/store/targets/actions";
import MatchesScrolingList from "./MatchesScrolingList.vue";
import OverviewLayout from "@/ui/layouts/OverviewLayout.vue";
import { SingleTargetState } from "@/ui/store/singleTarget/state";

const targetsHelper = createNamespacedHelpers("targets");
const singleTargetHelper = createNamespacedHelpers("singleTarget");
export default Vue.extend({
  components: { TargetCard, MatchesScrolingList, OverviewLayout },
  data: (): {
    selectedMatch: IMatchData | null;
    selectedObject: string | null;
  } => ({
    selectedMatch: null,
    selectedObject: "",
  }),
  computed: {
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
    onTargetsNextPage() {
      if (this.targetsNextPage) {
        this.getTargets({
          params: { url: this.targetsNextPage, append: true },
        });
      }
    },
    goToLink() {
      window.open("https://alerce.online/object/" + this.currentOid, "_blank");
    },
  },
  watch: {
    targets: {
      handler: function () {
        this.selectedMatch = null;
      },
      deep: true,
    },
  },
});
</script>

<style></style>
