<template>
  <v-container fill-height>
    <a-header title="ALeRCE Watchlist" @loggedout="logout"></a-header>
    {{logged}}
    <v-row
      v-if="!log_var"
      align="center"
      align-content="center"
      justify="center"
    >
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

export default Vue.extend({
  components: { AHeader, MyWatchlists, WatchlistDetails, Login, RegisterUser },
  data() {
    return {
      dialog: false,
      watchlist_dialog: false,
      log_var: false,
    };
  },
  computed: {
    logged() {
      const token = localStorage.getItem("access_token");
      const user = this.$store.state.users.userData;
      if (token != null && user.username !== "") {
          this.log_var = true;
      }
      return token != null && user.username !== "";
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("access_token");
      const token = localStorage.getItem("access_token");
      this.log_var = false;
      console.log(token)
    },
  },
});
</script>

<style></style>
