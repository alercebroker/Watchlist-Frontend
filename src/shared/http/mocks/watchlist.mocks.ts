import {
  CreateWatchlistApiResponse,
  CreateWatchlistRequestModel,
  OneWatchlistApiResponse,
  WatchlistApiResponse,
} from "@/app/watchlist/infrastructure/WatchlistService.types";

export const mockApiWatchlists: WatchlistApiResponse = {
  count: 2,
  next: "watchlists/?page=1",
  previous: "",
  results: [
    {
      id: 1,
      url: "watchlists/1",
      title: "Test1",
      notification_rate: "hourly",
      last_notified: "date",
      targets: "test",
      n_targets: "test",
      last_match: "test",
    },
    {
      id: 2,
      url: "watchlists/2",
      title: "Test2",
      notification_rate: "hourly",
      last_notified: "date",
      targets: "test",
      n_targets: "test",
      last_match: "test",
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
  ],
};

export const mockCreateWatchlistResponse: CreateWatchlistApiResponse = {
  url: "watchlists/3",
  title: "title",
  notification_rate: "hourly",
  owner: "owner",
  targets: [
    {
      url: "test",
      name: "target",
      radius: 1.0,
      ra: 1.0,
      dec: 1.0,
      n_matches: 1,
    },
  ],
};

export const mockSingleWatchlist: OneWatchlistApiResponse = {
  id: 1,
  url: "watchlists/1",
  title: "title",
  notification_rate: "hourly",
  last_notified: "date",
  owner: "owner",
  targets: "watchlists/1/targets",
  n_targets: "test",
  last_match: "test",
};
