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
              :loading="loading"
            ></v-select>
            <v-col class="text-right">
              <v-btn id="updateButton" color="warning" @click="update">
                Update
              </v-btn>
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
import { createNamespacedHelpers } from "vuex";
const watchlistHelper = createNamespacedHelpers("singleWatchlist");

export default Vue.extend({
  data: (): {
    select: string | null;
    valid: boolean;
    notificationRates: Array<Record<string, string | null>>;
  } => ({
    valid: true,
    select: null,
    notificationRates: [
      { text: "Disabled", value: null },
      { text: "Hourly", value: "01:00:00" },
      { text: "12 hours", value: "12:00:00" },
      { text: "Daily", value: "1 00:00:00" },
      { text: "Weekly", value: "7 00:00:00" },
      { text: "Monthly", value: "30 00:00:00" },
    ],
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
      loading: function (state: SingleWatchlistState): boolean {
        return state.loading;
      },
    }),
  },
  methods: {
    ...watchlistHelper.mapActions([ActionTypes.editWatchlist]),
    async update() {
      const payload: EditWatchlistPayload = {
        params: { title: this.watchlistTitle, notification_rate: this.select },
        watchlist: this.watchlistId,
      };
      await this.editWatchlist(payload);
    },
  },
  watch: {
    watchlistId: {
      handler(val) {
        this.select = this.notificationRate ? this.notificationRate : null;
      },
      immediate: true,
    },
  },
});
</script>

<style></style>
