<template>
  <v-card>
    <v-list>
      <v-subheader>My Watchlists</v-subheader>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-btn color="primary" absolute bottom right fab>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-list>
  </v-card>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  data: () => ({
    selectedItem: 1,
    items: [
      { text: "All SN" },
      { text: "Galaxy 123" },
      { text: "Camilo's Targets" },
    ],
  }),
});
</script>

<style></style>
