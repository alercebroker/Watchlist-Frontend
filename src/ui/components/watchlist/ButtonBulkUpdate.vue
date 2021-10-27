<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        id="openUpload"
        color="primary"
        small
        dark
        v-bind="attrs"
        v-on="on"
        class="mb-2 mr-1"
      >
        Update targets
      </v-btn>
    </template>
    <v-card id="uploadCard">
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
      <generic-error v-if="genericError && !csvError" :error="genericError" />
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
                :error-messages="detailError.message"
                show-size
                truncate-length="50"
                :loading="loading"
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
import { MutationTypes } from "@/ui/store/targets/mutations";
import { parse, ParseResult } from "papaparse";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";
import { TargetsState } from "@/ui/store/targets/state";

const targetsHelper = createNamespacedHelpers("targets");
const watchlistHelper = createNamespacedHelpers("singleWatchlist");

type CsvTarget = {
  id: number;
  name?: string;
  ra: number;
  dec: number;
  radius: number;
};

export default Vue.extend({
  components: { CsvError, GenericError, TargetsError },
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
    ...targetsHelper.mapGetters([
      "genericError",
      "csvError",
      "detailError",
      "errored",
    ]),
    ...targetsHelper.mapState({
      loading: function (state: TargetsState): boolean {
        return state.loading;
      },
    }),
    ...watchlistHelper.mapState({
      watchlistId: function (state: SingleWatchlistState): number {
        return state.id;
      },
    }),
  },
  methods: {
    ...targetsHelper.mapActions([ActionTypes.bulkUpdateTargets]),
    ...targetsHelper.mapMutations([
      MutationTypes.SET_ERROR,
      MutationTypes.SET_LOADING,
    ]),
    async handleComplete(results: ParseResult<CsvTarget>) {
      this.parsedCsv = results.data;
      if (results.errors.length) {
        this.SET_ERROR(results.errors[0]);
        this.SET_LOADING(false);
        return;
      }
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
        watchlistId: this.watchlistId,
      };
      await this.bulkUpdateTargets(targets);
      if (!this.errored) this.onCloseClick();
    },
    toDefaultValues() {
      this.selectedFile = null;
      this.parsedCsv = [];
      this.SET_ERROR(null);
    },
    onCloseClick() {
      this.toDefaultValues();
      this.dialog = false;
    },
    onUploadClick() {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        if (this.selectedFile != null) {
          this.SET_LOADING(true);
          parse(this.selectedFile, {
            header: true,
            skipEmptyLines: true,
            complete: this.handleComplete,
          });
        }
      }
    },
  },
});
</script>
