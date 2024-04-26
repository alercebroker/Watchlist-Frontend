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
                v-model="item.type"
                label="Condition"
                :items="validValuesToInputItems(validFilters)"
                :rules="[verifiedFilter]"
              ></v-autocomplete>
            </v-col>
            <template v-if="item.type === 'constant'">
              <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                  v-model="item.params.field"
                  label="Field"
                  :items="validValuesToInputItems(validFields)"
                  :rules="[verifiedField]"
                ></v-autocomplete>
              </v-col>
            </template>
          </v-row>
          <template v-if="item.type === 'constant'">
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="item.params.op"
                  label="Operation"
                  :items="validValuesToInputItems(validOperations)"
                  :rules="[verifiedOperation]"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="item.params.constant"
                  label="Value"
                  :rules="[verifiedConstant]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                  v-model="item.band"
                  label="Band"
                  :items="validValuesToInputItems(validBands)"
                  :rules="[verifiedBand]"
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
      <v-card :loading="loading_singleWatchlist">
        <v-card-title class="text-h5">
          <span
            >¿Are you sure you want to change all the filters in the watchlist?</span
          >
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            :disabled="loading_singleWatchlist"
            text
            @click="confirmDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            :disabled="loading_singleWatchlist"
            text
            @click="onSave"
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
import Vue from "vue";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";
import {
  ConstantFilterParams,
  WatchlistFilter,
} from "@/app/filter/domain/Filter";
import {
  FilterType,
  IConstantFilterParams,
  IWatchlistFilter,
} from "@/app/filter/domain/Filter.types";
import { ActionTypes as TargetActionTypes } from "@/ui/store/targets/actions";

const singleWatchlistHelper = createNamespacedHelpers("singleWatchlist");
const targetsHelper = createNamespacedHelpers("targets");

interface Item {
  type: FilterType;
  params: Record<string, unknown>;
  band: number;
}

export default Vue.extend({
  name: "FormFilter",
  data() {
    return {
      confirmDialog: false,
      item: {
        type: "",
        params: {
          field: "",
          op: "",
          constant: 0,
        },
        band: 0,
      } as Item,
      defaultItem: {
        type: "",
        params: {
          field: "",
          op: "",
          constant: 0,
        },
        band: 0,
      } as Item,
      validBands: {
        g: 1,
        r: 2,
        i: 3,
      },
      validOperations: {
        Equal: "eq",
        "Less than": "less",
        "Less than or equal": "less eq",
        "Greater than": "greater",
        "Greater than or equal": "greater eq",
      },
      validFields: {
        mag: "mag",
      },
      validFilters: {
        Constant: "constant",
        "No filter": "",
      },
      validForm: true,
    };
  },
  computed: {
    ...singleWatchlistHelper.mapState({
      selectedWatchlist(state: SingleWatchlistState): SingleWatchlistState {
        return state;
      },
      loading_singleWatchlist(state: SingleWatchlistState): boolean {
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
      this.item = Object.assign({}, this.defaultItem);
      this.$emit("booleanClose", false);
      this.confirmDialog = false;
    },
    rValid<T extends string | number>(validValues: Record<string, T>) {
      return Object.fromEntries(
        Object.entries(validValues).map(([text, value]) => [value, text])
      ) as Record<T, string>;
    },
    verifiedConstant() {
      let params = this.item.params as unknown as IConstantFilterParams;
      if (!isNaN(params.constant)) {
        if (params.constant != 0) {
          return true;
        } else {
          return "It must be diffent of 0";
        }
      } else {
        return "The constant must be a number";
      }
    },
    verifiedBand() {
      let rValidBands = this.rValid(this.validBands);
      let band = this.item.band;
      if (rValidBands[band]) {
        return true;
      } else {
        return "The band must be one of the options shown";
      }
    },
    verifiedOperation() {
      let rValidOperations = this.rValid(this.validOperations);
      let params = this.item.params as unknown as IConstantFilterParams;
      if (rValidOperations[params.op]) {
        return true;
      } else {
        return "The operation must be one of the options shown";
      }
    },
    verifiedField() {
      let rValidFields = this.rValid(this.validFields);
      let params = this.item.params as unknown as IConstantFilterParams;
      if (rValidFields[params.field]) {
        return true;
      } else {
        return "The field must be one of the options shown";
      }
    },
    verifiedFilter() {
      let rValidFilters = this.rValid(this.validFilters);
      let filter = this.item.type;
      if (rValidFilters[filter]) {
        return true;
      } else {
        return "The filter must be one of the options shown";
      }
    },
    validValuesToInputItems<T extends string | number>(
      validValues: Record<string, T>
    ) {
      return Object.entries(validValues).map(([text, value]) => ({
        text,
        value,
      }));
    },
    parseFilter(): IWatchlistFilter {
      let bandParams = new ConstantFilterParams({
        field: "fid",
        constant: this.item.band,
        op: "eq",
      });
      let type = this.item.type;
      if (type === "constant" && this.item.params) {
        let constantParams = new ConstantFilterParams(
          this.item.params as unknown as IConstantFilterParams
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
