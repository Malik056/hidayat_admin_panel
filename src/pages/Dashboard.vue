<template>
  <div class="dashboard-wrapper">
    <div class="table-wrapper">
      <div class="title">Bayans</div>
      <app-table :headers="bayanHeaders" :data="bayans"></app-table>
    </div>
    <div class="table-wrapper">
      <div class="title">Playlists</div>
      <app-table :headers="playlistHeaders" :data="playlists"></app-table>
    </div>
    <div class="table-wrapper">
      <div class="title">Categories</div>
      <app-table :headers="categoryHeaders" :data="categories"></app-table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AppTable from "../components/AppTable.vue";
export default {
  components: { AppTable },
  name: "Dashboard",
  data() {
    return {
      bayanHeaders: [
        {
          text: "Bayan ID",
          align: "start",
          value: "id"
        },
        {
          text: "Bayan Name",
          align: "start",
          value: "name"
        },
        {
          text: "Bayan Description",
          align: "start",
          value: "description"
        },
        {
          text: "Playlist Name",
          align: "start",
          value: "playlist.name"
        },
        {
          text: "Playlist ID",
          align: "start",
          value: "playlistId"
        },
        {
          text: "Cateated On",
          align: "start",
          value: "dateString"
        },
        {
          text: "Creation Time",
          align: "start",
          value: "timeString"
        }
      ],
      playlistHeaders: [
        {
          text: "Playlist ID",
          align: "start",
          value: "id"
        },
        {
          text: "Playlist Name",
          align: "start",
          value: "name"
        },
        {
          text: "Playlist Description",
          align: "start",
          value: "description"
        },
        {
          text: "Category Name",
          align: "start",
          value: "category.name"
        },
        {
          text: "Category ID",
          align: "start",
          value: "categoryId"
        },
        {
          text: "Cateated On",
          align: "start",
          value: "dateString"
        },
        {
          text: "Creation Time",
          align: "start",
          value: "timeString"
        }
      ],
      categoryHeaders: [
        {
          text: "Category ID",
          align: "start",
          value: "id"
        },
        {
          text: "Category Name",
          align: "start",
          value: "name"
        },
        {
          text: "Category Description",
          align: "start",
          value: "description"
        },
        {
          text: "Cateated On",
          align: "start",
          value: "dateString"
        },
        {
          text: "Creation Time",
          align: "start",
          value: "timeString"
        }
      ]
    };
  },
  computed: {
    ...mapState(["categories", "playlists", "bayans"])
  }
};
</script>

<style scoped>
.table-wrapper {
  padding: 10px;
  margin: 10px;
}

.title {
  text-transform: capitalize;
  width: 100%;
  text-align: center;
}
</style>
