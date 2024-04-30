<template>
  <v-card>
    <v-card-title class="headline">Create New Watchlist</v-card-title>
    <targets-error
      v-if="detailError.targets != undefined"
      :errors="detailError.targets"
    />
    <csv-error v-if="csvError" :error="csvError.message" :line="csvError.row" />
    <generic-error v-if="genericError" :error="genericError" />
    <v-card-text>
      <v-form ref="form">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="title"
                label="Title"
                :rules="rules"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-card-subtitle>
                <v-file-input
                  accept=".csv"
                  label="Upload  CSV"
                  v-model="selectedFile"
                >
                </v-file-input>
              </v-card-subtitle>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn id="cancel" text @click="onCancelClick">Cancel</v-btn>

      <v-btn id="send" color="primary" text @click="onCreateClick"
        >Create</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { ActionTypes, WatchlistInput } from "@/ui/store/watchlist/actions";
import { createNamespacedHelpers } from "vuex";
import TargetsError from "./TargetsError.vue";
import { parse, ParseError, ParseResult } from "papaparse";
import { MutationTypes } from "@/ui/store/watchlist/mutations";
import { ITargetData } from "@/app/target/domain/Target.types";
import { IWatchlistFilter } from "@/app/filter/domain/Filter.types";
import CsvError from "./CsvError.vue";
import GenericError from "../shared/GenericError.vue";
import { filter } from "vue/types/umd";
const watchlistHelper = createNamespacedHelpers("watchlists");

type CsvTarget = {
  name?: string;
  ra: number;
  dec: number;
  radius: number;
  filter: IWatchlistFilter;
};

export default Vue.extend({
  components: { TargetsError, CsvError, GenericError },
  data: (): {
    title: string;
    selectedFile: File | null;
    rules: Array<CallableFunction | string>;
    parsedCsv: CsvTarget[];
  } => ({
    title: "",
    rules: [(v: string) => v.length > 0 || "Field can't be empty"],
    selectedFile: null,
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
    ...watchlistHelper.mapActions([ActionTypes.createWatchlist]),
    ...watchlistHelper.mapMutations([MutationTypes.SET_ERROR]),
    handleError(error: ParseError | null) {
      this.SET_ERROR(error);
    },
    async handleComplete(results: ParseResult<CsvTarget>) {
      this.parsedCsv = results.data;
      const watchlistInput: WatchlistInput = {
        title: this.title,
        targets: this.parsedCsv.map(
          (value) =>
            ({
              name: value.name,
              ra: value.ra,
              dec: value.dec,
              radius: value.radius,
              filter: value.filter,
            } as ITargetData)
        ),
      };
      await this.createWatchlist(watchlistInput);
      if (!this.errored) this.$emit("created");
    },
    async onCreateClick() {
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
    },
    toDefaultValues() {
      this.title = "";
      this.selectedFile = null;
      this.parsedCsv = [];
    },
    onCancelClick() {
      this.handleError(null);
      this.toDefaultValues();
      this.$emit("canceled");
    },
  },
});
</script>

<style></style>
