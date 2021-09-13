<template>
  <v-container fill-height>
    <v-row justify="center" align="center" style="height: 100%">
      <v-col cols="12" sm="8" md="6">
        <login
          @registerClick="registerDialog = true"
          @loginClick="afterRegister = false"
          :afterRegister="afterRegister"
        />
        <v-dialog v-model="registerDialog" max-width="500">
          <register-user
            v-if="registerDialog"
            @registered="registered"
            @registerCancel="registerDialog = false"
          />
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Login from "../components/users/Login.vue";
import RegisterUser from "../components/users/RegisterUser.vue";
export default Vue.extend({
  components: { Login, RegisterUser },
  data: (): {
    registerDialog: boolean;
    accessToken: string | null;
    afterRegister: boolean;
  } => ({
    registerDialog: false,
    accessToken: null,
    afterRegister: false,
  }),

  methods: {
    registered() {
      this.afterRegister = true;
      this.registerDialog = false;
    },
  },
});
</script>

<style></style>
