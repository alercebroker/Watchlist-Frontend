<template>
  <v-card>
    <v-list>
      <v-subheader>My Watchlists</v-subheader>
      <v-list-item-group v-model="watchlist" color="primary">
        <v-list-item v-for="(item, i) in watchlists" :key="i">
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-btn @click="clickCreateWatchlist" color="primary" absolute bottom right fab>

        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-list>
    <v-dialog v-model="watchlist_dialog" max-width="500">
      <create-watchlist @created="watchlist_dialog = false" @canceled="watchlist_dialog = false"/>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import CreateWatchlist from "@/ui/components/watchlist/CreateWatchlist.vue";
import { ActionTypes } from "@/ui/store/watchlist/actions";
export default Vue.extend({
  components: { CreateWatchlist },
  data: () => ({
    selectedItem: 0,
    watchlist_dialog: false,
  }),
  async mounted() {
    await this.$store.dispatch("watchlists/" + ActionTypes.getAllWatchlists);
  },
  computed: {
    watchlists() {
      return this.$store.state.watchlists.watchlists;
    },
    watchlist: {
      get: function () {
        const singleWatchlist = this.$store.state.singleWatchlist;
        const index = this.watchlists
          .map((x) => x.url)
          .indexOf(singleWatchlist.url);
        if (index === -1 && this.watchlists.length >= 1) {
          this.$store.dispatch("watchlists/" + ActionTypes.selectWatchlist, 0);
          return 0;
        }
        return index;
      },
      set: function (newWatchlistIndex) {
        this.$store.dispatch("watchlists/" + ActionTypes.selectWatchlist, newWatchlistIndex);
      }
    }
  },
  methods: {
    clickCreateWatchlist() {
      this.watchlist_dialog = true;
    },
  },
  watch: {
    selectedItem: function (newSelectedItem){
      this.$store.dispatch("watchlists/" + ActionTypes.selectWatchlist, newSelectedItem);
    }
  }
});
</script>

<style></style>
