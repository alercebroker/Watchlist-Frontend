<template>
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
              <th class="text-left"># Matches</th>
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
              <td>{{ item.nMatches }}</td>
            </tr>
          </tbody>
          <v-card v-if="targets" v-intersect="onIntersect"></v-card>
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
  } => ({
    selectedTarget: null,
  }),
  methods: {
    onTargetClick(item: ITargetData) {
      this.selectedTarget = item;
      this.$emit("targetSelected", item);
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

<style>
.rowSelected {
  background-color: grey;
}
</style>
