<template>
  <v-app>
    <v-main>
      <a-header title="ALeRCE Watchlist"></a-header>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AHeader from "./components/watchlist/AHeader.vue";

export default Vue.extend({
  name: "App",

  components: {
    AHeader,
  },

  data: () => ({
    //
  }),
});
</script>
