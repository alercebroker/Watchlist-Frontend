<template>
  <v-card id="targetsCard">
    <v-card-title>Target</v-card-title>
    <v-card-text>
      <v-simple-table ref="targetsTable" dense fixed-header>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Ra</th>
              <th class="text-left">Dec</th>
              <th class="text-left"># Matches</th>
            </tr>
          </thead>
          <tbody>
            <tr :id="'t' + item.id" v-for="item in targets" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.ra }}</td>
              <td>{{ item.dec }}</td>
              <td>{{ item.nMatches }}</td>
            </tr>
          </tbody>
          <v-card
            id="hiddenTargetsCard"
            ref="hiddenTargetsCard"
            v-if="targets"
            v-intersect="onIntersect"
          ></v-card>
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
</template>

<script lang="ts">
import { ITargetData } from "@/app/target/domain/Target.types";
import { debounce } from "ts-debounce";

import Vue from "vue";
export default Vue.extend({
  props: {
    targets: Array,
    loading: Boolean,
  },
  data: (): {
    selectedTarget: ITargetData | null;
    scrolled: boolean;
  } => ({
    selectedTarget: null,
    scrolled: false,
  }),
  methods: {
    debouncedFunction() {
      return debounce(() => this.$emit("nextPage"), 400);
    },
    onIntersect(entries: IntersectionObserverEntry[]) {
      if (entries[0].isIntersecting) {
        this.debouncedFunction();
      }
      this.scrolled = entries[0].isIntersecting;
    },
  },
  watch: {
    targets() {
      if (this.scrolled) {
        this.debouncedFunction();
      }
    },
  },
});
</script>

<style>
.targetTable {
  height: 50%;
}
</style>
