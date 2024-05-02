<template>
  <v-card>
    <v-card-title>
      <span class="text-h5"> Set Filter</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <FormFilter @Close="handleClose" @on-submit="updateTargets" />
      </v-container>
    </v-card-text>

    <v-dialog v-model="confirmUpdate" max-width="500px" persistent>
      <v-card :loading="loading">
        <v-card-title class="text-h5">
          <span
            >¿Are you sure you want to change all the filters in the
            watchlist?</span
          >
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            :disabled="loading"
            @click="confirmUpdate = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="loading"
            @click="SaveUpdateWatchlistTargets"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { ActionTypes } from "@/ui/store/singleWatchlist/actions";
import { createNamespacedHelpers } from "vuex";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";
import { ActionTypes as TargetActionTypes } from "@/ui/store/targets/actions";
import {
  IConstantFilterParams,
  IWatchlistFilter,
} from "@/app/filter/domain/Filter.types";
import {
  ConstantFilterParams,
  WatchlistFilter,
} from "@/app/filter/domain/Filter";
import FormFilter from "./FormFilter.vue";
import FormMixin from "@/ui/mixins/watchlist/FormMixin";

const singleWatchlistHelper = createNamespacedHelpers("singleWatchlist");
const targetsHelper = createNamespacedHelpers("targets");

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof FormMixin>>
).extend({
  name: "CardFilter",
  mixins: [FormMixin],
  components: {
    FormFilter,
  },
  data() {
    return {
      confirmUpdate: false,
    };
  },
  computed: {
    ...singleWatchlistHelper.mapState({
      selectedWatchlist(state: SingleWatchlistState): SingleWatchlistState {
        return state;
      },
      loading(state: SingleWatchlistState): boolean {
        return state.loading;
      },
    }),
  },
  methods: {
    ...targetsHelper.mapActions([TargetActionTypes.getTargets]),
    ...singleWatchlistHelper.mapActions([ActionTypes.editTargetsWatchlist]),
    async SaveUpdateWatchlistTargets() {
      await this.editTargetsWatchlist({
        watchlist_id: this.selectedWatchlist.id,
        url: this.selectedWatchlist.url + "set_filters/",
        filter: this.parseFilter(),
      });

      this.getTargets({ params: { watchlistId: this.selectedWatchlist.id } });
      this.sendClose();
    },
    updateTargets(filterForm: any) {
      this.editedFilter = Object.assign({}, filterForm);
      this.confirmUpdate = true;
    },
    sendClose() {
      this.$emit("Close", false);
    },
    handleClose() {
      this.sendClose();
    },
    parseFilter(): IWatchlistFilter {
      let bandParams = new ConstantFilterParams({
        field: "fid",
        constant: this.editedFilter.band,
        op: "eq",
      });
      let type = this.editedFilter.type;
      if (type === "constant" && this.editedFilter.params) {
        let constantParams = new ConstantFilterParams(
          this.editedFilter.params as unknown as IConstantFilterParams
        );
        return new WatchlistFilter({
          fields: WatchlistFilter.mergeFields([
            constantParams.getFilterFields(),
            bandParams.getFilterFields(),
          ]),
          filters: [
            {
              type: "and",
              params: {
                filters: [
                  { type: "constant", params: constantParams },
                  { type: "constant", params: bandParams },
                ],
              },
            },
          ],
        });
      }

      return {
        fields: {},
        filters: [],
      };
    },
  },
});
</script>
<style></style>
