<template>
  <v-container fluid class="pa-6 dashboard-container">
    <!-- Analytics Matrix -->
    <v-row class="ga-y-6">
      <!-- 1. Student Enrollment Trend (Line) -->
      <v-col cols="12" lg="8">
        <v-card elevation="0" class="intelligence-card h-100 pa-6">
          <div class="d-flex justify-space-between align-center mb-6">
            <div>
              <div class="text-title mb-1">Student Enrollment Trend</div>
              <div class="text-detail">Annual enrollment growth trajectory</div>
            </div>
            <v-chip
              color="primary-lighten-5"
              class="text-primary font-weight-black"
              size="x-small"
              variant="flat"
            >
              +12.5% GROWTH
            </v-chip>
          </div>
          <div class="chart-wrapper" style="height: 300px">
            <ClientOnly>
              <Line :data="studentData" :options="lineOptions" />
            </ClientOnly>
          </div>
        </v-card>
      </v-col>

      <!-- 2. Teacher Distribution (Doughnut) -->
      <v-col cols="12" lg="4">
        <v-card elevation="0" class="intelligence-card h-100 pa-6">
          <div class="text-title mb-1">Faculty Composition</div>
          <div class="text-detail mb-6">Teacher distribution by department</div>
          <div
            class="chart-wrapper d-flex flex-column align-center"
            style="height: 250px"
          >
            <ClientOnly>
              <Doughnut :data="teacherData" :options="doughnutOptions" />
            </ClientOnly>
          </div>
          <div class="mt-4">
            <div
              v-for="(label, i) in teacherData.labels"
              :key="i"
              class="d-flex align-center justify-space-between mb-1"
            >
              <div class="d-flex align-center">
                <div
                  class="status-dot mr-2"
                  :style="`background: ${teacherData.datasets[0].backgroundColor[i]}`"
                ></div>
                <span class="text-detail-tiny">{{ label }}</span>
              </div>
              <span class="text-title-small" style="font-size: 10px !important"
                >{{ teacherData.datasets[0].data[i] }}%</span
              >
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- 3. Class Performance (Bar) -->
      <v-col cols="12" md="6" lg="6">
        <v-card elevation="0" class="intelligence-card pa-6">
          <div class="text-title mb-1">Class Proficiency Audit</div>
          <div class="text-detail mb-6">
            Average score distribution across grades
          </div>
          <div class="chart-wrapper" style="height: 250px">
            <ClientOnly>
              <Bar :data="classData" :options="barOptions" />
            </ClientOnly>
          </div>
        </v-card>
      </v-col>

      <!-- 4. Subject Popularity (Horizontal Bar) -->
      <v-col cols="12" md="6" lg="6">
        <v-card elevation="0" class="intelligence-card pa-6">
          <div class="text-title mb-1">Subject Engagement</div>
          <div class="text-detail mb-6">
            Student enrollment volume by subject
          </div>
          <div class="chart-wrapper" style="height: 250px">
            <ClientOnly>
              <Bar :data="subjectData" :options="horizontalBarOptions" />
            </ClientOnly>
          </div>
        </v-card>
      </v-col>

      <!-- 5. Group Student / Ethnic Diversity (Polar Area) -->
      <v-col cols="12">
        <v-card elevation="0" class="intelligence-card pa-6">
          <div class="d-flex align-center mb-6">
            <v-avatar
              color="orange-lighten-5"
              rounded="lg"
              size="40"
              class="mr-4"
            >
              <v-icon color="orange-darken-2" size="20"
                >mdi-account-group-outline</v-icon
              >
            </v-avatar>
            <div>
              <div class="text-title mb-1">Demographic Diversity</div>
              <div class="text-detail">
                Ethnic group distribution across the institution
              </div>
            </div>
          </div>
          <v-row>
            <v-col cols="12" md="4" class="d-flex align-center justify-center">
              <div style="height: 250px; width: 100%">
                <ClientOnly>
                  <PolarArea :data="ethnicData" :options="polarOptions" />
                </ClientOnly>
              </div>
            </v-col>
            <v-col cols="12" md="8">
              <div class="grid-stats pa-4 rounded-xl bg-grey-lighten-4 h-100">
                <div class="text-detail-tiny mb-4">
                  DETAILED ENROLLMENT BREAKDOWN
                </div>
                <v-row>
                  <v-col
                    cols="6"
                    sm="4"
                    lg="3"
                    v-for="(val, i) in ethnicData.datasets[0].data"
                    :key="i"
                  >
                    <div
                      class="pa-3 bg-white rounded-lg border border-slate-100 shadow-sm"
                    >
                      <div
                        class="text-detail-tiny"
                        :style="`color: ${ethnicData.datasets[0].backgroundColor[i]}`"
                      >
                        {{ ethnicData.labels[i] }}
                      </div>
                      <div class="text-title">
                        {{ val }}
                        <span
                          class="text-detail"
                          style="font-size: 10px !important"
                          >STDS</span
                        >
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  PolarAreaController,
} from "chart.js";
import { Line, Doughnut, Bar, PolarArea } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  PolarAreaController,
);

const { t } = useI18n();

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("reports"), disabled: true, to: "/reports" },
];

// 1. Student Enrollment Data
const studentData = {
  labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
  datasets: [
    {
      label: "Total Students",
      borderColor: "#14b8a6",
      backgroundColor: "rgba(20, 184, 166, 0.1)",
      data: [2100, 2450, 2800, 3100, 3250, 3500],
      fill: true,
      tension: 0.4,
    },
  ],
};

// 2. Teacher Distribution Data
const teacherData = {
  labels: ["Science", "Math", "Language", "Arts", "IT"],
  datasets: [
    {
      data: [25, 30, 20, 15, 10],
      backgroundColor: ["#14b8a6", "#448AFF", "#6366f1", "#f43f5e", "#f59e0b"],
      borderWidth: 0,
    },
  ],
};

// 3. Class Performance Data
const classData = {
  labels: ["G-9", "G-10", "G-11", "G-12"],
  datasets: [
    {
      label: "Avg Score",
      backgroundColor: "#6366f1",
      borderRadius: 6,
      data: [78, 85, 82, 91],
    },
  ],
};

// 4. Subject Enrollment Data
const subjectData = {
  labels: ["Physics", "Calculus", "English", "History", "Biology"],
  datasets: [
    {
      label: "Enrollment",
      backgroundColor: "rgba(20, 184, 166, 0.8)",
      borderRadius: 4,
      data: [420, 380, 560, 310, 480],
    },
  ],
};

// 5. Ethnic Group Data
const ethnicData = {
  labels: ["Lao-Loum", "Hmong", "Khmu", "Yao", "Others"],
  datasets: [
    {
      data: [1800, 650, 420, 220, 160],
      backgroundColor: ["#14b8a6", "#6366f1", "#f59e0b", "#f43f5e", "#94a3b8"],
    },
  ],
};

// Chart Options
const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: "#f1f5f9" }, ticks: { color: "#94a3b8" } },
    x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: { legend: { display: false } },
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { min: 0, max: 100, ticks: { color: "#94a3b8" } },
    x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
  },
};

const horizontalBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: "#f1f5f9" }, ticks: { color: "#94a3b8" } },
    y: { grid: { display: false }, ticks: { color: "#94a3b8" } },
  },
};

const polarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { r: { ticks: { display: false } } },
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.modern-action-btn {
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  padding: 0 16px !important;
  font-family: "Volkhov", serif !important;
  letter-spacing: 0px !important;
}

.modern-action-btn.primary {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
}

.intelligence-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.intelligence-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.05);
}

.chart-wrapper {
  width: 100%;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.bg-grey-lighten-4 {
  background-color: #f8fafc !important;
}

.border-slate-100 {
  border-color: #f1f5f9 !important;
}
</style>
