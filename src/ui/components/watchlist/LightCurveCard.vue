<template>
  <v-card :loading="loading">
    <v-card-text>
      <div id="lightcurve-app" class="tw-dark"></div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import htmx from "htmx.org";

export default Vue.extend({
  props: {
    ObjectId: {
      type: String,
      default: () => "",
    },
    loading: Boolean,
  },
  data() {
    return {
      objectName: "",
    };
  },
  methods: {
    callLightCurve() {
      htmx
        .ajax(
          "GET",
          `https://api.alerce.online/v2/lightcurve/htmx/lightcurve?oid=${this.ObjectId}`,
          {
            target: "#lightcurve-app",
            swap: "innerHTML",
          }
        )
        .then(() => {
          this.$emit("loadComplete", false);
        });
    },
  },
  watch: {
    ObjectId() {
      this.callLightCurve();
    },
  },
});
</script>

<style></style>
