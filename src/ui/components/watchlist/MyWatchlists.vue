<template>
  <v-card height="100%">
    <v-card-title>My Watchlists</v-card-title>
    <v-virtual-scroll :items="watchlists" height="800" item-height="50">
      <template v-slot:default="{ item, index }">
        <div
          class="watchlistItem"
          :class="{ selectedItem: index === watchlist }"
        >
          <v-list-item :key="item.id" @click="onItemClick(index)">
            <template v-slot:default>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  v-show="index === watchlist"
                  @click="clickDeleteWatchlist"
                  icon
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </div>
        <v-card
          v-if="index === watchlists.length - 1"
          v-intersect="onIntersect"
        ></v-card>
      </template>
    </v-virtual-scroll>
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
import { WatchlistState } from "@/ui/store/watchlist/state";
import { createNamespacedHelpers } from "vuex";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";
import { TargetsState } from "@/ui/store/targets/state";
const watchlistHelper = createNamespacedHelpers("watchlists");
const singleWatchlistHelper = createNamespacedHelpers("singleWatchlist");
const targetsHelper = createNamespacedHelpers("targets");

export default Vue.extend({
  components: { CreateWatchlist },
  data: () => ({
    selectedItem: 0,
    watchlist_dialog: false,
    delete_watchlist_dialog: false,
  }),
  async mounted() {
    await this.getAllWatchlists({});
  },
  computed: {
    ...singleWatchlistHelper.mapState({
      selectedWatchlist: function (state: SingleWatchlistState): string {
        return state.url;
      },
    }),
    ...watchlistHelper.mapState({
      watchlists: function (state: WatchlistState): IWatchlistData[] {
        return state.watchlists;
      },
      watchlistLoading: function (state: WatchlistState): boolean {
        return state.loading;
      },
      nextPage: function (state: WatchlistState): string | null {
        return state.nextPage;
      },
    }),
    ...targetsHelper.mapState({
      targetsLoading: function (state: TargetsState): boolean {
        return state.loading;
      },
    }),
    loading: function (): boolean {
      return this.watchlistLoading || this.targetsLoading;
    },
    watchlist: {
      get: function (): number {
        const index = this.watchlists
          .map((x: IWatchlistData) => x.url)
          .indexOf(this.selectedWatchlist);
        if (index === -1 && this.watchlists.length >= 1) {
          this.selectWatchlist(0);
          return 0;
        }
        return index;
      },
      set: function (newWatchlistIndex) {
        this.selectWatchlist(newWatchlistIndex);
      },
    },
  },
  methods: {
    ...watchlistHelper.mapActions([
      ActionTypes.getAllWatchlists,
      ActionTypes.createWatchlist,
      ActionTypes.deleteWatchlist,
      ActionTypes.selectWatchlist,
    ]),
    clickCreateWatchlist() {
      this.watchlist_dialog = true;
    },
    clickDeleteWatchlist() {
      this.delete_watchlist_dialog = true;
    },
    async onDeleteClick() {
      await this.deleteWatchlist(this.selectedWatchlist);
      this.delete_watchlist_dialog = false;
    },
    async onIntersect(entries: IntersectionObserverEntry[]) {
      if (entries[0].isIntersecting && this.nextPage) {
        await this.getAllWatchlists({ url: this.nextPage, append: true });
      }
    },
    onItemClick(index: number) {
      this.selectWatchlist(index);
    },
  },
  watch: {
    selectedItem: function (newSelectedItem) {
      this.selectWatchlist(newSelectedItem);
    },
  },
});
</script>

<style>
.watchlistItem :hover {
  background-color: grey;
}
.selectedItem {
  background-color: grey;
}
</style>
