import {
  ConstantOperation,
  IConstantFilterParams,
  IWatchlistSingleFilter,
  IWatchlistFilter,
} from "@/app/filter/domain/Filter.types";

export type Step = "sorting_hat";
const _steps: Step[] = ["sorting_hat"];

export type Field = "mag" | "fid";
const _fieldMapping: Record<Field, Step> = {
  mag: "sorting_hat",
  fid: "sorting_hat",
};

export type FilterFields = Partial<Record<Step, Field[]>>;

export class WatchlistFilter implements IWatchlistFilter {
  fields: FilterFields;
  filters: IWatchlistSingleFilter[];

  constructor(filter: IWatchlistFilter) {
    this.fields = filter.fields;
    this.filters = filter.filters;
  }

  static mergeFields(fieldsList: FilterFields[]): FilterFields {
    const result: FilterFields = {};
    for (let i = 0; i < _steps.length; i++) {
      const fields_set: Set<Field> = new Set();
      fieldsList.forEach((fields) => {
        fields[_steps[i]]!.forEach((field) => fields_set.add(field));
      });
      result[_steps[i]] = Array.from(fields_set);
    }
    return result;
  }
  static mergeMany(filters: IWatchlistFilter[]): WatchlistFilter {
    const result: IWatchlistFilter = { fields: {}, filters: [] };
    result.fields = this.mergeFields(filters.map((filter) => filter.fields));
    filters.forEach((filter) => result.filters.concat(filter.filters));

    return new WatchlistFilter(result);
  }
}

export class ConstantFilterParams implements IConstantFilterParams {
  field: Field;
  constant: number;
  op: ConstantOperation;

  constructor(params: IConstantFilterParams) {
    this.field = params.field;
    this.constant = params.constant;
    this.op = params.op;
  }

  getFilterFields(): FilterFields {
    const fields: FilterFields = {};

    const step = _fieldMapping[this.field];
    if (fields[step] === undefined) fields[step] = [];
    fields[step]!.push(this.field);

    return fields;
  }
}
