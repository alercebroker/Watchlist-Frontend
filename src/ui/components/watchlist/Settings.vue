<template>
  <v-row>
    <v-col xs="12">
      <v-card class="mx-auto">
        <v-card-title>Settings for notification</v-card-title>
        <v-card-text>
          Here you can change your email account or the notification
          rate.</v-card-text
        >
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-select
              v-model="select"
              :items="notificationRates"
              label="Notification rate"
              required
              :loading = "loading"
            ></v-select>
            <v-col class="text-right">
              <v-btn id="updateButton" color="warning" @click="update"> Update </v-btn>
            </v-col>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";
import {
  ActionTypes,
  EditWatchlistPayload,
} from "@/ui/store/singleWatchlist/actions";
import { MutationTypes } from "@/ui/store/singleWatchlist/mutations";
import { createNamespacedHelpers } from "vuex";
import GenericError from "../shared/GenericError.vue";
const watchlistHelper = createNamespacedHelpers("singleWatchlist");

export default Vue.extend({
  data: (): {
    select: string,
    valid: boolean,
    notificationRates: Array<Record<string, string>>,
    } => ({
    valid: true,
    select: "disabled",
    notificationRates: [{text: "Disabled", value: "disabled"},
    {text: "Hourly", value: "hourly"}, 
    {text: "12 hours", value: "12 hours"}, 
    {text: "Daily", value: "daily"}, 
    {text: "Weekly", value: "weekly"}, 
    {text: "Monthly", value: "monthly"}],
  }),
  computed: {
    ...watchlistHelper.mapState({
      watchlistId: function (state: SingleWatchlistState): number {
        return state.id;
      },
      watchlistTitle: function (state: SingleWatchlistState): string {
        return state.title;
      },
      notificationRate: function (state: SingleWatchlistState): string {
        return state.notification_rate;
      },
      loading:function (state: SingleWatchlistState): boolean {
        return state.loading;
      }
    }),
  },
  methods: {
    ...watchlistHelper.mapActions([
      ActionTypes.editWatchlist,
    ]),
    async update(){
      const payload: EditWatchlistPayload = {
        params: {title: this.watchlistTitle, notification_rate: this.select},
        watchlist: this.watchlistId,
      }
      await this.editWatchlist(payload);
    },
  },
  watch: {
    watchlistId:{
      handler(val) {
        this.select = this.notificationRate? this.notificationRate:"disabled";
      },
      immediate: true
    }
  },
});
</script>

<style></style>
