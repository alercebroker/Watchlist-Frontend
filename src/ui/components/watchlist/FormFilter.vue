<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-autocomplete
          v-model="itemFilter.type"
          label="Condition"
          :items="validValuesToInputItems(validFilters)"
          :rules="[checkValidFilters]"
        ></v-autocomplete>
      </v-col>
      <template v-if="itemFilter.type === 'constant'">
        <v-col cols="12" sm="6" md="4">
          <v-autocomplete
            v-model="itemFilter.params.field"
            label="Property"
            :items="validValuesToInputItems(validFields)"
            :rules="[checkValidFields]"
          ></v-autocomplete>
        </v-col>
      </template>
    </v-row>
    <template v-if="itemFilter.type === 'constant'">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="itemFilter.params.op"
            label="Operation"
            :items="validValuesToInputItems(validOperations)"
            :rules="[checkValidOperations]"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="itemFilter.params.constant"
            label="Value"
            :rules="[checkValidConstant]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-autocomplete
            v-model="itemFilter.band"
            label="Band"
            :items="validValuesToInputItems(validBands)"
            :rules="[checkValidBands]"
          ></v-autocomplete>
        </v-col>
      </v-row>
    </template>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="sendClose"> Cancel </v-btn>
      <v-btn id="saveButton" color="blue darken-1" text @click="checkHandler">
        Save
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script lang="ts">
import { IConstantFilterParams } from "@/app/filter/domain/Filter.types";
import { defineComponent } from "vue";
import type { PropType } from "vue";

interface filterData {
  type: string;
  params: any;
  band: number;
}

export default defineComponent({
  name: "FormFilter",
  props: {
    filterObject: {
      type: Object as PropType<filterData>,
      default: function () {
        return {
          type: "",
          params: {
            field: "",
            constant: "",
            op: "",
          },
          band: 0,
        };
      },
    },
  },
  data() {
    return {
      confirmDialog: false,
      itemFilter: {
        type: "",
        params: {
          field: "",
          constant: "",
          op: "",
        },
        band: 0,
      },
      resetItemFilter: {
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
    async checkHandler() {
      if (this.$refs.form) {
        const valid = await (this.$refs.form as any).validate();
        if (valid) {
          this.$emit("on-submit", this.itemFilter);
          this.resetParams();
        }
      }
    },
    sendClose() {
      this.$emit("Close", false);
      this.resetParams();
    },
    resetParams() {
      this.itemFilter = Object.assign({}, this.resetItemFilter);
    },
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
      const field: string = this.itemFilter.params.field;
      if (Object.keys(this.validFields).includes(field)) {
        return true;
      } else {
        return "The field must be one of the options shown";
      }
    },
    checkValidBands() {
      const rValidBands = this.rValid(this.validBands);
      const band = this.itemFilter.band;
      if (rValidBands[band]) {
        return true;
      } else {
        return "The band must be one of the options shown";
      }
    },
    checkValidOperations() {
      const rValidOperations = this.rValid(this.validOperations);
      const op = this.itemFilter.params.op;
      if (rValidOperations[op]) {
        return true;
      } else {
        return "The operation must be one of the options shown";
      }
    },
    checkValidConstant() {
      const params = this.itemFilter.params as unknown as IConstantFilterParams;
      if (!isNaN(params.constant)) {
        if (params.constant != 0) {
          return true;
        } else {
          return "It must be different of 0"; 
        }
      } else {
        return "The constant must be a number";
      }
    },
    checkValidFilters() {
      const rValidFilters = this.rValid(this.validFilters);
      const filter = (this.itemFilter as filterData).type;
      if (rValidFilters[filter]) {
        return true;
      } else {
        return "The filter must be one of the options shown";
      }
    },
  },
  watch: {
    filterObject: {
      handler(newVal) {
        this.itemFilter = JSON.parse(JSON.stringify(newVal));
      },
      immediate: true,
    },
  },
});
</script>

<style></style>
