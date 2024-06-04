<template>
  <v-card>
    <v-card v-if="loading">
      <v-card-text class="d-flex justify-center align-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-card-text>
    </v-card>
    <v-card id="lightcurve-app" width="100%" :height="height"></v-card>
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
    },
  },
  data() {
    return {
      objectName: "",
      themeDark: false,
      height: "0vh",
    };
  },
  mounted() {
    this.$el.addEventListener("htmx:afterRequest", (event) => {
      const CustomEvent = event as CustomEvent;
      if (CustomEvent.detail.successful) {
        this.height = "100%";
        this.onIsDarkChange(this.isDark());
      }
    });
  },
  methods: {
    async callLightCurve(oid: string) {
      const url = `https://api.alerce.online/v2/lightcurve/htmx/lightcurve?oid=${oid}`;
      
      const myDiv = document.getElementById("lightcurve-app");
      if (myDiv) {
        myDiv.innerHTML = `<div hx-get=${url} hx-trigger="updateLightcurve from:body" hx-swap="outerHTML"></div>`;
        htmx.process(myDiv);
        document.body.dispatchEvent(new Event("updateLightcurve"));
        this.$emit("loadComplete", false);
      }
    },
    isDark() {
      return this.$vuetify.theme.dark;
    },
    onIsDarkChange(newIsDark: boolean) {
      const container = document.getElementById("lightcurve-app");
      if (container) {
        if (newIsDark) {
          container.classList.add("tw-dark");
        }
      }
    },
  },
  watch: {
    ObjectId() {
      this.callLightCurve(this.ObjectId);
    },
  },
});
</script>

<style></style>
