<template>
  <v-container>
    <v-row v-if="!logged" align="center" align-content="center">
      <v-col cols="4">
        <login
          @registerClick="registerDialog = true"
          :afterRegister="afterRegister"
        />
        <v-dialog v-model="registerDialog" max-width="500">
          <register-user @registered="registered" />
        </v-dialog>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col xs="12" lg="3">
        <my-watchlists @createWatchlist="watchlistDialog = true" />
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
//import AHeader from "@/ui/components/watchlist/AHeader.vue";
import { IUserData } from "@/app/user/domain/User.types";

export default Vue.extend({
  components: { MyWatchlists, WatchlistDetails, Login, RegisterUser },
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
