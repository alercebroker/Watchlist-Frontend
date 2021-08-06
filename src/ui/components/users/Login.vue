<template>
  <v-card>
    <v-card-title>Login</v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                id="username"
                v-model="username"
                label="Username"
                :rules="rules"
                :error-messages="errorDetail"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                id="password"
                v-model="password"
                label="Password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                :rules="rules"
                :error-messages="errorDetail"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col v-if="afterRegister" cols="12">
              <v-alert icon="mdi-email" color="blue-grey" dismissible>
                Registered user successfully. Check the email we sent to
                <strong>{{ email }} </strong> to activate the account. <br />
                Enjoy ALeRCE Watchlist.
              </v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-btn
                id="login"
                color="primary"
                block
                @click="onLoginClick"
                :loading="loading"
                >Login</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn
                id="register"
                color="primary"
                block
                @click="$emit('registerClick')"
                :loading="loading"
                >Register</v-btn
              >
            </v-col>
          </v-row>
          <v-row v-if="error">
            <v-col>
              <generic-error :error="error" />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { ActionTypes } from "@/ui/store/user/actions";
import Vue from "vue";
import GenericError from "../shared/GenericError.vue";
export default Vue.extend({
  components: { GenericError },
  props: {
    afterRegister: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      rules: [(v: string) => v.length > 0 || "Field can't be empty"],
    };
  },
  methods: {
    onLoginClick(): void {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        const userInput = {
          username: this.username,
          password: this.password,
        };
        this.$store.dispatch("users/" + ActionTypes.login, userInput);
      }
    },
  },
  computed: {
    errorDetail: function (): string {
      return this.$store.state.users.error?.detail;
    },
    error: function (): string {
      if (typeof this.$store.state.users.error == "object") {
        return "";
      }
      return this.$store.state.users.error;
    },
    loading: function (): boolean {
      return this.$store.state.users.loading;
    },
    email: function (): string {
      return this.afterRegister ? this.$store.state.users.userData.email : "";
    },
  },
});
</script>

<style></style>
