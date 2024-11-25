export const mockTargetsByWatchlist = {
  count: 2,
  next: "next",
  previous: "prev",
  results: [
    {
      id: 1,
      url: "test",
      name: "target",
      radius: 1,
      ra: 10,
      dec: 20,
      n_matches: 5,
      filter: {
        fields: {},
        filters: [],
      },
      last_match: new Date(10, 10, 10).toISOString(),
    },
    {
      id: 2,
      url: "test2",
      name: "target2",
      radius: 2,
      ra: 20,
      dec: 20,
      n_matches: 2,
      filter: {
        fields: {},
        filters: [],
      },
      last_match: new Date(10, 10, 10).toISOString(),
    },
  ],
};
