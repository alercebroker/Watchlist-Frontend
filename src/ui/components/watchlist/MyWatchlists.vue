<template>
  <v-card height="100%">
    <v-card-title>My Watchlists</v-card-title>
    <v-virtual-scroll
      :items="watchlists"
      item-height="50"
      bench="1"
      :height="$vuetify.breakpoint.height - 250"
    >
      <template v-slot:default="{ item, index }">
        <div
          class="watchlistItem"
          :class="{ selectedItem: index === watchlist }"
        >
          <v-list-item :key="index" @click="onItemClick(index)">
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
          v-if="watchlists.length === index + 1"
          id="hiddenCard"
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
        <v-card-title class="headline"
          >Are you sure you want to delete this?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="delete_watchlist_dialog = false"
            >Cancel</v-btn
          >
          <v-btn color="green darken-1" text @click="onDeleteClick"
            >Confirm</v-btn
          >
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
import Vue, { VueConstructor } from "vue";
import CreateWatchlist from "@/ui/components/watchlist/CreateWatchlist.vue";
import MyWatchlistsMixin from "@/ui/mixins/watchlist/MyWatchlistsMixin";

export default (Vue as VueConstructor<
  Vue & InstanceType<typeof MyWatchlistsMixin>
>).extend({
  components: { CreateWatchlist },
  mixins: [MyWatchlistsMixin],
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
