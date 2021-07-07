<template>
  <v-container>
    <a-header title="ALeRCE Watchlist"></a-header>
    <v-row v-if="!logged" align="center" align-content="center">
      <v-col cols="4">
        <login @registerClick="dialog = true" />
        <v-dialog v-model="dialog" max-width="500">
          <register-user @registered="dialog = false" />
        </v-dialog>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col xs="12" lg="3">
        <my-watchlists @createWatchlist="watchlist_dialog = true" />
      </v-col>
      <v-col xs="12" lg="9">
        <watchlist-details />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import MyWatchlists from "@/ui/components/watchlist/MyWatchlists.vue";
import WatchlistDetails from "../components/watchlist/WatchlistDetails.vue";
import Login from "../components/users/Login.vue";
import RegisterUser from "../components/users/RegisterUser.vue";
import AHeader from "@/ui/components/watchlist/AHeader.vue";
import { IUserData } from "@/app/user/domain/User.types";

export default Vue.extend({
  components: { AHeader, MyWatchlists, WatchlistDetails, Login, RegisterUser },
  data: (): {
    dialog: boolean;
    watchlist_dialog: boolean;
    accessToken: string | null;
  } => ({
    dialog: false,
    watchlist_dialog: false,
    accessToken: null,
  }),

  computed: {
    logged: function (): boolean {
      return this.accessToken != null;
    },
    user: function (): IUserData {
      return this.$store.state.users.userData;
    },
  },
  watch: {
    user: {
      handler: function () {
        this.accessToken = localStorage.getItem("access_token");
      },
      immediate: true,
    },
  },
});
</script>

<style></style>
