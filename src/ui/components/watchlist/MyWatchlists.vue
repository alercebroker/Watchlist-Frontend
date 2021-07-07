<template>
  <v-card height="100%">
    <v-list>
      <v-subheader>My Watchlists</v-subheader>
      <v-list-item-group v-model="watchlist" color="primary" mandatory>
        <v-list-item v-for="(item, i) in watchlists" :key="i">
          <template v-slot:default="{ active }">
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn v-show="active" @click="clickDeleteWatchlist" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list-item-group>
      <v-btn
        @click="clickCreateWatchlist"
        color="primary"
        absolute
        bottom
        right
        fab
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-list>
    <v-dialog v-model="watchlist_dialog" max-width="500">
      <create-watchlist
        @created="watchlist_dialog = false"
        @canceled="watchlist_dialog = false"
      />
    </v-dialog>
    <v-dialog v-model="delete_watchlist_dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">
          Are you sure you want to delete this?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="delete_watchlist_dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="onDeleteClick">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="loading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Loading... please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import CreateWatchlist from "@/ui/components/watchlist/CreateWatchlist.vue";
import { ActionTypes } from "@/ui/store/watchlist/actions";
import { IWatchlistData } from "@/app/watchlist/domain";

export default Vue.extend({
  components: { CreateWatchlist },
  data: () => ({
    selectedItem: 0,
    watchlist_dialog: false,
    delete_watchlist_dialog: false,
  }),
  async mounted() {
    await this.$store.dispatch("watchlists/" + ActionTypes.getAllWatchlists);
  },
  computed: {
    watchlists: function (): IWatchlistData[] {
      return this.$store.state.watchlists.watchlists;
    },
    loading: function (): boolean {
      return (
        this.$store.state.watchlists.loading ||
        this.$store.state.targets.loading
      );
    },
    watchlist: {
      get: function (): number {
        const singleWatchlist = this.$store.state.singleWatchlist;
        const index = this.watchlists
          .map((x: IWatchlistData) => x.url)
          .indexOf(singleWatchlist.url);
        if (index === -1 && this.watchlists.length >= 1) {
          this.$store.dispatch("watchlists/" + ActionTypes.selectWatchlist, 0);
          return 0;
        }
        return index;
      },
      set: function (newWatchlistIndex) {
        this.$store.dispatch(
          "watchlists/" + ActionTypes.selectWatchlist,
          newWatchlistIndex
        );
      },
    },
  },
  methods: {
    clickCreateWatchlist() {
      this.watchlist_dialog = true;
    },
    clickDeleteWatchlist() {
      this.delete_watchlist_dialog = true;
    },
    async onDeleteClick() {
      await this.$store.dispatch("watchlists/" + ActionTypes.deleteWatchlist);
      this.delete_watchlist_dialog = false;
    },
  },
  watch: {
    selectedItem: function (newSelectedItem) {
      this.$store.dispatch(
        "watchlists/" + ActionTypes.selectWatchlist,
        newSelectedItem
      );
    },
  },
});
</script>

<style></style>
