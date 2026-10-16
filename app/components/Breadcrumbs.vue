<template>
  <!-- Standalone breadcrumb trail. Prefer <PageHeader :breadcrumbs> which
       renders the same trail above a page title. -->
  <v-breadcrumbs
    :items="breadcrumbs"
    class="page-crumbs pa-0 mb-4"
    density="compact"
  >
    <template #divider>
      <v-icon size="14">mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  title: string;
  disabled?: boolean;
  href?: string;
  to?: string | object;
}

defineProps<{
  breadcrumbs: BreadcrumbItem[];
}>();
</script>
