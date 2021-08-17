<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" small dark v-bind="attrs" v-on="on">
        Update targets
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">Update targets via CSV</v-card-title>
      <targets-error
        v-if="detailError.targets != undefined"
        :errors="detailError.targets"
      />
      <csv-error
        v-if="csvError"
        :error="csvError.message"
        :line="csvError.row"
      />
      <generic-error v-if="genericError" :error="genericError" />
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12"><p v-html="message"></p></v-col>
            </v-row>
            <v-col cols="12">
              <v-file-input
                accept=".csv"
                label="Upload  CSV"
                v-model="selectedFile"
              >
              </v-file-input>
            </v-col>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn id="cancel" color="error" text @click="onCloseClick">
          Cancel
        </v-btn>
        <v-btn id="upload" color="primary" text @click="onUploadClick">
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import CsvError from "./CsvError.vue";
import GenericError from "../shared/GenericError.vue";
import TargetsError from "./TargetsError.vue";

import {
  ActionTypes,
  BulkUpdateTargetsInput,
} from "@/ui/store/targets/actions";
import { createNamespacedHelpers } from "vuex";
import { ITargetData } from "@/app/target/domain/Target.types";
import { MutationTypes } from "@/ui/store/watchlist/mutations";
import { parse, ParseError, ParseResult } from "papaparse";

const watchlistHelper = createNamespacedHelpers("watchlists");
const targetsHelper = createNamespacedHelpers("targets");

// this must be in utils (copied from CreateWatchlist.vue)
type CsvTarget = {
  id: number;
  name?: string;
  ra: number;
  dec: number;
  radius: number;
};

export default Vue.extend({
  components: { TargetsError, CsvError, GenericError },
  data: (): {
    dialog: boolean;
    selectedFile: File | null;
    message: string;
    parsedCsv: CsvTarget[];
  } => ({
    dialog: false,
    selectedFile: null,
    message:
      "To upload a series of Targets to your Watchlist follow the instructions of <a href='/how-to'>how-to</a>. <br> <b> Note:</b> If you overwritte a target's name, this will be updated.",
    parsedCsv: [],
  }),
  computed: {
    ...watchlistHelper.mapGetters([
      "genericError",
      "csvError",
      "detailError",
      "errored",
    ]),
  },
  methods: {
    ...targetsHelper.mapActions([ActionTypes.bulkUpdateTargets]),
    ...watchlistHelper.mapMutations([MutationTypes.SET_ERROR]),
    handleError(error: ParseError | null) {
      this.SET_ERROR(error);
    },
    async handleComplete(results: ParseResult<CsvTarget>) {
      this.parsedCsv = results.data;
      const targets: BulkUpdateTargetsInput = {
        targetsList: this.parsedCsv.map(
          (value) =>
            ({
              id: value.id,
              name: value.name,
              ra: value.ra,
              dec: value.dec,
              radius: value.radius,
            } as ITargetData)
        ),
        watchlistId: 76,
      };
      console.log(targets);
      await this.bulkUpdateTargets(targets);
    },
    toDefaultValues() {
      this.selectedFile = null;
      this.parsedCsv = [];
    },
    onCloseClick() {
      this.toDefaultValues();
      this.dialog = false;
    },
    onUploadClick() {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        if (this.selectedFile != null) {
          parse(this.selectedFile, {
            header: true,
            skipEmptyLines: true,
            error: this.handleError,
            complete: this.handleComplete,
          });
        }
      }
      //this.toDefaultValues();
    },
  },
});
</script>
