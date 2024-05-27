<template>
  <v-card :loading="loading">
    <v-card-text>
      <div id="lightcurve-app" class="theme--dark"></div>
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
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      objectName: "",
    };
  },
  methods: {
    callLightCurve() {
      /**
      const url = `https://api.alerce.online/v2/lightcurve/htmx/lightcurve?oid=${this.ObjectId}`;
      const myDiv = document.getElementById('lightcurve-app')
      if (myDiv) {
        myDiv.innerHTML = `<div hx-get=${url} hx-trigger="updateLightcurve from:body" hx-swap="outerHTML"></div>`
        htmx.process(myDiv)
        document.body.dispatchEvent(new Event('updateLightcurve'))
      }
      */
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
