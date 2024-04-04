export interface TargetListApiResponse {
  id: number;
  url: string;
  name: string;
  radius: number;
  ra: number;
  dec: number;
  n_matches: number;
  last_match: string;
  filter: JSON;
}

export interface WatchlistTargetsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TargetListApiResponse[];
}

export interface TargetEditApiResponse {
  id: number;
  name: string;
  radius: number;
  ra: number;
  dec: number;
  filter: JSON;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TargetCreateApiResponse extends TargetEditApiResponse {}
