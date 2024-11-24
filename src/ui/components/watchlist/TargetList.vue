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
    v-model="selected"
    item-key="id"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Targets</v-toolbar-title>
        <v-spacer></v-spacer>

        <button-download-targets />
        <button-bulk-update />
        <v-btn
          color="primary"
          small
          dark
          class="mb-2 mr-1"
          @click="confirmDialog = true"
        >
          Set Filters
        </v-btn>
        <v-dialog v-model="confirmDialog" max-width="500px" persistent>
          <CardFilter @Close="handleClose" />
        </v-dialog>
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
                  <v-col class="d-block">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Target Name"
                      :error-messages="detailError.name"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
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
                </v-row>
                <FormFilter
                  @Close="close"
                  @on-submit="handleFormObject"
                  :filterObject="editedFilter"
                />
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5" style="word-break: break-word"
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
      <v-icon
        :id="'edit' + item.id"
        small
        :disabled="loading"
        class="mr-2"
        @click="editItem(item)"
        >mdi-pencil</v-icon
      >
      <v-icon
        id="deleteButton"
        small
        :disabled="loading"
        class="mr-2"
        @click="deleteItem(item)"
        >mdi-delete</v-icon
      >
      <v-icon
        id="detailsButton"
        small
        :disabled="loading"
        @click="onTargetClick(item)"
        >mdi-eye</v-icon
      >
    </template>
  </v-data-table>
</template>
<script lang="ts">
import {
  ConstantFilterParams,
  WatchlistFilter,
} from "@/app/filter/domain/Filter";
import {
  IConstantFilterParams,
  ILogicFilterParams,
  IWatchlistFilter,
} from "@/app/filter/domain/Filter.types";
import { ITargetData } from "@/app/target/domain/Target.types";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";
import { SingleTargetState } from "@/ui/store/singleTarget/state";
import { ActionTypes as SingleTargetActions } from "@/ui/store/singleTarget/actions";
import { ActionTypes } from "@/ui/store/targets/actions";
import { MutationTypes } from "@/ui/store/targets/mutations";
import { TargetsState } from "@/ui/store/targets/state";
import Vue from "vue";
import { DataOptions } from "vuetify";
import { createNamespacedHelpers } from "vuex";
import GenericError from "../shared/GenericError.vue";
import ButtonBulkUpdate from "./ButtonBulkUpdate.vue";
import ButtonDownloadTargets from "./ButtonDownloadTargets.vue";
import CardFilter from "@/ui/components/watchlist/CardFilter.vue";
import FormFilter from "./FormFilter.vue";

const watchlistHelper = createNamespacedHelpers("singleWatchlist");
const targetsHelper = createNamespacedHelpers("targets");
const singleTargetHelper = createNamespacedHelpers("singleTarget");

export default Vue.extend({
  components: {
    ButtonBulkUpdate,
    GenericError,
    ButtonDownloadTargets,
    CardFilter,
    FormFilter,
  },
  data: () => ({
    search: "",
    singleSelect: true,
    selected: [],
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
      { text: "Actions", value: "actions", sortable: false },
    ],
    tableOptions: {
      itemsPerPage: 10,
    } as DataOptions,
    currentPage: 1,
    editedItem: {
      name: "",
      ra: 0,
      dec: 0,
      radius: 0,
    },
    defaultItem: {
      name: "",
      ra: 0,
      dec: 0,
      radius: 0,
    },
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
    editedIndex: -1,
    dialog: false,
    dialogDelete: false,
    confirmDialog: false,
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
    ...singleTargetHelper.mapState({
      singleTarget(state: SingleTargetState): ITargetData {
        return state.target;
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
  },
  methods: {
    ...targetsHelper.mapActions([
      ActionTypes.getTargets,
      ActionTypes.editTarget,
      ActionTypes.createTarget,
      ActionTypes.deleteTarget,
    ]),
    ...singleTargetHelper.mapActions([SingleTargetActions.selectTarget]),
    ...targetsHelper.mapMutations([MutationTypes.SET_ERROR]),
    onPageUpdate(page: number) {
      if (page > this.currentPage && this.nextPage) {
        this.getTargets({
          params: { url: this.nextPage },
          paginationParams: { page_size: this.tableOptions.itemsPerPage },
        });
      }
    },
    onItemsPerPageUpdate(perPage: number) {
      this.getTargets({
        params: { url: this.targetsUrl },
        paginationParams: { page_size: perPage },
      });
    },
    async save() {
      const filter = this.parseToFilter();
      if (this.editedIndex > -1) {
        await this.editTarget({
          target: {
            ...this.editedItem,
            filter,
            id: this.targets[this.editedIndex].id,
          },
          watchlist: this.watchlistId,
        });
      } else {
        await this.createTarget({
          target: { ...this.editedItem, filter },
          watchlist: this.watchlistId,
        });
      }
      this.close();
    },
    close() {
      this.SET_ERROR(null);
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedFilter = Object.assign({}, this.defaultFilter);
        this.editedIndex = -1;
      });
    },

    editItem(item: ITargetData) {
      this.editedIndex = this.targets.findIndex((t) => t.id === item.id);
      this.editedItem = Object.assign({}, item);
      this.editedFilter = Object.assign({}, this.parseFromFilter(item.filter));
      this.dialog = true;
    },
    deleteItem(item: ITargetData) {
      this.editedIndex = this.targets.findIndex((t) => t.id === item.id);
      this.editedItem = Object.assign({}, item);
      this.editedFilter = Object.assign({}, this.parseFromFilter(item.filter));
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
        this.editedFilter = Object.assign({}, this.defaultFilter);
        this.editedIndex = -1;
      });
    },
    parseToFilter(): IWatchlistFilter {
      let bandParams = new ConstantFilterParams({
        field: "fid",
        constant: this.editedFilter.band,
        op: "eq",
      });
      let type = this.editedFilter.type;
      if (type == "constant") {
        let constantParams = new ConstantFilterParams({
          ...this.editedFilter.params,
          constant: parseFloat(this.editedFilter.params.constant),
        } as IConstantFilterParams);
        return new WatchlistFilter({
          fields: WatchlistFilter.mergeFields([
            constantParams.getFilterFields(),
            bandParams.getFilterFields(),
          ]),
          filters: [
            {
              type: "and",
              params: {
                filters: [
                  { type: "constant", params: constantParams },
                  { type: "constant", params: bandParams },
                ],
              },
            },
          ],
        });
      }

      return {
        fields: {},
        filters: [],
      };
    },
    parseFromFilter(filter: IWatchlistFilter) {
      if (filter.filters.length === 0) {
        return Object.assign({}, this.defaultFilter);
      }
      if (filter.filters[0].type == "and") {
        let logicParams = filter.filters[0].params as ILogicFilterParams;
        let constParams = logicParams.filters[0]
          .params as IConstantFilterParams;
        let bandParams = logicParams.filters[1].params as IConstantFilterParams;
        return {
          type: "constant",
          params: {
            field: constParams.field,
            constant: constParams.constant.toString(),
            op: constParams.op,
          },
          band: bandParams.constant,
        };
      } else if (filter.filters[0].type == "constant") {
        let constParams = filter.filters[0].params as IConstantFilterParams;
        return {
          type: "constant",
          params: {
            field: constParams.field,
            constant: constParams.constant.toString(),
            op: constParams.op,
          },
          band: 1,
        };
      }
      return Object.assign({}, this.defaultFilter);
    },
    handleClose(show: boolean) {
      this.confirmDialog = show;
    },
    handleFormObject(formObject: any) {
      this.editedFilter = Object.assign({}, formObject);
      this.save();
    },
    onTargetClick(newSelection: any) {
      this.selectTarget(newSelection);
      this.$emit("updated", 1);
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
