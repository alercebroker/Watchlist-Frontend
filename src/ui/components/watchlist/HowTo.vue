<template>
  <v-container>
    <v-card class="mx-auto">
      <v-card-title>How to upload CSV</v-card-title>
      <v-card-text>
        To upload your targets with a CSV, you need to respect some formats.
      </v-card-text>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>1. The header must be: name, ra, dec and radius, all in lower case.</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>2. Ra and dec must be in degrees, radius in arcsec.</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>3. The values of the fields can be separated by the following symbols: comma (,), vertical bar (|), semicolon (;) or tab.</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>4. The table below shows the fields and the accepted values.</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-container>
        <v-data-table
        :headers="headers"
        :items="fields"
        :items-per-page="5"
        class="elevation-1"
        hide-default-footer
        ></v-data-table>
      </v-container>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>5. There is a limit of 5.000 targets per user.</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title><b>6. You can see the example below with a CSV format using comma separation.</b></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-card >
        <v-card-text class="csv text-start">
          <p>name,ra,dec,radius</p>
          <p>target1,200,75,1</p>
          <p>target2,300,-75,0.5</p>
          <p>target3,50,62,1</p>
          <p>target4,55,-10,1</p>
        </v-card-text>
      </v-card>
    </v-card>
  </v-container>
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
          constraints: '[0, 360]',
          default: 'No default',
        },
        {
          name: 'dec',
          required: true,
          type: 'number',
          constraints: '[-90, 90]',
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

<style>
.csv {
  font-family: monospace;
}
</style>