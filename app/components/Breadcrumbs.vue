<template>
    <div class="mb-6">
      <v-breadcrumbs 
        :items="breadcrumbs" 
        class="pa-0 text-secondary" 
        divider="-"
      ></v-breadcrumbs>
    </div>
  </template>
  
  <script setup lang="ts">
  // Remove unused ref import
  
  // Define proper TypeScript interface for breadcrumb items
  interface BreadcrumbItem {
    title: string
    disabled?: boolean
    href?: string
    to?: string | object
  }
  
  const props = defineProps<{
    breadcrumbs: BreadcrumbItem[]
  }>()
  </script>