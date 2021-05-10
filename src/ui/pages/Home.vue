<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <my-watchlists />
      </v-col>
      <v-col cols="9">
        <watchlist-details />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from "vue";
import MyWatchlists from "@/ui/components/MyWatchlists";
import WatchlistDetails from "../components/WatchlistDetails.vue";
export default Vue.extend({
  components: { MyWatchlists, WatchlistDetails },
});
</script>

<style></style>
