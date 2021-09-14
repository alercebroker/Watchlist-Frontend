<template>
  <v-container v-if="loading" fill-height>
    <v-row justify="center" align="center" align-content="center">
      <v-progress-circular :size="300" indeterminate></v-progress-circular>
    </v-row>
    <v-row justify="center"><h3>Logging in...</h3></v-row>
  </v-container>
  <v-alert v-else color="red">Could not login. {{ error }}</v-alert>
</template>

<script lang="ts">
import Vue from "vue";
import { createNamespacedHelpers } from "vuex";
import { ActionTypes } from "../store/user/actions";
const userHelper = createNamespacedHelpers("users");
export default Vue.extend({
  data: (): {
    code: string;
    state: string;
  } => ({
    code: "",
    state: "",
  }),
  mounted() {
    this.code = this.$route.query.code as string;
    this.state = this.$route.query.state as string;
    this.loginGoogle({ code: this.code, state: this.state });
  },
  methods: {
    ...userHelper.mapActions([ActionTypes.loginGoogle]),
  },
  computed: {
    ...userHelper.mapState(["userData", "loading", "error"]),
    logged: function (): boolean {
      return this.userData.accessToken != null;
    },
  },
  watch: {
    logged(newVal) {
      if (newVal) {
        this.$router.push("/");
      }
    },
  },
});
</script>

<style></style>
