<template>
  <v-card>
    <v-card-title>
      <span class="text-h5"> New Targets</span>
    </v-card-title>
    <v-card-text>
      <v-container>
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
                type="number"
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
          <v-btn color="blue darken-1" text @click="sendClose"> Cancel </v-btn>
          <v-btn id="saveButton" color="blue darken-1" text @click="onSave">
            Save
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card-text>
    <v-card-actions></v-card-actions>
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
      item: {
        type: "",
        params: {
          field: "",
          op: "eq",
          constant: NaN,
        },
        band: 0,
      } as Item,
      defaultItem: {
        type: "",
        params: {
          field: "",
          op: "eq",
          constant: NaN,
        },
        band: 0,
      } as Item,
      validBands: {
        Green: 1,
        Red: 2,
        I: 3,
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
    };
  },
  computed: {
    ...singleWatchlistHelper.mapState({
      selectedWatchlist(state: SingleWatchlistState): SingleWatchlistState {
        return state;
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
    sendClose() {
      this.item = Object.assign({}, this.defaultItem);
      this.$emit("booleanClose", false);
    },
    rValid<T extends string | number>(validValues: Record<string, T>) {
      return Object.fromEntries(
        Object.entries(validValues).map(([text, value]) => [value, text])
      ) as Record<T, string>;
    },
    verifiedConstant() {
      let params = this.item.params as unknown as IConstantFilterParams;
      if (!isNaN(params.constant)) {
        return true;
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
