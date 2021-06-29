<template>
  <v-app-bar app dense>
    <a @click="$router.push('/')">
      <v-img :src="logo" max-width="40px" class="mr-4" />
    </a>
    <v-toolbar-title class="mr-4">
      {{ title }}
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items v-if="items">
      <v-btn
        v-for="item in items"
        :key="item.to"
        :href="item.to"
        class="pl-5 pr-5 d-none d-md-flex text-capitalize"
        target="_blank"
        text
      >
        {{ item.title }}
      </v-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-btn @click="logout"> Logout </v-btn>
  </v-app-bar>
</template>
<script>
import Vue from "vue";

export default Vue.extend({
  props: {
    title: { type: String, required: false, default: "ALeRCE Title" },
    items: { type: Array, required: false, default: () => [] },
  },
  data() {
    return {
      logo_white:
        "https://alerce-static.s3.amazonaws.com/logos/footerAlerceWhite.png",
      logo_blue:
        "https://alerce-static.s3.amazonaws.com/logos/footerAlerce.png",
    };
  },
  computed: {
    logo() {
      if (this.$vuetify.theme.isDark) {
        return this.logo_white;
      } else {
        return this.logo_blue;
      }
    },
  },
  methods: {
    logout() {
      this.$emit("loggedout");
    },
  },
});
</script>

<style scoped>
.v-toolbar {
  flex: 0 0 auto;
}
</style>
