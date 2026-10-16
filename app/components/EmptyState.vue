<template>
  <!-- Dashed placeholder for empty lists / no results. -->
  <div class="empty-state">
    <v-icon :icon="icon" size="36"></v-icon>
    <div v-if="title" class="empty-state-title">{{ title }}</div>
    <div v-if="description">{{ description }}</div>
    <div v-if="$slots.default" class="mt-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string;
    title?: string;
    description?: string;
  }>(),
  {
    icon: "mdi-inbox-outline",
    title: "",
    description: "",
  }
);
</script>
