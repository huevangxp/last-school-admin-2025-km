<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const props = withDefaults(
  defineProps<{
    labels?: string[];
    // Each series renders as a grouped set of bars.
    datasets?: { label: string; data: number[]; color: string }[];
  }>(),
  {
    labels: () => [],
    datasets: () => [],
  }
);

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((d) => ({
    label: d.label,
    data: d.data,
    backgroundColor: d.color,
    borderRadius: 4,
    maxBarThickness: 40,
  })),
}));

const chartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
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
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "#f0f0f0", drawBorder: false },
      ticks: { precision: 0, color: "#9E9E9E", font: { size: 11 } },
    },
    x: {
      grid: { display: false, drawBorder: false },
      ticks: { color: "#9E9E9E", font: { size: 11 } },
    },
  },
};
</script>
