<template>
  <div class="dashboard-viewport pb-12">
    <!-- Quick Actions Bar (Replacement for large header) -->
    <div
      class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3 mb-6 fade-in"
    >
      <div style="min-width: 260px">
        <v-select
          v-model="yearId"
          :items="academicYears"
          item-title="title"
          item-value="id"
          :placeholder="t('academic_title')"
          variant="outlined"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-calendar-check"
        ></v-select>
      </div>
      <div class="action-stack d-flex ga-2">
        <v-btn
          variant="flat"
          color="white"
          class="modern-action-btn secondary border"
          height="36"
          @click="exportList"
        >
          <v-icon icon="mdi-file-download-outline" start size="16"></v-icon>
          {{ t("export") }}
        </v-btn>
        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="36"
          to="/students/add"
        >
          <v-icon icon="mdi-plus" start size="16"></v-icon>
          {{ t("enroll") }}
        </v-btn>
      </div>
    </div>

    <!-- Section: High-Signal Metrics -->
    <v-row class="mb-6 ga-y-4">
      <v-col
        cols="12"
        sm="6"
        lg="3"
        v-for="(stat, index) in stats"
        :key="index"
      >
        <v-card elevation="0" class="metric-card h-100 overflow-hidden">
          <div class="pa-4">
            <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center ga-3">
            <div :class="`metric-icon-box bg-${stat.iconColor}-lighten-5`">
                <v-icon
                  :icon="stat.icon"
                  :color="stat.iconColor"
                  size="18"
                ></v-icon>
                
              </div>
              <div class="metric-info">
              <div class="text-detail mb-1">
                {{ stat.title }}
              </div>
              <div class="text-title">
                {{ stat.value }}
              </div>
            </div>
          </div>
              <div class="trend-badge" :class="stat.trendUp ? 'up' : 'down'">
                <v-icon
                  :icon="
                    stat.trendUp
                      ? 'mdi-arrow-top-right'
                      : 'mdi-arrow-bottom-left'
                  "
                  size="10"
                  class="mr-1"
                ></v-icon>
                {{ stat.trendValue }}
              </div>
            </div>

         
          </div>
          <div
            class="metric-footer-line"
            :style="`background: var(--v-${stat.iconColor}-base)`"
          ></div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section: Teacher & Financial charts -->
    <v-row class="mb-6 ga-y-4">
      <!-- Teacher distribution (Doughnut) -->
      <v-col cols="12" md="5">
        <v-card elevation="0" class="intelligence-card h-100 pa-6">
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <div class="text-title mb-1">{{ t("teacher_distribution") }}</div>
              <div class="text-detail">{{ t("by_department") }}</div>
            </div>
            <v-chip
              color="indigo-lighten-5"
              class="text-indigo font-weight-black"
              size="x-small"
              variant="flat"
            >
              {{ teacherCount }} {{ t("total") }}
            </v-chip>
          </div>
          <div style="height: 280px">
            <div
              v-if="!teacherDistribution.labels.length"
              class="d-flex align-center justify-center text-detail"
              style="height: 100%"
            >
              {{ t("loading") }}
            </div>
            <ClientOnly v-else>
              <DashboardDoughnutChart
                :labels="teacherDistribution.labels"
                :values="teacherDistribution.values"
              />
            </ClientOnly>
          </div>
        </v-card>
      </v-col>

      <!-- Income vs Expense (Bar) -->
      <v-col cols="12" md="7">
        <v-card elevation="0" class="intelligence-card h-100 pa-6">
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <div class="text-title mb-1">{{ t("income_vs_expense") }}</div>
              <div class="text-detail">{{ t("by_category") }}</div>
            </div>
            <v-chip
              :color="financeStore.balance >= 0 ? 'green-lighten-5' : 'red-lighten-5'"
              :class="
                financeStore.balance >= 0
                  ? 'text-green-darken-2'
                  : 'text-red-darken-2'
              "
              size="x-small"
              variant="flat"
              class="font-weight-black"
            >
              {{ financeStore.balance.toLocaleString() }}
            </v-chip>
          </div>
          <div style="height: 280px">
            <div
              v-if="!financeChart.labels.length"
              class="d-flex align-center justify-center text-detail"
              style="height: 100%"
            >
              {{ t("no-data") }}
            </div>
            <ClientOnly v-else>
              <DashboardBarChart
                :labels="financeChart.labels"
                :datasets="financeChart.datasets"
              />
            </ClientOnly>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section: Primary Intelligence Area -->
    <v-row>
      <!-- Intelligence Column -->
      <v-col cols="12" lg="8">
        <!-- Academic Performance Visualization -->
        <v-card elevation="0" class="intelligence-card h-100">
          <div class="pa-6">
            <div class="d-flex justify-space-between align-center mb-6">
              <div>
                <div class="text-title mb-1">{{ t("active_students_monthly") }}</div>
                <div class="text-detail">
                  {{ selectedYearTitle || t("global-performance-metrics") }}
                </div>
              </div>
              <v-chip
                color="primary-lighten-5"
                class="text-primary font-weight-black"
                size="x-small"
                variant="flat"
              >
                {{ yearEnrollments.length }} {{ t("total") }}
              </v-chip>
            </div>

            <div class="chart-container" style="height: 300px">
              <div
                v-if="!chartLabels.length"
                class="d-flex align-center justify-center text-detail"
                style="height: 100%"
              >
                {{ t("loading") }}
              </div>
              <ClientOnly v-else>
                <DashboardChart
                  :labels="studentTrend.labels"
                  :values="studentTrend.values"
                  :series-label="t('students')"
                />
              </ClientOnly>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Contextual Utilities Column -->
      <v-col cols="12" lg="4">
        <!-- Class distribution (Pie) -->
        <v-card elevation="0" class="utility-card pb-4 h-100">
          <div class="pa-6 pb-2">
            <h3 class="text-title mb-1">
              {{ t("classes") }}
              <span v-if="selectedYearTitle" class="text-detail"
                >— {{ selectedYearTitle }}</span
              >
            </h3>
            <p class="text-detail mb-6">{{ t("recent-classrooms") }}</p>

            <div style="height: 300px">
              <div
                v-if="!chartLabels.length"
                class="d-flex align-center justify-center text-detail"
                style="height: 100%"
              >
                {{ t("loading") }}
              </div>
              <ClientOnly v-else>
                <DashboardPieChart :labels="chartLabels" :values="chartValues" />
              </ClientOnly>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section: Latest registered students (full width) -->
    <v-row class="mt-2">
      <v-col cols="12">
        <v-card elevation="0" class="intelligence-card overflow-hidden">
          <header
            class="pa-6 d-flex justify-space-between align-center border-b"
          >
            <div>
              <div class="text-title mb-1">{{ t("students") }}</div>
              <div class="text-detail">{{ t("latest-registered-students") }}</div>
            </div>
            <v-chip
              color="primary"
              variant="flat"
              size="x-small"
              class="font-weight-black px-2"
            >
              {{ studentCount }} {{ t("total") }}
            </v-chip>
          </header>

          <v-table class="premium-table">
            <thead>
              <tr>
                <th class="text-detail">{{ t("stakeholder") }}</th>
                <th class="text-detail">{{ t("context") }}</th>
                <th class="text-detail">{{ t("alert") }}</th>
                <th class="text-right text-detail pr-6">{{ t("action") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(student, i) in flaggedStudents"
                :key="i"
                class="table-row-hover"
              >
                <td class="pl-6">
                  <div class="d-flex align-center py-3">
                    <v-avatar
                      size="32"
                      color="primary-lighten-5"
                      class="mr-3 elevation-1 border-white"
                    >
                      <span class="text-caption font-weight-black text-primary">{{
                        (student.name || "?").charAt(0)
                      }}</span>
                    </v-avatar>
                    <div>
                      <div class="text-title-small">{{ student.name }}</div>
                      <div class="text-detail-tiny">{{ student.id }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="text-title-small">{{ student.grade }}</div>
                </td>
                <td>
                  <div class="d-flex align-center">
                    <div :class="`status-dot bg-${student.statusColor}`"></div>
                    <span
                      :class="`text-detail-tiny font-weight-black text-uppercase text-${student.statusColor}`"
                    >
                      {{ student.status }}
                    </span>
                  </div>
                </td>
                <td class="text-right pr-6">
                  <v-btn
                    variant="tonal"
                    color="primary"
                    size="x-small"
                    class="rounded-0 font-weight-bold text-none"
                    height="28"
                    to="/students"
                  >
                    {{ t("view") }}
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import DashboardChart from "~/components/DashboardChart.vue";
import DashboardPieChart from "~/components/DashboardPieChart.vue";
import DashboardBarChart from "~/components/DashboardBarChart.vue";
import DashboardDoughnutChart from "~/components/DashboardDoughnutChart.vue";
import { useFinanceStore } from "~/stores/apiFinance";
const { t } = useI18n();

const { $axios } = useNuxtApp();
const financeStore = useFinanceStore();

const studentCount = ref(0);
const teacherCount = ref(0);
const classCount = ref(0);
const subjectCount = ref(0);
const recentStudents = ref<any[]>([]);
const academicYears = ref<any[]>([]);
const teachers = ref<any[]>([]);

// Academic-year scoped state (merged from the former /overview page).
const yearId = ref<string | null>(null);
const yearClassrooms = ref<any[]>([]);
const yearEnrollments = ref<any[]>([]);

onMounted(async () => {
  try {
    const [sRes, tRes, cRes, subRes, yRes] = await Promise.all([
      $axios.get("/get-all-students"),
      $axios.get("/get-all-teachers?limit=100"),
      $axios.get("/get-all-classrooms?limit=100"),
      $axios.get("/get-all-subjects?limit=100"),
      $axios.get("/get-all-academic-year"),
      financeStore.fetchFinances(),
    ]);

    const students = Array.isArray(sRes.data?.data)
      ? sRes.data.data
      : (sRes.data?.data?.students ?? []);
    studentCount.value = students.length;
    recentStudents.value = students.slice(0, 5);

    teachers.value = tRes.data?.data?.teachers ?? [];
    teacherCount.value =
      tRes.data?.data?.pagination?.total ?? teachers.value.length;

    const classes = cRes.data?.data?.classrooms ?? [];
    classCount.value = cRes.data?.data?.pagination?.total ?? classes.length;

    subjectCount.value = subRes.data?.data?.pagination?.total ?? 0;

    academicYears.value = yRes.data?.data ?? [];
    // Default to the latest academic year (active first, else newest start).
    if (academicYears.value.length) {
      const latest = [...academicYears.value].sort((a: any, b: any) => {
        const act =
          (b.status === "active" ? 1 : 0) - (a.status === "active" ? 1 : 0);
        if (act !== 0) return act;
        return (
          new Date(b.start_date || 0).getTime() -
          new Date(a.start_date || 0).getTime()
        );
      })[0];
      yearId.value = latest.id;
    }
  } catch (error) {
    console.error("dashboard load error:", error);
  }
});

// Reload the year-scoped classroom breakdown whenever the selected year changes.
const loadYear = async () => {
  if (!yearId.value) return;
  try {
    const [cRes, eRes] = await Promise.all([
      $axios.get(
        `/get-all-classrooms?academic_year_id=${yearId.value}&limit=100`
      ),
      $axios.get(`/enrollments?academic_year_id=${yearId.value}&status=active`),
    ]);
    yearClassrooms.value = cRes.data?.data?.classrooms ?? [];
    yearEnrollments.value = eRes.data?.data ?? [];
  } catch (error) {
    console.error("dashboard year load error:", error);
  }
};

watch(yearId, loadYear);

const selectedYearTitle = computed(
  () => academicYears.value.find((y) => y.id === yearId.value)?.title || ""
);

// Count of active enrolled students per classroom for the selected year.
const countByClass = computed(() => {
  const map: Record<string, number> = {};
  for (const e of yearEnrollments.value) {
    map[e.class_id] = (map[e.class_id] || 0) + 1;
  }
  return map;
});

// Line chart: enrolled students per class for the selected academic year.
const chartLabels = computed(() =>
  yearClassrooms.value.map(
    (c) => c.classroom_name || c.classroom_code || "—"
  )
);
const chartValues = computed(() =>
  yearClassrooms.value.map((c) => countByClass.value[c.id] || 0)
);

const selectedYear = computed(() =>
  academicYears.value.find((y) => y.id === yearId.value)
);

// Line chart: cumulative count of active students per month across the selected
// academic year, bucketed by each enrollment's created_at (starting from the
// academic year's start month).
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const studentTrend = computed(() => {
  const start = selectedYear.value?.start_date
    ? new Date(selectedYear.value.start_date)
    : null;
  const startMonth = start ? start.getMonth() : 0;
  const startYear = start ? start.getFullYear() : new Date().getFullYear();

  const monthly = Array(12).fill(0);
  for (const e of yearEnrollments.value) {
    const d = e.created_at ? new Date(e.created_at) : null;
    if (!d || Number.isNaN(d.getTime())) continue;
    let idx = (d.getFullYear() - startYear) * 12 + (d.getMonth() - startMonth);
    idx = Math.min(11, Math.max(0, idx));
    monthly[idx]++;
  }

  const values: number[] = [];
  const labels: string[] = [];
  let running = 0;
  for (let i = 0; i < 12; i++) {
    running += monthly[i] ?? 0;
    values.push(running);
    labels.push(MONTHS_SHORT[(startMonth + i) % 12] ?? "");
  }
  return { labels, values };
});

// Doughnut: teachers grouped by department (falls back to position / gender).
const teacherDistribution = computed(() => {
  const map: Record<string, number> = {};
  for (const tc of teachers.value) {
    const key =
      tc.department || tc.position || tc.gender || t("unassigned");
    map[key] = (map[key] || 0) + 1;
  }
  return {
    labels: Object.keys(map),
    values: Object.values(map),
  };
});

// Bar: income vs expense per category, from the finance ledger.
const financeChart = computed(() => {
  const income: Record<string, number> = {};
  const expense: Record<string, number> = {};
  for (const f of financeStore.finances) {
    const cat = f.category || t("other");
    const amt = Number(f.amount || 0);
    if (f.type === "expense") expense[cat] = (expense[cat] || 0) + amt;
    else income[cat] = (income[cat] || 0) + amt;
  }
  const labels = Array.from(
    new Set([...Object.keys(income), ...Object.keys(expense)])
  );
  return {
    labels,
    datasets: [
      {
        label: t("income"),
        data: labels.map((c) => income[c] || 0),
        color: "#10b981",
      },
      {
        label: t("expense"),
        data: labels.map((c) => expense[c] || 0),
        color: "#ef4444",
      },
    ],
  };
});

const stats = computed(() => [
  {
    title: t("students"),
    value: String(studentCount.value),
    trendUp: true,
    trendValue: t("live"),
    icon: "mdi-account-multiple",
    iconColor: "primary",
  },
  {
    title: t("teachers"),
    value: String(teacherCount.value),
    trendUp: true,
    trendValue: t("live"),
    icon: "mdi-account-tie",
    iconColor: "indigo",
  },
  {
    title: t("classes"),
    value: String(classCount.value),
    trendUp: true,
    trendValue: t("live"),
    icon: "mdi-google-classroom",
    iconColor: "amber-darken-2",
  },
  {
    title: t("subject"),
    value: String(subjectCount.value),
    trendUp: true,
    trendValue: t("live"),
    icon: "mdi-book-open-variant",
    iconColor: "emerald-darken-1",
  },
]);

const statusColorMap: Record<string, string> = {
  active: "emerald",
  inactive: "amber",
  block: "rose",
};

const flaggedStudents = computed(() =>
  recentStudents.value.map((s) => ({
    id: s.student_id || "—",
    name: `${s.first_name || ""} ${s.last_name || ""}`.trim() || "—",
    grade: s.gender ? String(s.gender) : "—",
    status: s.status || "active",
    statusColor: statusColorMap[String(s.status)] || "primary",
  }))
);

const { exportRows } = useExcel();
const exportList = () =>
  exportRows(
    "recent-students",
    [
      { label: t("student-id"), key: "id" },
      { label: t("name"), key: "name" },
      { label: t("gender"), key: "grade" },
      { label: t("status"), key: "status" },
    ],
    flaggedStudents.value
  );
</script>

<style scoped>
/* Core Layout */
.dashboard-viewport {
  max-width: 1400px;
  margin: 0 auto;
}

/* Metric Cards */
.metric-card {
  background: white;
  border: 1px solid #f1f5f9;
}

.metric-icon-box {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trend-badge {
  display: flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 800;
}

.trend-badge.up {
  background: #f0fdf4;
  color: #16a34a;
}
.trend-badge.down {
  background: #fef2f2;
  color: #dc2626;
}

.metric-footer-line {
  height: 3px;
  width: 100%;
  opacity: 0.15;
}

/* Intelligence Cards */
.intelligence-card {
  background: white;
  border: 1px solid #f1f5f9;
}

/* Premium Table */
.premium-table {
  background: transparent !important;
}

.premium-table :deep(th) {
  background: #f8fafc !important;
  height: 44px !important;
  border: none !important;
}

.premium-table :deep(td) {
  border-bottom: 1px solid #f1f5f9 !important;
  height: 56px !important;
}

.status-dot {
  width: 6px;
  height: 6px;
  margin-right: 8px;
}

/* Utility Cards & Sidebar */
.utility-card {
  background: white;
  border: 1px solid #f1f5f9;
}

.utility-card.dark {
  background: #0f172a !important;
}

/* Schedule Items */
.schedule-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.date-shard {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.date-shard .day {
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
  color: white;
}
.date-shard .month {
  font-size: 8px;
  font-weight: 800;
  opacity: 0.6;
  color: white;
}

.schedule-item .title {
  font-size: 12px;
  font-weight: 700;
  color: white;
  margin-bottom: 2px;
}
.schedule-item .time {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

/* Feed System */
.feed-item {
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
}

.feed-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
}

.feed-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.feed-line {
  width: 1.5px;
  background: #f1f5f9;
  flex-grow: 1;
  margin-top: 6px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}
</style>
