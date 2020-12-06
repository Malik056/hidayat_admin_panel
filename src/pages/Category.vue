<template>
  <div class="category-wrapper">
    <div class="create-category">
      <div class="title">
        {{ isUpdate ? "Update Category" : "Create New Category" }}
      </div>
      <div class="form">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="name"
            :counter="50"
            :rules="nameRules"
            label="Category Name"
            required
          ></v-text-field>

          <v-textarea
            name="Description"
            :rows="2"
            label="Description About Category"
            v-model="description"
          ></v-textarea>

          <v-btn color="warning" @click="resetValidation">
            Reset Validation
          </v-btn>
          <v-btn color="error" class="ml-4" @click="reset">
            Clear
          </v-btn>
          <v-btn
            :disabled="!valid"
            color="success"
            class="ml-4"
            @click="isUpdate ? update() : validateAndCreate()"
          >
            {{ isUpdate ? "Update Category" : "Create Category" }}
          </v-btn>
        </v-form>
      </div>
    </div>
    <v-divider></v-divider>
    <div class="display">
      <div class="title">
        Existing Categories
      </div>
      <div
        class="categories-display"
        v-if="categories && categories.length > 0"
      >
        <div v-for="(cat, i) in categories" :key="i" class="cat-display">
          <v-chip class="ma-2" color="green" text-color="white">
            {{ cat.name }}
            <v-btn
              color="primary ml-2"
              fab
              x-small
              dark
              @click="allowUpdate(cat)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              color="red ml-2"
              fab
              x-small
              dark
              @click="confirmDelete(cat)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-chip>
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
          Are you sure you want to delete this Category and All its Palylist and
          Bayans?
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
import {
  categoryCollection,
  playlistCollection,
  bayanCollection
} from "../firebase";
import { mapState } from "vuex";

export default {
  name: "Category",
  data() {
    return {
      dialog: false,
      existingObj: null,
      self: null,

      valid: true,
      name: "",
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 50) || "Name must be less than 50 characters",
        (v) =>
          (v &&
            ((this.isUpdate &&
              this.existingObj.name.toLowerCase() == v.toLowerCase()) ||
              !this.categories.find(
                (obj) => obj.name.toLowerCase() == v.toLowerCase()
              ))) ||
          "Name Already Exists. Try something else"
      ],
      description: "",
      message: {
        color: "red",
        text: "",
        duration: 5000
      },
      showMessage: false
    };
  },
  mounted() {
    this.self = this;
  },
  computed: {
    ...mapState(["categories", "playlists", "bayans"]),

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
        this.createCategory();
      }
    },
    reset() {
      this.$refs.form.reset();
      this.existingObj = null;
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    createCategory() {
      categoryCollection
        .add({
          createdOn: new Date().valueOf(),
          name: this.name,
          description: this.description || "",
          modifiedOn: new Date().valueOf()
        })
        .then(() => {
          this.message.text = "Successfully created Category " + this.name;
          this.message.color = "green";
          this.showMessage = true;
          this.reset();
        });
    },
    allowUpdate(obj) {
      this.existingObj = JSON.parse(JSON.stringify(obj));
      this.name = this.existingObj.name;
      this.description = this.existingObj.description;
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
        this.deleteCategory();
      }
    },
    deleteCategory() {
      categoryCollection
        .doc(this.existingObj.id)
        .delete()
        .then(() => {
          this.message.text =
            "Successfully deleted category " + this.existingObj.name;
          this.message.color = "green";
          this.showMessage = true;
          this.existingObj = null;
        })
        .catch((error) => {
          this.message.text =
            "Error deleting category " + this.existingObj.name;
          this.message.color = "red";
          this.showMessage = true;
          this.existingObj = null;
          console.error(error);
        });
    },
    deleteChilds() {
      let tempPlayLists = this.playlists.filter(
        (obj) => obj.categoryId == this.existingObj.id
      );

      if (tempPlayLists && tempPlayLists.length > 0) {
        let tempBayans = [];
        tempPlayLists.forEach((pl) => {
          tempBayans = tempBayans.concat(
            this.bayans.filter((obj) => obj.playlistId == pl.id)
          );
        });

        if (tempBayans && tempBayans.length > 0) {
          tempBayans.forEach((obj) => {
            bayanCollection
              .doc(obj.id)
              .delete()
              .catch((error) => {
                console.error(error);
              });
          });
        }

        tempPlayLists.forEach((obj) => {
          playlistCollection
            .doc(obj.id)
            .delete()
            .catch((error) => {
              console.error(error);
            });
        });
      }
    },

    update() {
      if (this.existingObj) {
        categoryCollection
          .doc(this.existingObj.id)
          .update({
            name: this.name,
            description: this.description || "",
            modifiedOn: new Date().valueOf()
          })
          .then(() => {
            this.message.text =
              "Successfully updated Category " + this.existingObj.name;
            this.message.color = "green";
            this.showMessage = true;
            this.reset();
          });
      }
    }
  }
};
</script>

<style scoped>
.category-wrapper {
  position: relative;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 5px;
}

.create-category {
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

.categories-display {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.cat-display {
  margin: 10px;
}
</style>
