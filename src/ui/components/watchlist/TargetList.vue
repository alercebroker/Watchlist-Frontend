<template>
  <v-card>
    <v-card-title>Targets</v-card-title>
    <v-card-subtitle>
      <v-file-input label="Upload  CSV"></v-file-input>
    </v-card-subtitle>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="targets"
      :search="search"
      v-model="selected"
      show-select
      item-key="name"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          @click="onItemClick(item)"
        >
          mdi-eye
        </v-icon>
      </template>
    </v-data-table>
    {{selected}}
  </v-card>
</template>
<script>
import Vue from "vue";

export default Vue.extend({
  data: () => ({
    selectedItem: 0,
    items: [],
    selected: [],
    search: '',
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      {text: 'Ra', value: 'ra'},
      {text: 'Dec', value: 'dec'},
      {text: 'radius', value: 'radius'},
      {text: 'N matches', value: 'nMatches'},
      {text: '', value: 'actions', sortable: false},
    ],
  }),
  computed: {
    targets() {
      return this.$store.state.targets.targets;
    },
  },
  methods: {

    deleteItem (item) {
      console.log(item);
    },
    onItemClick(item) {
      this.targets.map((x) => {
        console.log(item);
        if (x.name !== item.name.innerText) {
          x.selected = false;
        } else {
          x.selected = true;
        }
      });
    },
  },
});
</script>

<style></style>
