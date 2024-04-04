export interface WatchlistFilter {
  fields: Record<string, string[]>;
  filters: {
    type: string;
    params: FilterParams;
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FilterParams {}

export interface ConstantFilterParams extends FilterParams {
  field: string;
  constant: number;
  op: "less" | "less eq" | "greater" | "greater eq";
}
