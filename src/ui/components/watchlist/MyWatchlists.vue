<template>
  <v-card>
    <v-list>
      <v-subheader>My Watchlists</v-subheader>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item v-for="(item, i) in watchlists" :key="i">
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-btn color="primary" absolute bottom right fab>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { ActionTypes } from "@/ui/store/watchlist/actions";
export default Vue.extend({
  data: () => ({
    selectedItem: 1,
  }),
  async mounted() {
    await this.$store.dispatch("watchlists/" + ActionTypes.getAllWatchlists);
  },
  computed: {
    watchlists() {
      return this.$store.state.watchlists.watchlists;
    },
  },
});
</script>

<style></style>
