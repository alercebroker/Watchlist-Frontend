<template>
  <v-card class="mx-auto">
    <v-card-title>How to upload CSV</v-card-title>
    <v-card-text>
      For upload your targets with a CSV, you need respect some formats.
    </v-card-text>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>1. The header must be: name, ra, dec and radius, all in lower case.</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>2. Ra and dec must be in degrees, radius in arcsec</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>3. The values of the fields must be separated by comas.</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>4. The table below shows the fields and the accepted values.</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-data-table
    :headers="headers"
    :items="fields"
    :items-per-page="5"
    class="elevation-1"
    ></v-data-table>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>5. You can see <a href="https://alerce-static.s3.amazonaws.com/targets_example/target_sample.csv"> this example</a> to understand the format.</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  data: () => ({
      fields: [
        {
          name: 'name',
          required: false,
          type: 'string',
          constraints: 'Less than 100 letters',
          default: 'NoName',
        },
        {
          name: 'ra',
          required: true,
          type: 'number',
          constraints: [0, 360],
          default: 'No default',
        },
        {
          name: 'dec',
          required: true,
          type: 'number',
          constraints: [-90, 90],
          default: 'No default',
        },
        {
          name: 'radius',
          required: true,
          type: 'number',
          constraints: 'Min value: 0',
          default: 'No default',
        },
      ],
      headers: [
        {
          text: 'Field',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Required', value: 'required' },
        { text: 'Type', value: 'type' },
        { text: 'Constraints', value: 'constraints' },
        { text: 'Default', value: 'default' },
      ],
    }),
});
</script>

<style></style>