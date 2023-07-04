<template>
  <div class="bayan-wrapper">
    <div class="create-bayan">
      <div class="title">
        {{ isUpdate ? "Update Bayan" : "Add New Bayan" }}
      </div>
      <div class="form">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            :disabled="workingOnIt"
            v-model="name"
            :counter="100"
            :rules="nameRules"
            label="Bayan Name"
            required
          ></v-text-field>

          <v-select
            :disabled="workingOnIt"
            item-text="name"
            item-value="id"
            return-object
            single-line
            v-model="playlist"
            :items="playlists"
            :rules="[(v) => !!v || 'Playlist is required']"
            label="Select Playlist"
            required
          ></v-select>

          <v-textarea
            :disabled="workingOnIt"
            name="Description"
            :rows="2"
            label="Description About Bayan"
            v-model="description"
          ></v-textarea>

          <v-textarea
            :disabled="workingOnIt"
            name="Fileid"
            :rows="2"
            label="File Id"
            v-model="fileId"
          ></v-textarea>

          <div class="audio-upload">

          <v-textarea
            :disabled="workingOnIt"
            name="Url"
            :rows="2"
            :rules="urlRules"
            label="Your Bayan Url"
            v-model="audio"
          ></v-textarea>
            <!-- <v-file-input
              :disabled="loading || workingOnIt"
              :loading="loading"
              show-size
              chips
              counter
              label="Audio Upload"
              v-model="fileSelection"
              accept="audio/*"
              :rules="audioRules"
            ></v-file-input> -->
            <!-- <v-btn
              color="primary"
              :disabled="loading"
              dense
              class="ml-4"
              @click="uploadAudio()"
            >
              {{ loading ? "Uploading..." : audio ? "Change" : "Upload" }} -->
            <!-- </v-btn> -->
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
            {{ isUpdate ? "Update Bayan" : "Create Bayan" }}
          </v-btn>
        </v-form>
      </div>
    </div>
    <v-divider></v-divider>
    <div class="display">
      <div class="title">
        Existing Bayans
      </div>
      <div class="bayan-display" v-if="bayans && bayans.length > 0">
        <div v-for="(bayan, i) in bayans" :key="i" class="list-display">
          <v-card
            :loading="false"
            class="mx-auto my-12 list-item"
            max-width="374"
          >
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              ></v-progress-linear>
            </template>
            <v-img
              v-if="bayan.playlist.image && bayan.playlist.image != 'null'"
              height="150"
              alt="No Image"
              :src="bayan.playlist.image"
            ></v-img>

            <v-card-title>{{ bayan.name }}</v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0">
                <v-chip class="ma-1" color="light-blue" text-color="white">
                  {{ bayan.playlist.name }}
                </v-chip>
                <v-chip class="ma-1" color="green" text-color="white">
                  {{ bayan.playlist.category.name }}
                </v-chip>
              </v-row>
              <div>
                {{ bayan.description }}
              </div>
              <div>
                {{ bayan.fileId }}
              </div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-title>Listen here</v-card-title>

            <v-card-text>
              <audio
                v-if="bayan.link && bayan.link != 'null'"
                class="audio-file"
                controls
                :src="bayan.link"
              ></audio>
              <p v-else>No File.</p>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="primary ml-2"
                fab
                x-small
                dark
                @click="allowUpdate(bayan)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                color="red ml-2"
                fab
                x-small
                dark
                @click="confirmDelete(bayan)"
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
          Are you sure you want to delete this?
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
import { bayanCollection, audioStorage } from "../firebase";
import { mapState } from "vuex";

export default {
  name: "Bayan",
  data() {
    return {
      dialog: false,
      existingObj: null,
      loading: false,
      workingOnIt: false,
      // fileSelection: null,
      playlist: null,
      valid: true,
      name: "",
      audioRules: [
        (v) => {
          if (!!v) return true;
          else if (this.audio) return true;
          else return "Audio is required";
        }
      ],
      urlRules:[
        (v) => !!v || "Url is required",
      ],
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 100) || "Name must be less than 100 characters",
        (v) =>
          (v &&
            ((this.isUpdate &&
              this.existingObj.name.toLowerCase() == v.toLowerCase()) ||
              !this.bayans.find(
                (obj) => obj.name.toLowerCase() == v.toLowerCase()
              ))) ||
          "Name Already Exists. Try something else"
      ],
      description: "",
      fileId: "",
      audio: "",
      message: {
        color: "red",
        text: "",
        duration: 5000
      },
      showMessage: false
    };
  },
  computed: {
    ...mapState(["bayans", "playlists", "categories"]),

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
        if (this.audio) this.createBayan();
        // else {
        //   this.uploadAudio(true);
        // }
      }
    },
    reset() {
      this.$refs.form.reset();
      this.audio = "";
      this.existingObj = null;
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    createBayan() {
      this.workingOnIt = true;
      bayanCollection
        .add({
          createdOn: new Date().valueOf(),
          name: this.name,
          playlistId: this.playlist.id,
          description: this.description || "",
          fileId: this.fileId || "",
          link: this.audio || null
        })
        .then(() => {
          this.workingOnIt = false;
          this.message.text = "Successfully created Playlist " + this.name;
          this.message.color = "green";
          this.showMessage = true;
          this.audio = "";
          this.reset();
        })
        .catch((error) => {
          this.workingOnIt = false;
          this.message.text = "Error Creating bayan " + this.name;
          this.message.color = "red";
          this.showMessage = true;
        });
    },
    // uploadAudio(createBayanAfterUpload = false) {
    //   if (this.fileSelection && this.fileSelection.type) {
    //     if (this.fileSelection.type.includes("audio/")) {
    //       this.loading = true;
    //       this.workingOnIt = true;
    //       let file = this.fileSelection;
    //       let name =
    //         new Date().valueOf() +
    //         "_audio_" +
    //         Number.parseInt(Math.random(100) * 100);
    //       let metadeta = {
    //         contentType: file.type
    //       };
    //       let task = audioStorage.child(name).put(file, metadeta);
    //       task
    //         .then((snapshot) => snapshot.ref.getDownloadURL())
    //         .then((url) => {
    //           this.fileSelection = null;
    //           this.loading = false;
    //           this.workingOnIt = false;
    //           this.audio = url || "";
    //           this.message.text = "Audio Uploaded Successfully";
    //           this.message.color = "green";
    //           this.showMessage = true;
    //           if (createBayanAfterUpload) {
    //             this.createBayan();
    //           }
    //         })
    //         .catch((error) => {
    //           this.message.text = "Error Uploading Audio. Unable to Upload";
    //           this.message.color = "red";
    //           this.showMessage = true;
    //           this.loading = false;
    //           this.workingOnIt = false;
    //           console.error(error);
    //         });
    //     } else {
    //       this.message.text = "Invalid File type. Only Audio files are allowed";
    //       this.message.color = "orange darken-4";
    //       this.showMessage = true;
    //     }
    //   } else {
    //     this.message.text = "No file is selected. Please select a file";
    //     this.message.color = "orange darken-4";
    //     this.showMessage = true;
    //   }
    // },

    allowUpdate(obj) {
      this.existingObj = JSON.parse(JSON.stringify(obj));
      this.name = this.existingObj.name;
      this.description = this.existingObj.description;
      this.fileId = this.existingObj.fileId;
      this.playlist = this.existingObj.playlist;
      this.audio = this.existingObj.link || null;
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
        this.workingOnIt = true;
        bayanCollection
          .doc(this.existingObj.id)
          .delete()
          .then(() => {
            this.workingOnIt = false;
            this.message.text =
              "Successfully deleted bayan" + this.existingObj.name;
            this.message.color = "green";
            this.showMessage = true;
            this.existingObj = null;
          })
          .catch((error) => {
            this.workingOnIt = false;
            this.message.text = "Error deleting bayan " + this.existingObj.name;
            this.message.color = "red";
            this.showMessage = true;
            this.existingObj = null;
            console.error(error);
          });
      }
    },
    update() {
      if (this.existingObj) {
        this.workingOnIt = true;
        bayanCollection
          .doc(this.existingObj.id)
          .update({
            name: this.name,
            description: this.description || "",
            fileId: this.fileId || "",
            link: this.audio || null,
            playlistId: this.playlist.id,
            modifiedOn: new Date().valueOf()
          })
          .then(() => {
            this.workingOnIt = false;
            this.message.text =
              "Successfully updated Bayan " + this.existingObj.name;
            this.message.color = "green";
            this.showMessage = true;
            this.reset();
          })
          .catch((error) => {
            this.workingOnIt = false;
            this.message.text = "Error updating Bayan " + this.existingObj.name;
            this.message.color = "red";
            this.showMessage = true;
          });
      }
    }
  }
};
</script>

<style scoped>
.create-bayan {
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

.bayan-display {
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

.display .bayan-display .list-item {
  margin: 0px !important;
  height: 100%;
}

.audio-upload {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.audio-file {
  outline: none;
}
</style>
