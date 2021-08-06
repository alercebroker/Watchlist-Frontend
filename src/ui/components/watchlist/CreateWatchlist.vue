<template>
  <v-card>
    <v-card-title class="headline">Create New Watchlist</v-card-title>
    <targets-error
      v-if="detailError.targets != undefined"
      :errors="detailError.targets"
    />
    <csv-error
      v-if="detailError.row"
      :error="detailError.message"
      :line="detailError.row"
    />
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
import CsvError from "./CsvError.vue";
const watchlistHelper = createNamespacedHelpers("watchlists");

type CsvTarget = {
  name?: string;
  ra: number;
  dec: number;
  radius: number;
};

export default Vue.extend({
  components: { TargetsError, CsvError },
  data: (): {
    title: string;
    selectedFile: File | null;
    rules: Array<CallableFunction | string>;
  } => ({
    title: "",
    rules: [(v: string) => v.length > 0 || "Field can't be empty"],
    selectedFile: null,
  }),
  computed: {
    ...watchlistHelper.mapGetters(["genericError", "detailError", "errored"]),
  },
  methods: {
    ...watchlistHelper.mapActions([ActionTypes.createWatchlist]),
    ...watchlistHelper.mapMutations([MutationTypes.SET_ERROR]),
    async handleComplete(results: ParseResult<CsvTarget>, _file: File) {
      if (results.errors.length) {
        this.SET_ERROR(results.errors[0]);
      } else {
        const watchlistInput: WatchlistInput = {
          title: this.title,
          targets: results.data.map(
            (value) =>
              ({
                name: value.name,
                ra: value.ra,
                dec: value.dec,
                radius: value.radius,
              } as ITargetData)
          ),
        };
        await this.createWatchlist(watchlistInput);
        if (!this.errored) {
          this.$emit("created");
          console.log("emmited");
        }
      }
    },
    handleError(error: ParseError, _file: File) {
      this.SET_ERROR(error);
    },
    onCreateClick() {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        if (this.selectedFile != null) {
          parse(this.selectedFile, {
            header: true,
            error: this.handleError,
            complete: this.handleComplete,
          });
        }
      }
    },

    onCancelClick() {
      this.$emit("canceled");
    },
  },
});
</script>

<style></style>
