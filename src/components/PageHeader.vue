<template>
  <div class="header">
    <v-app-bar dark color="blue">
      <v-app-bar-nav-icon @click="drawerChnaged"></v-app-bar-nav-icon>
      <v-avatar tile color="blue">
        <v-img
          alt="Logo"
          class="shrink ml-4 mr-2"
          contain
          src="@/assets/logo.png"
          transition="scale-transition"
          width="50"
        />
      </v-avatar>
      <v-toolbar-title>Hidayat</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="mx-2" fab dark small color="primary" @click="logout">
        <v-icon dark>
          mdi-power
        </v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import { auth } from "../firebase";
export default {
  name: "PageHeader",
  data: () => ({}),
  methods: {
    drawerChnaged() {
      this.$emit("drawer");
    },
    logout() {
      auth.signOut().then(() => {
        this.$store.commit("AUTHENTICATED", false);
        this.$router.push("/login");
      });
    }
  }
};
</script>

<style scoped></style>
