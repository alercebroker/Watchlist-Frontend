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
              :items="validFilters.filters"
              :rules="[verifiedFilter]"
            ></v-autocomplete>
          </v-col>
          <template v-if="item.type === 'Constant'">
            <v-col cols="12" sm="6" md="4">
              <v-autocomplete
                v-model="item.params.field"
                label="Field"
                :items="validFields.fields"
                :rules="[verifiedField]"
              ></v-autocomplete>
            </v-col>
          </template>
        </v-row>
        <template v-if="item.type === 'Constant'">
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="item.params.op"
                label="Operation"
                :items="validOperations.op"
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
                v-model="item.params.band"
                label="Band"
                :items="validBands.bands"
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

<script>
import { createNamespacedHelpers } from "vuex";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";
import { ActionTypes } from "@/ui/store/singleWatchlist/actions";
const singleWatchlistHelper = createNamespacedHelpers("singleWatchlist");

export default {
  name: "FormFilter",
  data() {
    return {
      item: {
        type: "",
        params: {
          field: "",
          op: "",
          constant: "",
          band: "",
        },
        watchlist_id: 0,
        url: "",
      },
      defaultItem: {
        type: "",
        params: {
          field: "",
          op: "",
          constant: "",
          band: "",
        },
        watchlist_id: 0,
        url: "",
      },
      validBands: {
        bands: ["Green", "Red", "I"],
      },
      validOperations: {
        op: ["eq", "less", "less eq", "greater", "greater eq"],
      },
      validFields: {
        fields: ["mag"],
      },
      validFilters: {
        filters: ["Constant", "No filter"],
      },
    };
  },
  computed: {
    ...singleWatchlistHelper.mapState({
      selectedWatchlist: function (state) {
        return state;
      },
    }),
  },
  methods: {
    ...singleWatchlistHelper.mapActions([ActionTypes.editTargetsWatchlist]),
    async onSave() {
      this.item.watchlist_id = this.selectedWatchlist.id;
      this.item.url = this.selectedWatchlist.url;
      await this.editTargetsWatchlist(this.item);
    },
    sendClose() {
      this.item = Object.assign({}, this.defaultItem);
      this.$emit("booleanClose", false);
    },
    verifiedConstant() {
      if (!isNaN(this.item.params.constant)) {
        return true;
      } else {
        return "The constant must be a number";
      }
    },
    verifiedBand() {
      if (this.validBands.bands.includes(this.item.params.band)) {
        return true;
      } else {
        return "The band must be one of the options shown";
      }
    },
    verifiedOperation() {
      if (this.validOperations.op.includes(this.item.params.op)) {
        return true;
      } else {
        return "The operation must be one of the options shown";
      }
    },
    verifiedField() {
      if (this.validFields.fields.includes(this.item.params.field)) {
        return true;
      } else {
        return "The field must be one of the options shown";
      }
    },
    verifiedFilter() {
      if (this.validFilters.filters.includes(this.item.type)) {
        return true;
      } else {
        return "The filter must be one of the options shown";
      }
    },
  },
};
</script>

<style></style>
