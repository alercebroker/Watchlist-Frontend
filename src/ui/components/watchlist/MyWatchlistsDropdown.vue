<template>
  <v-card height="100%">
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="8">
          <v-select
            :value="
              watchlists.length > 0 ? watchlists[selectedItem].title : null
            "
            :items="watchlists.map((watchlist) => watchlist.title)"
            @change="updateSelectedItem"
            label="My Watchlists"
          >
            <template v-slot:append-item>
              <v-card v-intersect="onIntersect"></v-card>
            </template>
          </v-select>
        </v-col>
        <v-col cols="6" sm="1">
          <v-btn icon fab outlined @click="clickCreateWatchlist">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="6" sm="1">
          <v-btn icon fab outlined color="red" @click="clickDeleteWatchlist">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="6" sm="1">
          <v-btn icon fab outlined color="blue" @click="clickCreateNewTargets">
            <v-icon>mdi-loupe</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-dialog v-model="watchlist_dialog" max-width="500">
      <create-watchlist
        @created="watchlist_dialog = false"
        @canceled="watchlist_dialog = false"
      />
    </v-dialog>
    <v-dialog v-model="create_targets_dialog" max-width="500px">
      <FormFilter @booleanClose="handleBooleanClose" />
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
import FormFilter from "./FormFilter.vue";
import MyWatchlistsMixin from "@/ui/mixins/watchlist/MyWatchlistsMixin";
import { IWatchlistData } from "@/app/watchlist/domain";

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof MyWatchlistsMixin>>
).extend({
  components: { CreateWatchlist, FormFilter },
  mixins: [MyWatchlistsMixin],
  methods: {
    updateSelectedItem(itemTitle: string) {
      this.$data.selectedItem = this.watchlists.findIndex(
        (w: IWatchlistData) => w.title === itemTitle
      );
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
