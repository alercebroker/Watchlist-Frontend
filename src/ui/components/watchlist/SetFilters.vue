<template>
  <v-container>
    <v-card class="mx-auto">
      <v-card-title>Types of filters</v-card-title>
      <v-card-text>
        To set a filter on all targets in a watchlist, it's important to first
        understand the different types of filters available.
      </v-card-text>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >1. Constant: filter by constant magnitude, notifies all alerts
            whose magnitude meets the user's condition, e.g., alert whose
            magnitude is less than a value X given by the
            user.</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >2. No filter: no filter applied to the targets of a watchlist.
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-card-title> Parameters </v-card-title>
      <v-card-text>
        To set a filter on all targets in a watchlist, first are some values to
        know.
      </v-card-text>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >1. Condition: is the type of filter you want to
            apply.</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >2. Property: name of the field to wich the filter is
            applied.</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >3. Operation: is the condition to which the desired field is
            compared, for example, alert whose magnitude is less than or equal
            to a value X.</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >4. Value: is the constant to be compared.</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {};
  },
});
</script>

<style></style>
