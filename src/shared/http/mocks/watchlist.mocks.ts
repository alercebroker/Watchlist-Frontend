import { WatchlistApiResponse } from "@/app/watchlist/infrastructure/WatchlistService.types";

export const mockApiWatchlists: WatchlistApiResponse = {
  count: 2,
  next: "watchlist/?page=1",
  previous: "",
  results: [
    {
      url: "watchlist/1",
      title: "Test1",
      targets: "watchlist/1/targets",
    },
    {
      url: "watchlist/2",
      title: "Test2",
      targets: "watchlist/2/targets",
    },
  ],
};
