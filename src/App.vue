<template>
  <v-app>
    <div id="app">
      <template v-if="isLogin || authenticated">
        <layout></layout>
      </template>
      <template v-else>
        <router-view />
      </template>
    </div>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import { auth } from "./firebase";

import Layout from "./views/Layout.vue";
export default {
  name: "App",
  components: {
    Layout
  },
  watch: {
    authenticated() {
      if (auth && auth.currentUser) {
        this.$store.dispatch("initData");
      }
    }
  },
  created() {
    if (auth && auth.currentUser) {
      this.$store.dispatch("initData");
    } else {
      this.$router.push("/login");
    }
  },
  computed: {
    ...mapState(["authenticated"]),

    isLogin() {
      if (auth && auth.currentUser) {
        return true;
      } else return false;
    }
  }
};
</script>

<style lang="scss">
html {
  overflow: hidden !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<style>
* {
  box-sizing: border-box;
}
</style>
