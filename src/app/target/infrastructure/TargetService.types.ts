export interface TargetRequestModel {}

export interface TargetListApiResponse {
  id: number;
  url: string;
  name: string;
  radius: number;
  ra: number;
  dec: number;
  n_matches: number;
  last_match: string;
}

export interface WatchlistTargetsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TargetListApiResponse[];
}
