export const state = (): SingleWatchlistState => ({
  id: -1,
  loading: false,
  url: "",
  n_targets: "",
  last_match: "",
  title: "",
  notification_rate: "disabled",
  error: null as string | null,
  targets: "",
});

export type SingleWatchlistState = {
  id: number;
  loading: boolean;
  url: string;
  n_targets: string;
  last_match: string;
  title: string;
  notification_rate: string;
  error: string | null;
  targets: string;
};
