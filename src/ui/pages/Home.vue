<template>
  <v-container fill-height>
    <a-header title="ALeRCE Watchlist" @loggedout="logout"></a-header>
    <v-row
      v-if="!logged"
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
      token: null,
    };
  },
  mounted(){
    this.token = localStorage.getItem("access_token");
  },
  computed: {
    logged() {

      // if (this.token != null && this.user.username !== "") {
      //     this.log_var = true;
      // }
      console.log(this.user);
      return this.token != null && this.user.username !== "";
    },
    user () {
      return this.$store.state.users.userData;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("access_token");
      // const token = localStorage.getItem("access_token");
      // this.log_var = false;
      this.token = null;
      console.log(this.token)
    },
  },
  watch: {
    user(val) {
      if (val.username != ""){
        this.token = localStorage.getItem("access_token");
      }
      console.log(val);
    } 
  }
});
</script>

<style></style>
