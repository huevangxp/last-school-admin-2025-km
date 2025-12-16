<template>
  <v-app class="bg-grey-lighten-4">
    <Header />
     
    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="px-6 py-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// No script needed as Header handles the layout logic
</script>

<style scoped>
/* Styles moved to Header.vue */
</style>