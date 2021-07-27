<template>
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
              v-for="(item, index) in matches"
              :key="index"
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
          <v-card v-intersect="onIntersect"></v-card>
          <tfoot id="matchFoot">
            <tr>
              <td colspan="3">
                <p
                  v-if="
                    matches.length == 0 &&
                    selectedTarget != undefined &&
                    !loading
                  "
                >
                  No matches for this target
                </p>
                <v-progress-linear
                  indeterminate
                  color="white"
                  v-if="loading"
                ></v-progress-linear>
              </td>
            </tr>
          </tfoot>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { IMatchData } from "@/app/match/domain/Match.types";
import { debounce } from "ts-debounce";
export default Vue.extend({
  props: {
    matches: Array,
    loading: Boolean,
    selectedTarget: Object,
  },
  data: (): {
    selectedMatch: IMatchData | null;
  } => ({
    selectedMatch: null,
  }),
  mounted() {
    console.log(
      this.matches.length == 0 &&
        this.selectedTarget != undefined &&
        !this.loading
    );
  },
  methods: {
    onMatchClick(item: IMatchData) {
      this.selectedMatch = item;
      this.$emit("matchSelected", item);
    },
    debouncedFunction() {
      return debounce(() => this.$emit("nextPage"), 400);
    },
    onIntersect(entries: IntersectionObserverEntry[]) {
      if (entries[0].isIntersecting) {
        this.debouncedFunction()();
      }
    },
  },
});
</script>

<style></style>
