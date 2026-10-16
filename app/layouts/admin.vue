<template>
  <v-app class="app-bg">
    <Header />
     
    <v-main>
      <v-container fluid class="pa-4 pa-md-6">
        <slot />
      </v-container>
    </v-main>
    <AppFeedback />
  </v-app>
</template>

<script setup lang="ts">
// No script needed as Header handles the layout logic
</script>

<style scoped>
/* Styles moved to Header.vue */
</style>