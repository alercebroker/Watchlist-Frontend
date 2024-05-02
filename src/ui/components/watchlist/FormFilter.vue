<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-autocomplete
          v-model="editedFilter.type"
          label="Condition"
          :items="validValuesToInputItems(validFilters)"
          :rules="[checkValidFilters]"
        ></v-autocomplete>
      </v-col>
      <template v-if="editedFilter.type === 'constant'">
        <v-col cols="12" sm="6" md="4">
          <v-autocomplete
            v-model="editedFilter.params.field"
            label="Field"
            :items="validValuesToInputItems(validFields)"
            :rules="[checkValidFields]"
          ></v-autocomplete>
        </v-col>
      </template>
    </v-row>
    <template v-if="editedFilter.type === 'constant'">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="editedFilter.params.op"
            label="Operation"
            :items="validValuesToInputItems(validOperations)"
            :rules="[checkValidOperations]"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="editedFilter.params.constant"
            label="Value"
            :rules="[checkValidConstant]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-autocomplete
            v-model="editedFilter.band"
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
import Vue, { VueConstructor } from "vue";
import FormMixin from "@/ui/mixins/watchlist/FormMixin";

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof FormMixin>>
).extend({
  name: "FormFilter",
  mixins: [FormMixin],
  props: {
    filterObject: {
      type: Object,
      default: () => ({
        type: "",
        params: {},
        band: 0,
      }),
    },
  },
  data() {
    return {
      confirmDialog: false,
    };
  },
  methods: {
    async checkHandler() {
      if (this.$refs.form) {
        const valid = await (this.$refs.form as any).validate();
        if (valid) {
          this.$emit("on-submit", this.editedFilter);
        }
      }
    },
    sendClose() {
      this.$emit("Close", false);
    },
  },
  watch: {
    filterObject: {
      handler(newValue) {
        this.editedFilter = newValue;
      },
      deep: false,
      immediate: true,
    },
  },
});
</script>

<style></style>
