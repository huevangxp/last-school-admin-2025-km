<template>
   <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const chartData = {
  labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
  datasets: [
    {
      label: 'Completed tasks',
      backgroundColor: 'rgba(68, 138, 255, 0.1)', // Blue light
      borderColor: '#448AFF', // Blue
      pointBackgroundColor: '#448AFF',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#448AFF',
      fill: true,
      tension: 0.4,
      data: [30, 45, 35, 50, 40, 60]
    },
    {
      label: 'Created tasks',
      backgroundColor: 'rgba(0, 230, 118, 0.05)', // Green light
      borderColor: '#00E676', // Green
      pointBackgroundColor: '#00E676',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#00E676',
      fill: true,
      tension: 0.4,
      data: [20, 35, 40, 30, 45, 55]
    }
  ]
}

const chartOptions:any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false // We'll build a custom legend if needed, or use the default but styled
    },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#333',
      bodyColor: '#666',
      borderColor: '#eee',
      borderWidth: 1,
      padding: 10,
      displayColors: true,
      usePointStyle: true,
    }
  },
  scales: {
    y: {
      display: false, // Hide Y axis labels as per design often, or keep minimal
      grid: {
        display: true,
        color: '#f0f0f0',
        drawBorder: false,
      },
      ticks: {
        display: false
      }
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: '#9E9E9E',
        font: {
          size: 12
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
}
</script>
