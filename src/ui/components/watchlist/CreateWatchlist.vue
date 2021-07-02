<template>
  <v-card>
    <v-card-title class="headline">Create New Watchlist</v-card-title>

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
                  @change="onFilePicked"
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

      <v-btn text @click="onCancelClick">Cancel</v-btn>

      <v-btn id="send" color="primary" text @click="onCreateClick"
        >Create</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { ActionTypes, WatchlistInput } from "@/ui/store/watchlist/actions";

export default Vue.extend({
  data() {
    return {
      title: "",
      chosenFile: null,
      rules: [(v: string) => v.length > 0 || "Field can't be empty"],
      csvData: "",
      targetList: [] as any,
    };
  },
  methods: {
    async onCreateClick() {
      const form: any = this.$refs.form;
      if (form.validate()) {
        this.targetList = this.parseCSVToList(this.csvData);
        const watchlistInput: WatchlistInput = {
          title: this.title,
          targets: this.targetList,
        };
        await this.$store.dispatch(
          "watchlists/" + ActionTypes.createWatchlist,
          watchlistInput
        );
        this.$emit("created");
      }
    },

    onCancelClick() {
      this.$emit("canceled");
    },

    onFilePicked(file: any) {
      const fr = new FileReader();
      fr.readAsText(file);
      fr.addEventListener("load", () => {
        if (fr.result) {
          this.csvData = fr.result as string;
        }
      });
    },

    parseCSVToList(csvData: string) {
      let lines = csvData.split("\n");
      let headers = lines[0].split(",").map((x) => x.trim());
      let body = lines.slice(1, -1);
      return body.map((elem) => {
        let line = {} as any;
        elem.split(",").forEach((item, index) => {
          line[headers[index]] = item.trim();
        });

        return line;
      });
    },
  },
});
</script>

<style></style>
