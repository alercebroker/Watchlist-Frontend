<template>
  <v-card>
    <v-card-title class="headline">Register New User</v-card-title>
    <generic-error v-if="genericError" :error="genericError" />
    <v-card-text>
      <v-form ref="form">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="username"
                label="Username"
                :error-messages="detailError.username"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                label="First Name"
                :error-messages="detailError.name"
                :loading="loading"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="lastName"
                label="Last Name"
                :error-messages="detailError.last_name"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                label="Email"
                :error-messages="detailError.email"
                :loading="loading"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="password"
                label="Password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                :error-messages="detailError.password"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="institution"
                label="Institution"
                :error-messages="detailError.institution"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="role"
                label="Role"
                :items="roles"
                :error-messages="detailError.role"
                :loading="loading"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn text @click="$emit('registerCancel')">Cancel</v-btn>

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
import { createNamespacedHelpers } from "vuex";
const userHelper = createNamespacedHelpers("users");
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
    ...userHelper.mapGetters(["genericError", "detailError", "errored"]),
    ...userHelper.mapState(["loading", "userData"]),
  },
  watch: {
    userData(val) {
      if (!this.errored && val != null && this.registerSent) {
        this.$emit("registered");
      }
    },
  },
  methods: {
    ...userHelper.mapActions([ActionTypes.registerUser]),
    async onRegisterClick() {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        const userInput: RegisterInput = {
          username: this.username,
          name: this.name,
          email: this.email,
          lastName: this.lastName,
          password: this.password,
          institution: this.institution,
          role: this.role,
        };
        await this.registerUser(userInput);
        this.registerSent = true;
      }
    },
  },
});
</script>

<style></style>
