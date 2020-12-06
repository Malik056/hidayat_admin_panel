<template>
  <div class="menu-wrapper" :class="drawer ? '' : 'hide'">
    <v-navigation-drawer v-model="drawer" light>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Hidayat
          </v-list-item-title>
          <v-list-item-subtitle>
            bayans collection
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="navigate(item)"
          class="menu-item"
          :class="selected == item.page ? 'selected-menu' : ''"
        >
          <v-list-item-icon class="menu-icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content class="menu-caption">
            <v-list-item-title class="menu-title">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "AppMenu",
  props: {
    drawer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selected: "dashboard",
      items: [
        {
          title: "Dashboard",
          icon: "mdi-view-quilt",
          page: "dashboard"
        },
        {
          title: "Category",
          icon: "mdi-layers",
          page: "category"
        },
        {
          title: "Playlist",
          icon: "mdi-play-box-outline",
          page: "playlist"
        },
        {
          title: "Bayan",
          icon: "mdi-file-music",
          page: "bayan"
        }
      ]
    };
  },
  mounted() {
    let page = null;
    if (window && window.location && window.location.pathname) {
      page = window.location.pathname;
      if (page == "/") page = "/dashboard";
    }
    if (page) {
      this.selected = page.replace("/", "");
    }
  },
  methods: {
    navigate(item) {
      this.selected = item.page;
      this.$router.push(item.page);
    }
  }
};
</script>

<style scoped>
.menu-wrapper {
  height: 100%;
  transform: translateX(0%);
  width: 256px;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  transition-property: transform, visibility, width;
}

.hide {
  width: 0px;
}

.selected-menu i {
  color: #1e88e5;
}

.selected-menu .menu-caption .menu-title {
  color: #1e88e5;
  font-weight: bold;
}

.menu-icon {
  padding: 5px;
  margin-right: 10px !important;
}

.menu-icon i {
  font-size: 25px;
}

.menu-caption .menu-title {
  font-size: 14px !important;
}
</style>
