import Vue from 'vue'
import Vuex from 'vuex'
import {
  categoryCollection,
  playlistCollection,
  bayanCollection
} from '../firebase';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    categories: [],
    playlists: [],
    bayans: [],
    authenticated: false
  },
  mutations: {
    AUTHENTICATED: (state, val) => {
      state.authenticated = val;
    },
    CATEGORIES: (state, data) => {
      if (data && data instanceof Array && data.length > 0)
        state.categories = data.slice(0);
    },
    PLAYLISTS: (state, data) => {
      if (data && data instanceof Array && data.length > 0)
        state.playlists = data.slice(0);
    },
    BAYANS: (state, data) => {
      if (data && data instanceof Array && data.length > 0)
        state.bayans = data.slice(0);
    }
  },
  actions: {
    initData(context) {
      context.dispatch("getCategories");
    },

    getCategories(context) {
      categoryCollection.orderBy("createdOn", "desc").onSnapshot(snapshot => {
        context.commit("CATEGORIES", []);
        let categories = [];
        snapshot.forEach((doc) => {
          let category = doc.data();
          category.id = doc.id;
          category.dateString = new Date(category.createdOn).toDateString();
          category.timeString = new Date(category.createdOn).toLocaleTimeString();
          categories.push(category);
        });
        context.commit("CATEGORIES", categories);
        context.dispatch("getPlaylists");
      });
    },

    getPlaylists(context) {
      playlistCollection.orderBy("createdOn", "desc").onSnapshot(snapshot => {
        context.commit("PLAYLISTS", []);
        let playlists = [];
        snapshot.forEach((doc) => {
          let playlist = doc.data();
          playlist.id = doc.id;
          playlist.dateString = new Date(playlist.createdOn).toDateString();
          playlist.timeString = new Date(playlist.createdOn).toLocaleTimeString();

          let category = context.state.categories.find(obj => obj.id == playlist.categoryId);
          if (category) playlist.category = JSON.parse(JSON.stringify(category));
          else playlist.category = {};

          playlists.push(playlist);
        });
        context.commit("PLAYLISTS", playlists);
        context.dispatch("getBayans");
      });
    },

    getBayans(context) {
      bayanCollection.orderBy("createdOn", "desc").onSnapshot(snapshot => {
        context.commit("BAYANS", []);
        let bayans = [];
        snapshot.forEach((doc) => {
          let bayan = doc.data();
          bayan.id = doc.id;
          bayan.dateString = new Date(bayan.createdOn).toDateString();
          bayan.timeString = new Date(bayan.createdOn).toLocaleTimeString();

          let playlist = context.state.playlists.find(obj => obj.id == bayan.playlistId);
          if (playlist) bayan.playlist = JSON.parse(JSON.stringify(playlist));
          else bayan.playlist = {};

          bayans.push(bayan);
        });
        context.commit("BAYANS", bayans);
      });
    }
  },
  modules: {
  }
})
