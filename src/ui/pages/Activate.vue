<template>
  <v-container fill-height>
    {{ error }}
    <activate-card
      :message="selected.message"
      :icon="selected.icon"
      :spinner="selected.spinner"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ActivateCard from "@/ui/components/users/ActivateCard.vue";
import { createNamespacedHelpers } from "vuex";
import { UserState } from "../store/user/state";
import { ActionTypes, ActivateInput } from "@/ui/store/user/actions";
import { isHttpError } from "@/shared/http";

const userHelper = createNamespacedHelpers("users");

export default Vue.extend({
  components: { ActivateCard },
  props: {
    id: {
      type: String || null,
      default: null,
    },
    token: {
      type: String || null,
      default: null,
    },
  },

  mounted() {
    console.log("send activation", this.id, this.token);
    const input: ActivateInput = { uid: this.id, token: this.token };
    this.activate(input);
  },
  methods: {
    ...userHelper.mapActions([ActionTypes.activate]),
  },
  computed: {
    messages: function (): any {
      return {
        0: {
          message: "Activating your account please wait...",
          spinner: true,
        },
        1: {
          message: "Invalid parameters, please retry... ",
          icon: "mdi-account-question",
        },
        204: {
          message:
            'Your account is activated. You may close this window and login. Or click <a href="/">here</a>.',
          icon: "mdi-account-check",
        },
        403: {
          message: "This account is already active",
          icon: "mdi-account-convert",
        },
        404: {
          message: "Internal error: please retry...",
          icon: "mdi-account-alert",
        },
      };
    },
    selected: function (): any {
      const n = 0;
      if (this.error instanceof Error) {
        if (isHttpError(this.error)) {
          console.log(this.error.status)
        }
      }
      return this.messages[n];
    },
    ...userHelper.mapState({
      error: function (x: UserState): Error | string | null {
        return x.error;
      },
    }),
  },
});
</script>

<style></style>
