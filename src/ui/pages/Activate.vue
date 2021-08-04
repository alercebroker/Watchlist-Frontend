<template>
  <v-container fill-height>
    <activate-card
      :message="message.text"
      :icon="message.icon"
      :spinner="loading"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ActivateCard from "@/ui/components/users/ActivateCard.vue";
import { createNamespacedHelpers } from "vuex";
import { UserState } from "../store/user/state";
import { ActionTypes, ActivateInput } from "@/ui/store/user/actions";
import { HttpError } from "@/shared/http";

const userHelper = createNamespacedHelpers("users");

type messageType = {
  text: string;
  icon?: string;
};

export default Vue.extend({
  components: { ActivateCard },
  props: {
    uid: {
      type: String || null,
      default: null,
    },
    token: {
      type: String || null,
      default: null,
    },
  },
  data: (): {
    message: messageType;
  } => ({
    message: {
      text: "Activating your account please wait...",
    },
  }),
  mounted() {
    const input: ActivateInput = { uid: this.uid, token: this.token };
    this.activate(input).then(() => {
      this.afterRequest();
    });
  },
  methods: {
    afterRequest() {
      const val = this.error;
      if (val === null) {
        this.message.text =
          'Your account is activated. You may close this window and login. Or click <a href="/">here</a>.';
        this.message.icon = "mdi-account-check";
      } else if (val instanceof HttpError) {
        if (val.status === 403) {
          this.message.text = "This account is already active.";
          this.message.icon = "mdi-account-convert";
        } else {
          this.message.text = JSON.stringify(val.message);
          this.message.icon = "mdi-account-alert";
        }
      } else {
        this.message.text = val.toString();
        this.message.icon = "mdi-alert";
      }
    },
    ...userHelper.mapActions([ActionTypes.activate]),
  },
  computed: {
    ...userHelper.mapState({
      error: function (x: UserState): Error | string | null {
        return x.error;
      },
      loading: function (x: UserState): boolean {
        return x.loading;
      },
    }),
  },
});
</script>

<style></style>
