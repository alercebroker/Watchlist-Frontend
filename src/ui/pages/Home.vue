<template>
  <v-container v-if="!logged">
    <v-row align="center" align-content="center">
      <v-col cols="4">
        <login
          @registerClick="registerDialog = true"
          :afterRegister="afterRegister"
        />
        <v-dialog v-model="registerDialog" max-width="500">
          <register-user
            @registered="registered"
            @registerCancel="registerDialog = false"
          />
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
  <main-layout v-else>
    <template v-slot:left>
      <my-watchlists @createWatchlist="watchlistDialog = true" />
    </template>
    <template v-slot:top>
      <my-watchlists-dropdown @createWatchlist="watchlistDialog = true" />
    </template>
    <template v-slot:right>
      <watchlist-details />
    </template>
  </main-layout>
</template>

<script lang="ts">
import Vue from "vue";
import MyWatchlists from "@/ui/components/watchlist/MyWatchlists.vue";
import WatchlistDetails from "../components/watchlist/WatchlistDetails.vue";
import Login from "../components/users/Login.vue";
import RegisterUser from "../components/users/RegisterUser.vue";
import { IUserData } from "@/app/user/domain/User.types";
import MainLayout from "../layouts/MainLayout.vue";
import MyWatchlistsDropdown from "../components/watchlist/MyWatchlistsDropdown.vue";

export default Vue.extend({
  components: {
    MyWatchlists,
    WatchlistDetails,
    Login,
    RegisterUser,
    MainLayout,
    MyWatchlistsDropdown,
  },
  data: (): {
    registerDialog: boolean;
    watchlistDialog: boolean;
    accessToken: string | null;
    afterRegister: boolean;
  } => ({
    registerDialog: false,
    watchlistDialog: false,
    accessToken: null,
    afterRegister: false,
  }),
  methods: {
    registered() {
      this.afterRegister = true;
      this.registerDialog = false;
    },
  },
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
