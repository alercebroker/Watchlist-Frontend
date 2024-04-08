<template>
  <v-data-table
    :server-items-length="targetCount"
    :headers="headers"
    :items="targets"
    :search="search"
    :loading="loading"
    @update:page="onPageUpdate"
    @update:items-per-page="onItemsPerPageUpdate"
    :options.sync="tableOptions"
    item-key="id"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Targets</v-toolbar-title>
        <v-spacer></v-spacer>

        <button-download-targets />
        <button-bulk-update />
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              id="createBtn"
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
              small
            >
              <v-icon left> mdi-plus </v-icon>
              New Target
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <generic-error v-if="genericError" :error="genericError" />
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Target Name"
                      :error-messages="detailError.name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.ra"
                      label="ra"
                      type="number"
                      :error-messages="detailError.ra"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.dec"
                      label="dec"
                      type="number"
                      :error-messages="detailError.dec"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.radius"
                      label="radius"
                      :error-messages="detailError.radius"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="editedFilters.type"
                      label="Filter"
                      :items="[
                        { text: 'Constant', value: 'constant' },
                        { text: 'Difference', value: 'difference' },
                      ]"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row v-if="editedFilters.type === 'constant'">
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      label="constant"
                      v-model="editedParams.constant"
                      :rules=[magnitudIsValid]
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      label="Operation"
                      :items="['less', 'less eq', 'greater', 'greater eq']"
                      v-model="editedParams.op"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn id="saveButton" color="blue darken-1" text @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this target?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                id="deleteCancel"
                color="blue darken-1"
                text
                @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn
                id="deleteConfirm"
                color="blue darken-1"
                text
                @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon :id="'edit' + item.id" small class="mr-2" @click="editItem(item)"
        >mdi-pencil</v-icon
      >
      <v-icon id="deleteButton" small @click="deleteItem(item)"
        >mdi-delete</v-icon
      >
    </template>
  </v-data-table>
</template>
<script lang="ts">
import { ITargetData, ITargetDisplay } from "@/app/target/domain/Target.types";
import { FilterParams, WatchlistFilter } from "@/shared/types/filter.types";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";
import {
  ActionTypes,
  CreateTargetPayload,
  EditTargetPayload,
} from "@/ui/store/targets/actions";
import { MutationTypes } from "@/ui/store/targets/mutations";
import { TargetsState } from "@/ui/store/targets/state";
import Vue from "vue";
import { DataOptions } from "vuetify";
import { createNamespacedHelpers } from "vuex";
import GenericError from "../shared/GenericError.vue";
import ButtonBulkUpdate from "./ButtonBulkUpdate.vue";
import ButtonDownloadTargets from "./ButtonDownloadTargets.vue";

const watchlistHelper = createNamespacedHelpers("singleWatchlist");
const targetsHelper = createNamespacedHelpers("targets");

export default Vue.extend({
  components: { ButtonBulkUpdate, GenericError, ButtonDownloadTargets },
  data: () => ({
    operation_value: "",
    search: "",
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Ra", value: "ra", sortable: false },
      { text: "Dec", value: "dec", sortable: false },
      { text: "radius", value: "radius", sortable: false },
      { text: "N matches", value: "nMatches", sortable: false },
      {
        text: "Filters",
        key: "filter",
        value: "filter.filters[0].type",
        sortable: false,
      },
      { text: "Actions", value: "actions", sortable: false },
    ],
    tableOptions: {} as DataOptions,
    currentPage: 1,
    editedItem: {
      name: "",
      ra: 0,
      dec: 0,
      radius: 0,
      filter: {} as WatchlistFilter,
    },
    editedFilters: {
      type: "",
      params: {} as FilterParams,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editedParams: {} as any,
    defaultItem: {
      name: "",
      ra: 0,
      dec: 0,
      radius: 0,
      filter: {
        fields: {},
        filters: [],
      } as WatchlistFilter,
    },
    editedIndex: -1,
    dialog: false,
    dialogDelete: false,
  }),
  mounted() {
    this.getTargets({
      params: { url: this.targetsUrl },
      paginationParams: { page_size: this.tableOptions.itemsPerPage },
    });
  },
  computed: {
    ...watchlistHelper.mapState({
      watchlistId(state: SingleWatchlistState): number {
        return state.id;
      },
      targetsUrl(state: SingleWatchlistState): string {
        return state.targets;
      },
    }),
    ...targetsHelper.mapState({
      targets(state: TargetsState): ITargetData[] {
        return state.targets;
      },
      targetCount(state: TargetsState): number {
        return state.count;
      },
      nextPage(state: TargetsState): string | null {
        return state.nextPage;
      },
      prevPage(state: TargetsState): string | null {
        return state.prevPage;
      },
      loading(state: TargetsState): boolean {
        return state.loading;
      },
    }),
    ...targetsHelper.mapGetters(["genericError", "detailError", "errored"]),
    formTitle(): string {
      return this.editedIndex === -1 ? "New Target" : "Edit Target";
    },
    displayTarget(): ITargetDisplay[] {
      return this.targets.map((target) => ({
        ...target,
        filter_str: target.filter.filters
          .map((filter) => filter.type)
          .join("\n"),
      }));
    },
    magnitudIsValid() {
      if (Number(this.editedParams.constant)) {
        return true;
      } else {
        return "Must be a number";
      }
    },
    filterIsValid() {
      if (
        this.editedFilters.type == "constant" ||
        this.editedFilters.type == "difference"
      ) {
        return true;
      } else {
        return false;
      }
    },
    operationIsValid() {
      if (
        this.operation_value == "less" ||
        this.operation_value == "less eq" ||
        this.operation_value == "greater" ||
        this.operation_value == "greater eq"
      ){
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...targetsHelper.mapActions([
      ActionTypes.getTargets,
      ActionTypes.editTarget,
      ActionTypes.createTarget,
      ActionTypes.deleteTarget,
    ]),
    ...targetsHelper.mapMutations([MutationTypes.SET_ERROR]),
    onPageUpdate(page: number) {
      if (page > this.currentPage && this.nextPage) {
        this.getTargets({
          params: { url: this.nextPage },
          paginationParams: { page_size: this.tableOptions.itemsPerPage },
        });
      }
    },
    setFilterValuesDefault() {
      this.operation_value = "";
      this.editedFilters.type = "";
      this.editedParams.constant = "";
    },
    onItemsPerPageUpdate(perPage: number) {
      this.getTargets({
        params: { url: this.targetsUrl },
        paginationParams: { page_size: perPage },
      });
    },
    async save() {
      // TODO: Do validation
      if (this.editedIndex > -1) {
        const payload: EditTargetPayload = {
          target: { ...this.editedItem, id: this.targets[this.editedIndex].id },
          watchlist: this.watchlistId,
        };
        await this.editTarget(payload);
      } else {
        const payload: CreateTargetPayload = {
          target: this.editedItem,
          watchlist: this.watchlistId,
        };

        if (this.magnitudIsValid && this.filterIsValid && this.verifyFilter()) {
          await this.createTarget(payload);
          this.setFilterValuesDefault();
        } else {
          this.setFilterValuesDefault();
        }
      }
      if (!this.errored) this.close();
    },

    close() {
      this.SET_ERROR(null);
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.setFilterValuesDefault();
      });
    },

    editItem(item: ITargetData) {
      this.editedIndex = this.targets.findIndex((t) => t.id === item.id);
      this.editedItem = Object.assign({}, item);
      this.editedFilters = item.filter.filters[0];
      this.editedParams = item.filter.filters[0].params;
      this.dialog = true;
    },
    deleteItem(item: ITargetData) {
      this.editedIndex = this.targets.findIndex((t) => t.id === item.id);
      this.editedItem = Object.assign({}, item);
      this.editedFilters = item.filter.filters[0];
      this.editedParams = item.filter.filters[0].params;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      const payload = {
        target: this.targets[this.editedIndex].id,
        watchlist: this.watchlistId,
      };
      this.deleteTarget(payload);
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    verifyFilter() {
      let save_json = {} as WatchlistFilter;

      if (this.editedFilters.type == "constant") {
        save_json = {
          fields: {
            sorting_hat: ["mag"],
          },
          filters: [
            {
              type: this.editedFilters.type,
              params: {
                field: "mag",
                constant: Number(this.editedParams.constant),
                op: this.editedParams.op,
              },
            },
          ],
        };
        this.editedItem.filter = save_json;
        return true;
      }
      return false;

      //unir los datos en el json y mandarlos
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
});
</script>

<style></style>
