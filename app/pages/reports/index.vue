<template>
  <div class="page">
    <PageHeader
      :title="t('analytics')"
      :subtitle="t('global-performance-metrics')"
      icon="mdi-chart-box-outline"
      :breadcrumbs="breadcrumbs"
    />

    <!-- ───────── Enrollment trend & faculty ───────── -->
    <v-row class="mb-2 fade-in">
      <!-- 1. Student Enrollment Trend (Line) -->
      <v-col cols="12" lg="8">
        <v-card elevation="0" class="panel h-100">
          <div class="panel-head">
            <div class="min-w-0">
              <div class="panel-title">{{ t("student-enrollment-trend") }}</div>
              <div class="panel-sub">{{ t("annual-enrollment-growth") }}</div>
            </div>
            <span class="panel-chip panel-chip--green">
              <v-icon size="12" class="mr-1">mdi-trending-up</v-icon>
              {{ t("enrollment-growth-badge") }}
            </span>
          </div>
          <div class="chart-box chart-box--tall">
            <div v-if="!studentData.labels.length" class="chart-empty">
              <v-progress-circular indeterminate size="22" width="2" color="primary" />
              <span>{{ t("loading") }}</span>
            </div>
            <ClientOnly v-else>
              <Line :data="studentData" :options="lineOptions" />
            </ClientOnly>
          </div>
        </v-card>
      </v-col>

      <!-- 2. Teacher Distribution (Doughnut) -->
      <v-col cols="12" lg="4">
        <v-card elevation="0" class="panel h-100">
          <div class="panel-head">
            <div class="min-w-0">
              <div class="panel-title">{{ t("faculty-composition") }}</div>
              <div class="panel-sub">{{ t("teacher-distribution-by-department") }}</div>
            </div>
            <span class="panel-chip panel-chip--indigo">
              {{ teacherData.labels.length }} {{ t("total") }}
            </span>
          </div>
          <div class="chart-box">
            <div v-if="!teacherData.labels.length" class="chart-empty">
              <v-icon size="28" class="mb-1">mdi-chart-donut</v-icon>
              <span>{{ t("no-data") }}</span>
            </div>
            <ClientOnly v-else>
              <Doughnut :data="teacherData" :options="doughnutOptions" />
            </ClientOnly>
          </div>
          <div v-if="teacherData.labels.length" class="legend-list">
            <div
              v-for="(label, i) in teacherData.labels"
              :key="i"
              class="legend-row"
            >
              <span
                class="legend-dot"
                :style="{ background: teacherData.datasets[0].backgroundColor[i] }"
              ></span>
              <span class="legend-label text-capitalize">{{ label }}</span>
              <span class="legend-value">{{ teacherData.datasets[0].data[i] }}</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ───────── Classes & subjects ───────── -->
    <v-row class="mb-2 fade-in">
      <!-- 3. Class Performance (Bar) -->
      <v-col cols="12" md="6">
        <v-card elevation="0" class="panel h-100">
          <div class="panel-head">
            <div class="min-w-0">
              <div class="panel-title">{{ t("class-proficiency-audit") }}</div>
              <div class="panel-sub">{{ t("average-score-distribution") }}</div>
            </div>
            <span class="panel-chip">
              {{ classData.labels.length }} {{ t("total") }}
            </span>
          </div>
          <div class="chart-box">
            <div v-if="!classData.labels.length" class="chart-empty">
              <v-icon size="28" class="mb-1">mdi-chart-bar</v-icon>
              <span>{{ t("no-data") }}</span>
            </div>
            <ClientOnly v-else>
              <Bar :data="classData" :options="barOptions" />
            </ClientOnly>
          </div>
        </v-card>
      </v-col>

      <!-- 4. Subject Popularity (Horizontal Bar) -->
      <v-col cols="12" md="6">
        <v-card elevation="0" class="panel h-100">
          <div class="panel-head">
            <div class="min-w-0">
              <div class="panel-title">{{ t("subject-engagement") }}</div>
              <div class="panel-sub">{{ t("student-enrollment-volume-by-subject") }}</div>
            </div>
            <span class="panel-chip panel-chip--teal">
              {{ subjectData.labels.length }} {{ t("subjects") }}
            </span>
          </div>
          <div class="chart-box">
            <div v-if="!subjectData.labels.length" class="chart-empty">
              <v-icon size="28" class="mb-1">mdi-chart-timeline-variant</v-icon>
              <span>{{ t("no-data") }}</span>
            </div>
            <ClientOnly v-else>
              <Bar :data="subjectData" :options="horizontalBarOptions" />
            </ClientOnly>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ───────── Demographic diversity (Polar Area) ───────── -->
    <v-row class="fade-in">
      <v-col cols="12">
        <v-card elevation="0" class="panel">
          <div class="panel-head">
            <div class="d-flex align-center ga-3 min-w-0">
              <div class="page-icon page-icon--amber">
                <v-icon size="20">mdi-account-group-outline</v-icon>
              </div>
              <div class="min-w-0">
                <div class="panel-title">{{ t("demographic-diversity") }}</div>
                <div class="panel-sub">{{ t("ethnic-group-distribution") }}</div>
              </div>
            </div>
            <span class="panel-chip panel-chip--amber">
              {{ ethnicData.labels.length }} {{ t("total") }}
            </span>
          </div>

          <v-row>
            <v-col cols="12" md="4" class="d-flex align-center justify-center">
              <div class="chart-box w-100">
                <div v-if="!ethnicData.labels.length" class="chart-empty">
                  <v-icon size="28" class="mb-1">mdi-chart-arc</v-icon>
                  <span>{{ t("no-data") }}</span>
                </div>
                <ClientOnly v-else>
                  <PolarArea :data="ethnicData" :options="polarOptions" />
                </ClientOnly>
              </div>
            </v-col>
            <v-col cols="12" md="8">
              <div class="breakdown h-100">
                <div class="breakdown-title">
                  {{ t("detailed-enrollment-breakdown") }}
                </div>
                <div v-if="!ethnicData.labels.length" class="chart-empty py-6">
                  <span>{{ t("no-data") }}</span>
                </div>
                <div v-else class="breakdown-grid">
                  <div
                    v-for="(val, i) in ethnicData.datasets[0].data"
                    :key="i"
                    class="breakdown-tile"
                    :style="{ '--tile-color': ethnicData.datasets[0].backgroundColor[i] }"
                  >
                    <div class="breakdown-label">{{ ethnicData.labels[i] }}</div>
                    <div class="breakdown-value">
                      {{ val }}
                      <span class="breakdown-unit">{{ t("students-abbr") }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
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

// Canvas text ignores page CSS — set the Lao-capable font on Chart.js directly.
ChartJS.defaults.font.family = "'Noto Sans Lao', 'Inter', sans-serif";

const { t } = useI18n();
const { $axios } = useNuxtApp();

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("analytics"), disabled: true, to: "/reports" },
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
      label: t("enrolled-students"),
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
    { label: t("classes"), backgroundColor: "#6366f1", borderRadius: 6, data: [] },
  ],
});

const subjectData = ref<any>({
  labels: [],
  datasets: [
    {
      label: t("coefficient"),
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
          label: t("classes"),
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
          label: t("coefficient"),
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
          label: t("enrolled-students"),
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
/* Chart canvases need a fixed-height box (maintainAspectRatio is off) */
.chart-box {
  position: relative;
  width: 100%;
  height: 240px;
}
.chart-box--tall {
  height: 300px;
}
@media (max-width: 599px) {
  .chart-box {
    height: 220px;
  }
  .chart-box--tall {
    height: 240px;
  }
}

/* Amber variant of the shared page icon for the demographics card */
.page-icon--amber {
  color: #b45309;
  background: #fffbeb;
}

/* Doughnut legend */
.legend-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
}
.legend-dot {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.legend-label {
  flex: 1 1 auto;
  min-width: 0;
  font-weight: 600;
  color: var(--ds-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.legend-value {
  font-weight: 800;
  color: var(--ds-text);
}

/* Ethnicity breakdown tiles */
.breakdown {
  padding: 16px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid var(--ds-border-soft);
}
.breakdown-title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ds-faint);
  margin-bottom: 12px;
}
.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
}
.breakdown-tile {
  position: relative;
  padding: 12px 12px 12px 16px;
  background: #fff;
  border: 1px solid var(--ds-border);
  border-radius: 12px;
  overflow: hidden;
}
.breakdown-tile::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--tile-color, var(--ds-navy));
}
.breakdown-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--tile-color, var(--ds-navy));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.breakdown-value {
  margin-top: 4px;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.1;
  color: var(--ds-text);
}
.breakdown-unit {
  font-size: 10px;
  font-weight: 700;
  color: var(--ds-faint);
}
</style>
