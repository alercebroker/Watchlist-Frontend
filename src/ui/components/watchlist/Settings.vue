<template>
  <v-row>
    <v-col xs="12">
      <v-card
        class="mx-auto"
      >
        <v-card-title>Settings for notification</v-card-title>
        <v-card-text> Here you can change your email account or the notification rate.</v-card-text>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-select
              v-model="select"
              :items="notificationRates"
              :rules="[v => !!v || 'Notification rate is required']"
              label="Notification rate"
              required
            ></v-select>
            <v-col class="text-right">
              <v-btn
                color="warning"
                @click="updateSettings"
              >
                Update
              </v-btn>
            </v-col>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  data: () => ({
      valid: true,
      name: '',
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      select: null,
      notificationRates: [
        'hourly',
        '12 hours',
        'daily',
        'weekly',
        'monthly',
      ],
  }),
  // methods: {
  //   updateSettings(){
  //     console.log('Updated')
  //   }
  // },
  // computed: {
  //   notificationRate(){
  //     // return this.state.watchlist.notification_rate
  //   }
  // },
  // watch: {

  // },

  
});
</script>

<style></style>
