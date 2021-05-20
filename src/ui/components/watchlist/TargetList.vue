<template>
  <v-card>
    <v-card-title>Targets</v-card-title>
    <v-card-subtitle>
      <v-file-input label="Upload  CSV"></v-file-input>
    </v-card-subtitle>
    <v-virtual-scroll :bench="0" :items="targets" height="500" item-height="64">
      <template v-slot:default="{ item }">
        <v-list-item-group v-model="selectedItem" color="primary">
            <v-list-item
              :key="item.name"
              color="primary"
            >
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>

            </v-list-item>
        </v-list-item-group>
      </template>
    </v-virtual-scroll>
    <v-card-text style="height: 10px; position: relative">
      <v-btn color="primary" dark absolute top right fab>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>
<script>
import Vue from "vue";
export default Vue.extend({
  data: () => ({
    selectedItem: 0,
    items: [],
  }),
  mounted() {
    const ret = [];
    for (let i = 1; i < 100; i++) {
      ret.push({ name: "Target" + i, selected: false });
    }
    this.items = ret;
  },
  computed: {
    targets() {
      return this.$store.state.targets.targets;
    },
  },
  methods: {
    onItemClick(item) {
      // console.log(item.target.innerText);
      this.items.map((x) => {
        console.log(x.name !== item.target.innerText);
        if (x.name !== item.target.innerText) {
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
