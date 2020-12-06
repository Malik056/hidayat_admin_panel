<template>
  <div class="layout-wrapper">
    <header class="header">
      <page-header @drawer="drawer = !drawer"></page-header>
    </header>
    <div class="content">
      <div class="menu">
        <app-menu :drawer="drawer"></app-menu>
      </div>
      <div class="pages">
        <div class="body">
          <router-view />
        </div>
        <footer class="footer">
          <app-footer></app-footer>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from "../components/PageHeader.vue";
import AppMenu from "../components/AppMenu.vue";
import AppFooter from "../components/AppFooter.vue";
export default {
  name: "Layout",
  components: {
    PageHeader,
    AppMenu,
    AppFooter
  },
  data() {
    return {
      drawer: true
    };
  }
};
</script>

<style>
.layout-wrapper {
  text-align: left;
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  margin: 0px;
  padding: 0px;
  display: flex;
  flex-direction: column;
}

.header {
  position: relative;
  width: 100%;
}

.content {
  flex: 1;
  overflow: hidden;
  display: flex;
  max-height: calc(100% - 64px);
  flex-direction: row;
}

.pages {
  flex: 1;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #eee;
}

.body {
  flex: 1;
}
</style>
