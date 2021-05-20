import {
  CreateWatchlistApiResponse,
  CreateWatchlistRequestModel,
  OneWatchlistApiResponse,
  WatchlistApiResponse
} from "@/app/watchlist/infrastructure/WatchlistService.types";

export const mockApiWatchlists: WatchlistApiResponse = {
  count: 2,
  next: "watchlist/?page=1",
  previous: "",
  results: [
    {
      url: "watchlist/1",
      title: "Test1",
      targets: "test",
      n_targets: "test",
      last_match: "test"
    },
    {
      url: "watchlist/2",
      title: "Test2",
      targets: "test",
      n_targets: "test",
      last_match: "test"
    },
  ],
};

export const mockCreateWatchlistRequestModel: CreateWatchlistRequestModel = {
  title: "title",
  targets: [
    {
      name: "target",
      radius: 1.0,
      ra: 1.0,
      dec: 1.0,
    },
  ]
}

export const mockCreateWatchlistResponse: CreateWatchlistApiResponse = {
  url: "watchlist/3",
  title: "title",
  owner: "owner",
  targets: [
    {
      url: "test",
      name: "target",
      radius: 1.0,
      ra: 1.0,
      dec: 1.0,
      n_matches: 1,
    }
  ]
}

export const mockSingleWatchlist: OneWatchlistApiResponse = {
  url: "watchlist/1",
  title: "title",
  owner: "owner",
  targets: "watchlist/1/targets",
  n_targets: "test",
  last_match: "test",
}
