<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Real data is passed in from the parent (e.g. enrolled students per class for
// the selected academic year). Falls back to empty so the canvas still renders.
const props = withDefaults(
  defineProps<{
    labels?: string[];
    values?: number[];
    seriesLabel?: string;
  }>(),
  {
    labels: () => [],
    values: () => [],
    seriesLabel: "",
  }
);

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.seriesLabel || "Value",
      backgroundColor: "rgba(20, 184, 166, 0.12)", // teal light
      borderColor: "#14b8a6", // teal
      pointBackgroundColor: "#14b8a6",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#14b8a6",
      fill: true,
      tension: 0.4,
      data: props.values,
    },
  ],
}));

const chartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#fff",
      titleColor: "#333",
      bodyColor: "#666",
      borderColor: "#eee",
      borderWidth: 1,
      padding: 10,
      displayColors: true,
      usePointStyle: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: "#f0f0f0",
        drawBorder: false,
      },
      ticks: {
        precision: 0,
        color: "#9E9E9E",
        font: { size: 11 },
      },
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: "#9E9E9E",
        font: {
          size: 12,
        },
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
};
</script>
