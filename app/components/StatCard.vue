<template>
  <!-- KPI tile. `color`/`tint` are hex values used for the icon and accent bar. -->
  <v-card
    elevation="0"
    class="stat-card h-100"
    :to="to"
    :style="{ '--stat-color': color, '--stat-tint': tint }"
  >
    <div class="stat-top">
      <div class="stat-icon">
        <v-icon :icon="icon" size="20"></v-icon>
      </div>
      <span v-if="badge" class="stat-pill">
        <span v-if="pulse" class="stat-pulse"></span>
        {{ badge }}
      </span>
    </div>
    <div class="stat-value">{{ value }}</div>
    <div class="stat-label">{{ label }}</div>
    <div class="stat-bar"></div>
  </v-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string;
    label: string;
    value: string | number;
    /** Accent color (hex). */
    color?: string;
    /** Icon background tint (hex). */
    tint?: string;
    /** Small pill text in the corner, e.g. "Live". */
    badge?: string;
    /** Show the pulsing green dot inside the badge. */
    pulse?: boolean;
    /** Optional route the whole card links to. */
    to?: string;
  }>(),
  {
    color: "#0A3154",
    tint: "#E6ECF2",
    badge: "",
    pulse: false,
    to: undefined,
  }
);
</script>
