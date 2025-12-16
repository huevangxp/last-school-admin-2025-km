<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const chartData = {
  labels: ['Alex', 'Jordan', 'Priya', 'Others'],
  datasets: [
    {
      backgroundColor: ['#448AFF', '#FFC107', '#00E676', '#E0E0E0'],
      data: [32, 28, 21, 43],
      borderWidth: 0,
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        padding: 20,
        font: {
          size: 12
        }
      }
    }
  }
}
</script>
