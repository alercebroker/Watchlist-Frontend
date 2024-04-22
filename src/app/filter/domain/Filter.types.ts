import { Field, FilterFields } from "./Filter";

export type FilterType = "constant" | "and" | "or" | "";

export interface IWatchilstSingleFilter {
  type: FilterType;
  params: IFilterParams;
}

export interface IWatchlistFilter {
  fields: FilterFields;
  filters: IWatchilstSingleFilter[];
}

export type ConstantOperation =
  | "eq"
  | "less"
  | "less eq"
  | "greater"
  | "greater eq";

export interface IConstantFilterParams extends IFilterParams {
  field: Field;
  constant: number;
  op: ConstantOperation;
}

export interface ILogicFilterParams extends IFilterParams {
  filters: IWatchilstSingleFilter[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFilterParams {}
