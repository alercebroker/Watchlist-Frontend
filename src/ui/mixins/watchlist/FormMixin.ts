import Vue from "vue";
import { IConstantFilterParams } from "@/app/filter/domain/Filter.types";

export default Vue.extend({
  data: () => {
    return {
      editedFilter: {
        type: "",
        params: {
          field: "",
          constant: "",
          op: "",
        },
        band: 0,
      },
      defaultFilter: {
        type: "",
        params: {
          field: "",
          constant: "",
          op: "",
        },
        band: 0,
      },
      validBands: {
        g: 1,
        r: 2,
        i: 3,
      },
      validOperations: {
        Equal: "eq",
        "Less than": "less",
        "Less than or equal": "less eq",
        "Greater than": "greater",
        "Greater than or equal": "greater eq",
      },
      validFields: {
        mag: "mag",
      },
      validFilters: {
        Constant: "constant",
        "No filter": "",
      },
    };
  },
  methods: {
    rValid<T extends string | number>(validValues: Record<string, T>) {
      return Object.fromEntries(
        Object.entries(validValues).map(([text, value]) => [value, text])
      ) as Record<T, string>;
    },
    validValuesToInputItems<T extends string | number>(
      validValues: Record<string, T>
    ) {
      return Object.entries(validValues).map(([text, value]) => ({
        text,
        value,
      }));
    },
    checkValidFields() {
      const field: string = this.editedFilter.params.field;
      if (Object.keys(this.validFields).includes(field)) {
        return true;
      } else {
        return "The field must be one of the options shown";
      }
    },
    checkValidBands() {
      const rValidBands = this.rValid(this.validBands);
      const band = this.editedFilter.band;
      if (rValidBands[band]) {
        return true;
      } else {
        return "The band must be one of the options shown";
      }
    },
    checkValidOperations() {
      const rValidOperations = this.rValid(this.validOperations);
      const op = this.editedFilter.params.op;
      if (rValidOperations[op]) {
        return true;
      } else {
        return "The operation must be one of the options shown";
      }
    },
    checkValidConstant() {
      const params = this.editedFilter
        .params as unknown as IConstantFilterParams;
      if (!isNaN(params.constant)) {
        if (params.constant != 0) {
          return true;
        } else {
          return "It must be diffent of 0";
        }
      } else {
        return "The constant must be a number";
      }
    },
    checkValidFilters() {
      const rValidFilters = this.rValid(this.validFilters);
      const filter = this.editedFilter.type;
      if (rValidFilters[filter]) {
        return true;
      } else {
        return "The filter must be one of the options shown";
      }
    }
  },
});
