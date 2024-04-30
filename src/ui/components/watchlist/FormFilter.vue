<template>
  <v-card>
    <v-card-title>
      <span class="text-h5"> Set Filter</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form ref="form">
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-autocomplete
                v-model="editedFilter.type"
                label="Condition"
                :items="validValuesToInputItems(validFilters)"
                :rules="[checkValidFilters]"
              ></v-autocomplete>
            </v-col>
            <template v-if="editedFilter.type === 'constant'">
              <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                  v-model="editedFilter.params.field"
                  label="Field"
                  :items="validValuesToInputItems(validFields)"
                  :rules="[checkValidFields]"
                ></v-autocomplete>
              </v-col>
            </template>
          </v-row>
          <template v-if="editedFilter.type === 'constant'">
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="editedFilter.params.op"
                  label="Operation"
                  :items="validValuesToInputItems(validOperations)"
                  :rules="[checkValidOperations]"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedFilter.params.constant"
                  label="Value"
                  :rules="[checkValidConstant]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                  v-model="editedFilter.band"
                  label="Band"
                  :items="validValuesToInputItems(validBands)"
                  :rules="[checkValidBands]"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </template>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="sendClose">
              Cancel
            </v-btn>
            <v-btn
              id="saveButton"
              color="blue darken-1"
              text
              @click="checkHandler"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-container>
    </v-card-text>

    <v-dialog v-model="confirmDialog" max-width="500px" persistent>
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
            :disabled="loading"
            text
            @click="confirmDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" :disabled="loading" text @click="onSave"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { createNamespacedHelpers } from "vuex";
import { ActionTypes } from "@/ui/store/singleWatchlist/actions";
import Vue, { VueConstructor } from "vue";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";
import {
  ConstantFilterParams,
  WatchlistFilter,
} from "@/app/filter/domain/Filter";
import {
  IConstantFilterParams,
  IWatchlistFilter,
} from "@/app/filter/domain/Filter.types";
import { ActionTypes as TargetActionTypes } from "@/ui/store/targets/actions";
import FormMixin from "@/ui/mixins/watchlist/FormMixin";

const singleWatchlistHelper = createNamespacedHelpers("singleWatchlist");
const targetsHelper = createNamespacedHelpers("targets");

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof FormMixin>>
).extend({
  name: "FormFilter",
  mixins: [FormMixin],
  data() {
    return {
      confirmDialog: false,
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
    async onSave() {
      await this.editTargetsWatchlist({
        watchlist_id: this.selectedWatchlist.id,
        url: this.selectedWatchlist.url + "set_filters/",
        filter: this.parseFilter(),
      });

      this.getTargets({ params: { watchlistId: this.selectedWatchlist.id } });
      this.sendClose();
    },
    async checkHandler() {
      if (this.$refs.form) {
        const valid = await (this.$refs.form as any).validate();
        if (valid) {
          this.confirmDialog = true;
        }
      }
    },
    sendClose() {
      this.editedFilter = Object.assign({}, this.defaultFilter);
      this.$emit("booleanClose", false);
      this.confirmDialog = false;
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
