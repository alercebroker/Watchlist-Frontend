export const state = () => ({
  id: -1,
  loading: false,
  url: "",
  n_targets: "",
  last_match: "",
  title: "",
  notification_rate: "",
  error: null as string | null,
  targets: "",
});

export type SingleWatchlistState = ReturnType<typeof state>;
