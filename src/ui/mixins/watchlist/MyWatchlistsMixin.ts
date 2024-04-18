import Vue from "vue";
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
  data: () => ({
    selectedItem: 0,
    watchlist_dialog: false,
    delete_watchlist_dialog: false,
    create_targets_dialog: false,
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
      return this.watchlistLoading;
    },
    watchlist: function (): number {
      const index = this.watchlists
        .map((x: IWatchlistData) => x.url)
        .indexOf(this.selectedWatchlist);
      if (index === -1 && this.watchlists.length >= 1) {
        return 0;
      }
      return index;
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
    clickCreateNewTargets() {
      this.create_targets_dialog = true;
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
    handleBooleanClose(show: boolean){
      this.create_targets_dialog = show;
    },
    onItemClick(index: number) {
      this.selectedItem = index;
    },
  },
  watch: {
    selectedItem: {
      handler: function (newVal) {
        this.selectWatchlist(newVal);
      },
    },
    watchlists: {
      handler: function (newVal) {
        if (newVal.length) this.selectWatchlist(0);
      },
    },
  },
});
