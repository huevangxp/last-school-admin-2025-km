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

</script>

<style>
  *{
    font-family: 'Volkhov', 'Noto Sans Lao', sans-serif;
  }
</style>
