<template>
  <v-container>
    <v-card class="mx-auto">
      <v-card-title>How to upload CSV</v-card-title>
      <v-card-text>
        To upload your targets with a CSV, you need to respect some formats.
      </v-card-text>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >1. The header should include the following columns in lowercase:
            name, ra, dec, radius, and (optionally) filter. For more details,
            please refer to the section "set filters".
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >2. Ra and dec must be in degrees, radius in
            arcsec.</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >3. The filter can be optional, in case of adding the filter column
            the following format must be used in the targets: {'fields': {},
            'filters': []}.
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >4. The values of the fields can be separated by the following
            symbols: comma (,), vertical bar (|), semicolon (;) or
            tab.</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >5. The table below shows the fields and the accepted
            values.</v-list-item-title
          >
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
          <v-list-item-title
            >6. There is a limit of 100.000 targets per user.</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >7. You can see
            <a
              href="https://alerce-static.s3.amazonaws.com/targets_example/target_sample.csv"
            >
              this example</a
            >
            to understand the format.</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            ><b
              >8. You can see the example below with a CSV format using comma
              separation.</b
            ></v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-card>
        <v-card-text class="csv text-start">
          <p>name,ra,dec,radius</p>
          <p>target1,200,75,1</p>
          <p>target2,300,-75,0.5</p>
          <p>target3,50,62,1</p>
          <p>target4,55,-10,1</p>
        </v-card-text>
      </v-card>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >9. Go to Settings tab and select whether you want to disable or
            enable the email notifications and at which
            frequency.</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >10. In the Filters tab, you can see all your targets. Here you can
            modify the properties and conditions of the targets one by
            one.</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >11. In the Overview you can see the details of the
            alerts.</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >12. Note that the first time that you upload a watchlist you need
            to wait 24 h to get net notifications.</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            >Please read this and let us know if you have any modifications.
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data: () => ({
    fields: [
      {
        name: "name",
        required: false,
        type: "string",
        constraints: "Less than 100 letters",
        default: "NoName",
      },
      {
        name: "ra",
        required: true,
        type: "number",
        constraints: "[0, 360]",
        default: "No default",
      },
      {
        name: "dec",
        required: true,
        type: "number",
        constraints: "[-90, 90]",
        default: "No default",
      },
      {
        name: "radius",
        required: true,
        type: "number",
        constraints: "Min value: 0",
        default: "No default",
      },
      {
        name: "filter",
        required: false,
        type: "json",
        constraints: "None",
        default: "No default",
      },
    ],
    headers: [
      {
        text: "Field",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Required", value: "required" },
      { text: "Type", value: "type" },
      { text: "Constraints", value: "constraints" },
      { text: "Default", value: "default" },
    ],
  }),
});
</script>

<style>
.csv {
  font-family: monospace;
}
</style>
