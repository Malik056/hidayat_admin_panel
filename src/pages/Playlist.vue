<template>
  <div class="playlist-wrapper">
    <div class="create-playlist">
      <div class="title">
        {{ isUpdate ? "Update Playlist" : "Create New Playlist" }}
      </div>
      <div class="form">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            :disabled="workingOnIt"
            v-model="name"
            :counter="50"
            :rules="nameRules"
            label="Playlist Name"
            required
          ></v-text-field>

          <v-select
            :disabled="workingOnIt"
            v-model="category"
            :items="categories"
            item-text="name"
            item-value="id"
            return-object
            single-line
            :rules="[(v) => !!v || 'Category is required']"
            label="Select Category"
            required
          ></v-select>

          <v-textarea
            :disabled="workingOnIt"
            name="Description"
            :rows="2"
            label="Description About Playlist"
            v-model="description"
          ></v-textarea>

          <div class="image-upload">
            <v-file-input
              :disabled="loading || workingOnIt"
              :loading="loading"
              show-size
              chips
              counter
              label="Image Upload"
              v-model="fileSelection"
              accept="image/*"
            ></v-file-input>
            <v-btn
              color="primary"
              dense
              class="ml-4"
              :disabled="loading || workingOnIt"
              @click="uploadImage()"
            >
              {{ loading ? "Uploading..." : image ? "Change" : "Upload" }}
            </v-btn>
            <div class="image-wrapper" v-if="image">
              <v-img class="ml-2" :height="40" :width="40" :src="image"></v-img>
            </div>
          </div>

          <v-btn
            :disabled="workingOnIt"
            color="warning"
            @click="resetValidation"
          >
            Reset Validation
          </v-btn>
          <v-btn
            :disabled="workingOnIt"
            color="error"
            class="ml-4"
            @click="reset"
          >
            Clear
          </v-btn>
          <v-btn
            :disabled="workingOnIt || !valid"
            color="success"
            class="ml-4"
            @click="isUpdate ? update() : validateAndCreate()"
          >
            {{ isUpdate ? "Update Playlist" : "Create Playlist" }}
          </v-btn>
        </v-form>
      </div>
    </div>
    <v-divider></v-divider>
    <div class="display">
      <div class="title">
        Existing Playlists
      </div>
      <div class="playlist-display" v-if="playlists && playlists.length > 0">
        <div v-for="(playlist, i) in playlists" :key="i" class="list-display">
          <v-card mix-width="300" width="300" outlined class="playlist-item">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">
                  Category:
                  {{ playlist.category ? playlist.category.name || "-" : "-" }}
                </div>
                <v-list-item-title class="headline mb-1">
                  {{ playlist.name }}
                </v-list-item-title>
                <v-list-item-subtitle v-if="playlist.description">{{
                  playlist.description
                }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-avatar tile size="80" color="grey">
                <img :src="playlist.image" alt="No Image" class="image-style" />
              </v-list-item-avatar>
            </v-list-item>
            <v-card-actions>
              <v-btn
                color="primary ml-2"
                fab
                x-small
                dark
                @click="allowUpdate(playlist)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                color="red ml-2"
                fab
                x-small
                dark
                @click="confirmDelete(playlist)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>
      <div
        v-else
        :style="{ margin: '20px', padding: '20px', 'font-size': '20px' }"
      >
        No data found
      </div>
    </div>

    <v-snackbar
      v-model="showMessage"
      :timeout="message.duration"
      :color="message.color"
    >
      {{ message.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showMessage = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">
          Confirm Delete
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this Playlist and All its bayans?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="rejected">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="accepted">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { imageStorage, playlistCollection, bayanCollection } from "../firebase";
import { mapState } from "vuex";
export default {
  name: "Playlist",
  data() {
    return {
      dialog: false,
      existingObj: null,
      loading: false,
      workingOnIt: false,
      fileSelection: null,
      category: null,
      valid: true,
      name: "",
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 50) || "Name must be less than 50 characters",
        (v) =>
          (v &&
            ((this.isUpdate &&
              this.existingObj.name.toLowerCase() == v.toLowerCase()) ||
              !this.playlists.find(
                (obj) => obj.name.toLowerCase() == v.toLowerCase()
              ))) ||
          "Name Already Exists. Try something else"
      ],
      description: "",
      image: "",
      message: {
        color: "red",
        text: "",
        duration: 5000
      },
      showMessage: false
    };
  },
  computed: {
    ...mapState(["playlists", "categories", "bayans"]),

    isUpdate() {
      if (
        this.existingObj &&
        typeof this.existingObj == "object" &&
        Object.keys(this.existingObj).length > 0
      )
        return true;
      else return false;
    }
  },

  methods: {
    validateAndCreate() {
      this.$refs.form.validate();
      if (this.valid) {
        if (this.fileSelection && !this.image) {
          this.uploadImage(true);
        } else this.createPlaylist();
      }
    },
    reset() {
      this.$refs.form.reset();
      this.image = "";
      this.existingObj = null;
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    createPlaylist() {
      this.workingOnIt = true;
      playlistCollection
        .add({
          createdOn: new Date().valueOf(),
          name: this.name,
          categoryId: this.category.id,
          description: this.description || "",
          image: this.image || ""
        })
        .then(() => {
          this.workingOnIt = false;
          this.message.text = "Successfully created Playlist " + this.name;
          this.message.color = "green";
          this.showMessage = true;
          this.image = "";
          this.reset();
        })
        .catch((error) => {
          this.workingOnIt = false;
          this.message.text = "Error creating Playlist " + this.name;
          this.message.color = "red";
          this.showMessage = true;
        });
    },
    uploadImage(createPlaylistAfterUpload = false) {
      if (this.fileSelection && this.fileSelection.type) {
        if (this.fileSelection.type.includes("image/")) {
          this.loading = true;
          this.workingOnIt = true;
          let file = this.fileSelection;
          let name =
            new Date().valueOf() +
            "_image_" +
            Number.parseInt(Math.random(100) * 100);
          let metadeta = {
            contentType: file.type
          };
          let task = imageStorage.child(name).put(file, metadeta);
          task
            .then((snapshot) => snapshot.ref.getDownloadURL())
            .then((url) => {
              this.fileSelection = null;
              this.loading = false;
              this.workingOnIt = false;
              this.image = url;
              this.message.text = "Image Uploaded Successfully";
              this.message.color = "green";
              this.showMessage = true;
              if (createPlaylistAfterUpload) {
                this.createPlaylist();
              }
            })
            .catch((error) => {
              this.message.text = "Error Uploading Image. Unable to Upload";
              this.message.color = "red";
              this.showMessage = true;
              this.loading = false;
              this.workingOnIt = false;
              console.error(error);
            });
        } else {
          this.message.text = "Invalid File type. Only Images are allowed";
          this.message.color = "orange darken-4";
          this.showMessage = true;
        }
      } else {
        this.message.text = "No file is selected. Please select a file";
        this.message.color = "orange darken-4";
        this.showMessage = true;
      }
    },

    allowUpdate(obj) {
      this.existingObj = JSON.parse(JSON.stringify(obj));
      this.name = this.existingObj.name;
      this.description = this.existingObj.description;
      this.category = this.existingObj.category;
      this.image = this.existingObj.image || null;
    },
    rejected() {
      this.dialog = false;
    },
    accepted() {
      this.dialog = false;
      this.delete();
    },
    confirmDelete(obj) {
      this.existingObj = JSON.parse(JSON.stringify(obj));
      this.dialog = true;
    },
    delete() {
      if (this.existingObj) {
        this.deleteChilds();
        this.deletePlaylist();
      }
    },
    deletePlaylist() {
      this.workingOnIt = true;
      playlistCollection
        .doc(this.existingObj.id)
        .delete()
        .then(() => {
          this.workingOnIt = false;
          this.message.text =
            "Successfully deleted playlist " + this.existingObj.name;
          this.message.color = "green";
          this.showMessage = true;
          this.existingObj = null;
        })
        .catch((error) => {
          this.message.text =
            "Error deleting playlist " + this.existingObj.name;
          this.message.color = "red";
          this.showMessage = true;
          this.workingOnIt = false;
          this.existingObj = null;
          console.error(error);
        });
    },
    deleteChilds() {
      let tempBayans = this.bayans.filter(
        (obj) => obj.playlistId == this.existingObj.id
      );
      if (tempBayans && tempBayans.length > 0) {
        for (let i = 0; i < tempBayans.length; i++) {
          const obj = tempBayans[i];
          bayanCollection
            .doc(obj.id)
            .delete()
            .catch((error) => {
              console.error(error);
            });
        }
      }
    },
    update() {
      if (this.existingObj) {
        this.workingOnIt = true;
        playlistCollection
          .doc(this.existingObj.id)
          .update({
            name: this.name,
            description: this.description || "",
            image: this.image || null,
            categoryId: this.category.id,
            modifiedOn: new Date().valueOf()
          })
          .then(() => {
            this.workingOnIt = false;
            this.message.text =
              "Successfully updated Playlist " + this.existingObj.name;
            this.message.color = "green";
            this.showMessage = true;
            this.reset();
          })
          .catch((error) => {
            this.workingOnIt = false;
            this.message.text =
              "Error updating Playlist " + this.existingObj.name;
            this.message.color = "red";
            this.showMessage = true;
          });
      }
    }
  }
};
</script>

<style scoped>
.create-playlist {
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 20px;
  box-sizing: border-box;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin: 5px;
  text-transform: capitalize;
  padding: 5px;
  color: green;
  border-bottom: 2px solid green;
}

.form {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 20px;
}

.playlist-display {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.list-display {
  margin: 10px;
  align-self: stretch;
}

.playlist-item {
  height: 100%;
}

.image-upload {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.image-style {
  object-fit: contain;
}
</style>
