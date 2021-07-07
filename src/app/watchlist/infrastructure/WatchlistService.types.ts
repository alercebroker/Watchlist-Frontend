export interface WatchlistRequestModel {
  title: string;
  owner: string;
}

export interface WatchlistApiResult {
  id: number;
  url: string;
  title: string;
  targets: string;
  n_targets: string;
  last_match: string;
}

export interface WatchlistApiResponse {
  count: number;
  next: string;
  previous: string;
  results: WatchlistApiResult[];
}
export interface CreateWatchlistTargetRequest {
  name: string;
  radius: number;
  ra: number;
  dec: number;
}
export interface CreateWatchlistRequestModel {
  title: string;
  targets: CreateWatchlistTargetRequest[];
}

export interface CreateWatchlistApiResponse {
  url: string;
  title: string;
  owner: string;
  targets: CreateWatchlistTargetApiResult[];
}

export interface OneWatchlistApiResponse {
  id: number;
  url: string;
  title: string;
  owner: string;
  targets: string;
  n_targets: string;
  last_match: string;
}

export interface CreateWatchlistTargetApiResult {
  url: string;
  name: string;
  radius: number;
  ra: number;
  dec: number;
  n_matches: number;
}
