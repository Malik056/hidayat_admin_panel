<template>
  <div class="wrapper">
    <div class="form">
      <v-card class="elevation-10 pa-3">
        <v-toolbar
          color="#1e17c5"
          dark
        >
          <!-- src="https://images.pexels.com/photos/96381/pexels-photo-96381.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" -->
          <!-- <v-toolbar-title class="text-center">Sign In</v-toolbar-title> -->
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
              @input="invalidCredentials = false"
              v-model="email"
              :loading="authStatus == 'processing'"
              :disabled="!allowedToLogin"
              prepend-inner-icon="mdi-account"
              placeholder="Email"
              outlined
              background-color="white"
              dense
              filled
              :rules="emailRules"
            ></v-text-field>
            <v-text-field
              @input="invalidCredentials = false"
              v-model="pass"
              :loading="authStatus == 'processing'"
              :disabled="!allowedToLogin"
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
          <v-alert v-if="invalidCredentials" type="error">Invalid Credentials.</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="#0e07b5"
            class="white--text"
            @click="login"
            :disabled="!allowedToLogin"
          >Login</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import firebase from "../firebase";

export default {
  name: "Login",
  data() {
    return {
      allowedToLogin: true,
      email: "",
      pass: "",
      emailRules: [
        v => !!v || "Value is required",
        v => /.+@.+\..+/.test(v) || "E-mail is not valid"
      ],
      passRules: [v => !!v || "Value is required"],
      invalidCredentials: false
    };
  },
  props: {
    authStatus: String
  },
  watch: {
    authStatus() {
      if (this.authStatus == "rejected" || this.authStatus == "logout") {
        this.allowedToLogin = true;
      } else {
        this.allowedToLogin = false;
      }
    }
  },
  methods: {
    login() {
      this.allowedToLogin = false;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email.toLowerCase(), this.pass)
        .then(() => {
          this.email = "";
          this.pass = "";
          this.allowedToLogin = true;
        })
        .catch(error => {
          this.allowedToLogin = true;
          this.invalidCredentials = true;
          console.error("Login Error");
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