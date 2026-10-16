<template>
  <!-- Page header: breadcrumbs + icon + title/subtitle on the left, actions on
       the right. Stacks vertically on phones; action buttons stretch full width. -->
  <div class="page-header fade-in">
    <v-breadcrumbs
      v-if="breadcrumbs && breadcrumbs.length"
      :items="breadcrumbs"
      class="page-crumbs pa-0 mb-2"
      density="compact"
    >
      <template #divider>
        <v-icon size="14">mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <div class="page-header-row">
      <div class="page-header-main">
        <v-btn
          v-if="back"
          :to="back"
          icon="mdi-arrow-left"
          variant="tonal"
          color="primary"
          size="small"
          class="flex-shrink-0"
        ></v-btn>
        <div v-if="icon" class="page-icon">
          <v-icon :icon="icon" size="22"></v-icon>
        </div>
        <div class="min-w-0">
          <h1 class="page-title">{{ title }}</h1>
          <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
        </div>
      </div>
      <div v-if="$slots.actions" class="page-actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  title: string;
  disabled?: boolean;
  href?: string;
  to?: string | object;
}

defineProps<{
  title: string;
  subtitle?: string;
  icon?: string;
  breadcrumbs?: BreadcrumbItem[];
  /** Route for an optional back arrow button (e.g. "/students"). */
  back?: string;
}>();
</script>
