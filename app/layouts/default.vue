<template>
    <v-app class="bg-bg">
      <Header />
      <v-main >
        <v-container fluid> 
          <slot />
        </v-container>
      </v-main>
    </v-app>
</template>

<script setup lang="ts">

</script>

<style>
  *{
    font-family: 'Volkhov', 'Noto Sans Lao', sans-serif;
  }
</style>
