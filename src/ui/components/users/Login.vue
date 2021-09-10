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
                :error-messages="detailError.detail"
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
                :error-messages="detailError.detail"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col v-if="afterRegister" cols="12">
              <v-alert icon="mdi-email" color="blue-grey" dismissible>
                Registered user successfully. Check the email we sent to
                <strong>{{ userData.email }}</strong> to activate the account.
                <br />Enjoy ALeRCE Watchlist.
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
          <v-row>
            <v-col cols="12">
              <v-btn
                :loading="loading"
                :disabled="loading"
                color="primary"
                class="ma-2 white--text"
                @click="onGoogleClick"
                block
              >
                <v-icon left> mdi-google </v-icon>
                Log in with Google
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="genericError">
            <v-col>
              <generic-error :error="genericError" />
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
import { createNamespacedHelpers } from "vuex";
const userHelper = createNamespacedHelpers("users");
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
    ...userHelper.mapActions([ActionTypes.login, ActionTypes.getGoogleAuthUrl]),
    async onLoginClick() {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        const userInput = {
          username: this.username,
          password: this.password,
        };
        await this.login(userInput);
        this.$emit("loginClick");
      }
    },
    async onGoogleClick() {
      const loginWindow = window.open("", "_self");
      await this.getGoogleAuthUrl(loginWindow);
      this.$emit("loginClick");
    },
  },
  computed: {
    ...userHelper.mapState(["userData", "loading"]),
    ...userHelper.mapGetters(["genericError", "detailError", "errored"]),
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
