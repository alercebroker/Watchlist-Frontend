export interface TargetRequestModel {}

export interface TargetListApiResponse {
  url: string;
  name: string;
  radius: number;
  ra: number;
  dec: number;
  n_matches: number;
}

export interface WatchlistTargetsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TargetListApiResponse[];
}
