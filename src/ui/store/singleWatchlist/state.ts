export const state = () => ({
  id: -1,
  loading: false,
  url: "",
  n_targets: "",
  last_match: "",
  title: "",
  error: null as string | null,
});

export type SingleWatchlistState = ReturnType<typeof state>;
