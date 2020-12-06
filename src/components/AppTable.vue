<template>
  <div class="table-wrapper">
    <v-data-table :headers="headers" :items="data" class="elevation-1">
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "AppTable",
  props: {
    headers: {
      type: Array,
      default: new Array()
    },
    data: {
      type: Array,
      default: new Array()
    }
  }
};
</script>

<style scoped></style>
