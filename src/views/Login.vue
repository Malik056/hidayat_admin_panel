<template>
  <div class="wrapper">
    <div class="form">
      <v-card class="elevation-10 pa-3">
        <v-toolbar color="#1e17c5" dark>
          <h2>Sign In</h2>
          <v-spacer></v-spacer>
          <v-img
            alt="Logo"
            class="shrink ml-4 mr-2"
            contain
            src="@/assets/logo.png"
            transition="scale-transition"
            width="50"
          />
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              :loading="loading"
              :disabled="loading"
              v-model="email"
              prepend-inner-icon="mdi-account"
              placeholder="Email"
              outlined
              background-color="white"
              dense
              filled
              :rules="emailRules"
            ></v-text-field>
            <v-text-field
              :loading="loading"
              :disabled="loading"
              v-model="pass"
              prepend-inner-icon="mdi-lock"
              placeholder="Password"
              outlined
              background-color="white"
              dense
              filled
              :rules="passRules"
              type="password"
              name="password"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-alert v-if="invalidCredentials" type="error"
          >Invalid Credentials.</v-alert
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="#0e07b5"
            class="white--text"
            @click="login"
            :disabled="loading"
          >
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import { auth } from "../firebase";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      pass: "",
      emailRules: [
        (v) => !!v || "Value is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail is not valid"
      ],
      passRules: [(v) => !!v || "Value is required"],
      invalidCredentials: false,
      loading: false
    };
  },
  methods: {
    login() {
      this.invalidCredentials = false;
      this.loading = true;
      // sign user in
      auth
        .signInWithEmailAndPassword(this.email, this.pass)
        .then((res) => {
          this.loading = false;
          this.$store.commit("AUTHENTICATED", true);
          this.$router.push("/dashboard");
        })
        .catch((error) => {
          this.loading = false;
          this.$store.commit("AUTHENTICATED", false);
          this.invalidCredentials = true;
          console.error(error);
        });
    }
  }
};

// background image URL
// https://www.pexels.com/photo/abstract-art-blur-circle-96381/
</script>

<style scoped>
.wrapper {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url("https://images.pexels.com/photos/96381/pexels-photo-96381.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940");
  background-attachment: fixed;
  background-origin: content-box;
  background-position: center;
  object-fit: cover;
  background-repeat: no-repeat;
}

.form {
  padding: 1em;
  width: 90%;
  height: auto;
  max-width: 450px;
}
</style>
