<template>
  <v-container fluid class="pa-6 dashboard-container">
    <!-- Analytics Matrix -->
    <v-row class="ga-y-6">
      <!-- 1. Student Enrollment Trend (Line) -->
      <v-col cols="12" lg="8">
        <v-card elevation="0" class="intelligence-card h-100 pa-6">
          <div class="d-flex justify-space-between align-center mb-6">
            <div>
              <div class="text-title mb-1">{{ t("student-enrollment-trend") }}</div>
              <div class="text-detail">{{ t("annual-enrollment-growth") }}</div>
            </div>
            <v-chip
              color="primary-lighten-5"
              class="text-primary font-weight-black"
              size="x-small"
              variant="flat"
            >
              {{ t("enrollment-growth-badge") }}
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
          <div class="text-title mb-1">{{ t("faculty-composition") }}</div>
          <div class="text-detail mb-6">{{ t("teacher-distribution-by-department") }}</div>
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
          <div class="text-title mb-1">{{ t("class-proficiency-audit") }}</div>
          <div class="text-detail mb-6">
            {{ t("average-score-distribution") }}
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
          <div class="text-title mb-1">{{ t("subject-engagement") }}</div>
          <div class="text-detail mb-6">
            {{ t("student-enrollment-volume-by-subject") }}
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
              rounded="0"
              size="40"
              class="mr-4"
            >
              <v-icon color="orange-darken-2" size="20"
                >mdi-account-group-outline</v-icon
              >
            </v-avatar>
            <div>
              <div class="text-title mb-1">{{ t("demographic-diversity") }}</div>
              <div class="text-detail">
                {{ t("ethnic-group-distribution") }}
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
              <div class="grid-stats pa-4 rounded-0 bg-grey-lighten-4 h-100">
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
                      class="pa-3 bg-white rounded-0 border border-slate-100 shadow-sm"
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
import { ref, onMounted } from "vue";
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
  LineController,
  BarController,
  DoughnutController,
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
  LineController,
  BarController,
  DoughnutController,
);

const { t } = useI18n();
const { $axios } = useNuxtApp();

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("reports"), disabled: true, to: "/reports" },
];

const PALETTE = [
  "#14b8a6",
  "#448AFF",
  "#6366f1",
  "#f43f5e",
  "#f59e0b",
  "#94a3b8",
  "#10b981",
  "#8b5cf6",
];

// All chart data below is populated from the live server in onMounted().
const studentData = ref<any>({
  labels: [],
  datasets: [
    {
      label: "Enrolled Students",
      borderColor: "#14b8a6",
      backgroundColor: "rgba(20, 184, 166, 0.1)",
      data: [],
      fill: true,
      tension: 0.4,
    },
  ],
});

const teacherData = ref<any>({
  labels: [],
  datasets: [{ data: [], backgroundColor: PALETTE, borderWidth: 0 }],
});

const classData = ref<any>({
  labels: [],
  datasets: [
    { label: "Classes", backgroundColor: "#6366f1", borderRadius: 6, data: [] },
  ],
});

const subjectData = ref<any>({
  labels: [],
  datasets: [
    {
      label: "Coefficient",
      backgroundColor: "rgba(20, 184, 166, 0.8)",
      borderRadius: 4,
      data: [],
    },
  ],
});

const ethnicData = ref<any>({
  labels: [],
  datasets: [{ data: [], backgroundColor: PALETTE }],
});

const countBy = (arr: any[], keyFn: (x: any) => string) => {
  const m: Record<string, number> = {};
  arr.forEach((x) => {
    const k = keyFn(x) || "—";
    m[k] = (m[k] || 0) + 1;
  });
  return m;
};

onMounted(async () => {
  try {
    const [tRes, cRes, subRes, sRes, yRes] = await Promise.all([
      $axios.get("/get-all-teachers?limit=100"),
      $axios.get("/get-all-classrooms?limit=100"),
      $axios.get("/get-all-subjects?limit=100"),
      $axios.get("/get-all-students"),
      $axios.get("/get-all-academic-year"),
    ]);

    const teachers = tRes.data?.data?.teachers ?? [];
    const classes = cRes.data?.data?.classrooms ?? [];
    const subjects = subRes.data?.data?.subjects ?? [];
    const students = Array.isArray(sRes.data?.data)
      ? sRes.data.data
      : (sRes.data?.data?.students ?? []);
    const years = yRes.data?.data ?? [];

    // Teachers by role
    const roles = countBy(teachers, (x) => x.role);
    teacherData.value = {
      labels: Object.keys(roles),
      datasets: [
        { data: Object.values(roles), backgroundColor: PALETTE, borderWidth: 0 },
      ],
    };

    // Classrooms by grade level
    const grades = countBy(classes, (x) => x.gradeLevel?.grade_level_name);
    classData.value = {
      labels: Object.keys(grades),
      datasets: [
        {
          label: "Classes",
          backgroundColor: "#6366f1",
          borderRadius: 6,
          data: Object.values(grades),
        },
      ],
    };

    // Subjects by coefficient
    subjectData.value = {
      labels: subjects.map((s: any) => s.subject_name),
      datasets: [
        {
          label: "Coefficient",
          backgroundColor: "rgba(20, 184, 166, 0.8)",
          borderRadius: 4,
          data: subjects.map((s: any) => Number(s.coefficient) || 0),
        },
      ],
    };

    // Students by ethnicity
    const eth = countBy(students, (x) => x.ethnicity);
    ethnicData.value = {
      labels: Object.keys(eth),
      datasets: [{ data: Object.values(eth), backgroundColor: PALETTE }],
    };

    // Enrolled students per academic year
    const counts = await Promise.all(
      years.map((y: any) =>
        $axios
          .get(`/enrollments?academic_year_id=${y.id}&status=active`)
          .then((r) => (r.data?.data || []).length)
          .catch(() => 0)
      )
    );
    studentData.value = {
      labels: years.map((y: any) => y.title),
      datasets: [
        {
          label: "Enrolled Students",
          borderColor: "#14b8a6",
          backgroundColor: "rgba(20, 184, 166, 0.1)",
          data: counts,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  } catch (error) {
    console.error("reports load error:", error);
  }
});

// Chart Options
const lineOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: "#f1f5f9" }, ticks: { color: "#94a3b8" } },
    x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
  },
};

const doughnutOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: { legend: { display: false } },
};

const barOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, ticks: { color: "#94a3b8", precision: 0 } },
    x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
  },
};

const horizontalBarOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: "#f1f5f9" }, ticks: { color: "#94a3b8" } },
    y: { grid: { display: false }, ticks: { color: "#94a3b8" } },
  },
};

const polarOptions: any = {
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

.intelligence-card {
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
