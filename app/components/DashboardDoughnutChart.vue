<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

// Canvas text ignores page CSS — set the Lao-capable font on Chart.js directly.
ChartJS.defaults.font.family = "'Noto Sans Lao', 'Inter', sans-serif";

const PALETTE = [
  "#14b8a6",
  "#448AFF",
  "#6366f1",
  "#f59e0b",
  "#ec4899",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
];

const props = withDefaults(
  defineProps<{
    labels?: string[];
    values?: number[];
  }>(),
  {
    labels: () => [],
    values: () => [],
  }
);

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: props.labels.map((_, i) => PALETTE[i % PALETTE.length]),
      borderColor: "#fff",
      borderWidth: 2,
    },
  ],
}));

const chartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } },
    },
    tooltip: {
      backgroundColor: "#fff",
      titleColor: "#333",
      bodyColor: "#666",
      borderColor: "#eee",
      borderWidth: 1,
      padding: 10,
    },
  },
};
</script>
