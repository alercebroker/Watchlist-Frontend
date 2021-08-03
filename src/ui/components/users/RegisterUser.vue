<template>
  <v-card>
    <v-card-title class="headline">Register New User </v-card-title>
    <generic-error v-if="genericError" :error="genericError" />
    <v-card-text>
      <v-form ref="form">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="username"
                label="Username"
                :error-messages="error.username"
                :loading="apiLoading"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                label="First Name"
                :error-messages="error.name"
                :loading="apiLoading"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="lastName"
                label="Last Name"
                :error-messages="error.last_name"
                :loading="apiLoading"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                label="Email"
                :error-messages="error.email"
                :loading="apiLoading"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="password"
                label="Password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                :error-messages="error.password"
                :loading="apiLoading"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="institution"
                label="Institution"
                :error-messages="error.institution"
                :loading="apiLoading"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="role"
                label="Role"
                :items="roles"
                :error-messages="error.role"
                :loading="apiLoading"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn text @click="dialog = false">Cancel</v-btn>

      <v-btn id="send" color="primary" text @click="onRegisterClick"
        >Send</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { ActionTypes, RegisterInput } from "@/ui/store/user/actions";
import GenericError from "../shared/GenericError.vue";
export default Vue.extend({
  components: { GenericError },
  data() {
    return {
      username: "",
      name: "",
      email: "",
      lastName: "",
      password: "",
      institution: "",
      role: "",
      roles: ["Researcher"],
      showPassword: false,
      registerSent: false,
    };
  },
  computed: {
    apiLoading: function (): boolean {
      return this.$store.state.users.loading;
    },
    error: function (): Record<string, string> | string {
      return this.$store.state.users.error || "";
    },
    genericError: function (): string {
      if (typeof this.$store.state.users.error == "string")
        return this.$store.state.users.error;
      return "";
    },
  },
  watch: {
    apiLoading(val) {
      if (this.error === null && val === false && this.registerSent) {
        this.$emit("registered");
      }
    },
  },
  methods: {
    async onRegisterClick() {
      const form: any = this.$refs.form;
      if (form.validate()) {
        const userInput: RegisterInput = {
          username: this.username,
          name: this.name,
          email: this.email,
          lastName: this.lastName,
          password: this.password,
          institution: this.institution,
          role: this.role,
        };
        await this.$store.dispatch(
          "users/" + ActionTypes.registerUser,
          userInput
        );
        this.registerSent = true;
      }
    },
  },
});
</script>

<style></style>
