<template>
  <div class="dashboard-viewport pb-10">
    <!-- ───────── Hero / welcome banner ───────── -->
    <section class="hero-card fade-in mb-6">
      <div class="hero-glow hero-glow--1"></div>
      <div class="hero-glow hero-glow--2"></div>

      <div class="hero-content">
        <div class="hero-text">
          <div class="hero-eyebrow">
            <v-icon size="14" class="mr-1">mdi-view-dashboard-outline</v-icon>
            {{ t("dashboard") }}
          </div>
          <h1 class="hero-title">
            <span class="text-capitalize">{{ t("welcome") }}</span>,
            <span class="text-capitalize">{{ username }}</span> 👋
          </h1>
          <p class="hero-subtitle">
            <v-icon size="14" class="mr-1">mdi-calendar-check</v-icon>
            {{ selectedYearTitle || t("overview") }}
          </p>
        </div>

        <div class="hero-actions">
          <v-select
            v-model="yearId"
            :items="academicYears"
            item-title="title"
            item-value="id"
            :placeholder="t('academic_title')"
            variant="solo"
            bg-color="white"
            density="compact"
            hide-details
            flat
            prepend-inner-icon="mdi-calendar-check"
            class="hero-select"
          ></v-select>
          <div class="hero-buttons">
            <v-btn
              variant="flat"
              class="hero-btn hero-btn--ghost"
              height="40"
              @click="exportList"
            >
              <v-icon icon="mdi-file-download-outline" start size="18"></v-icon>
              {{ t("export") }}
            </v-btn>
            <v-btn
              variant="flat"
              color="accent"
              class="hero-btn text-primary"
              height="40"
              to="/students/add"
            >
              <v-icon icon="mdi-plus" start size="18"></v-icon>
              {{ t("enroll") }}
            </v-btn>
          </div>
        </div>
      </div>
    </section>

    <!-- ───────── KPI cards ───────── -->
    <v-row class="mb-2 fade-in">
      <v-col
        v-for="(stat, index) in stats"
        :key="index"
        cols="6"
        lg="3"
      >
        <v-card
          elevation="0"
          class="stat-card h-100"
          :to="stat.to"
          :style="{ '--stat-color': stat.color, '--stat-tint': stat.tint }"
        >
          <div class="stat-top">
            <div class="stat-icon">
              <v-icon :icon="stat.icon" size="20"></v-icon>
            </div>
            <span class="stat-pill">
              <span class="stat-pulse"></span>
              {{ stat.trendValue }}
            </span>
          </div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.title }}</div>
          <div class="stat-bar"></div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ───────── Teachers & finance ───────── -->
    <v-row class="mb-2 fade-in">
      <v-col cols="12" md="5">
        <v-card elevation="0" class="panel h-100">
          <div class="panel-head">
            <div>
              <div class="panel-title">{{ t("teacher_distribution") }}</div>
              <div class="panel-sub">{{ t("by_department") }}</div>
            </div>
            <span class="panel-chip panel-chip--indigo">
              {{ teacherCount }} {{ t("total") }}
            </span>
          </div>
          <div class="chart-box">
            <div v-if="!teacherDistribution.labels.length" class="chart-empty">
              <v-progress-circular indeterminate size="22" width="2" color="primary" />
              <span>{{ t("loading") }}</span>
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

      <v-col cols="12" md="7">
        <v-card elevation="0" class="panel h-100">
          <div class="panel-head">
            <div>
              <div class="panel-title">{{ t("income_vs_expense") }}</div>
              <div class="panel-sub">{{ t("by_category") }}</div>
            </div>
            <span
              class="panel-chip"
              :class="financeStore.balance >= 0 ? 'panel-chip--green' : 'panel-chip--red'"
            >
              <v-icon size="12" class="mr-1">
                {{ financeStore.balance >= 0 ? "mdi-trending-up" : "mdi-trending-down" }}
              </v-icon>
              {{ financeStore.balance.toLocaleString() }}
            </span>
          </div>
          <div class="chart-box">
            <div v-if="!financeChart.labels.length" class="chart-empty">
              <v-icon size="28" class="mb-1">mdi-chart-bar</v-icon>
              <span>{{ t("no-data") }}</span>
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

    <!-- ───────── Students trend & classes ───────── -->
    <v-row class="mb-2 fade-in">
      <v-col cols="12" lg="8">
        <v-card elevation="0" class="panel h-100">
          <div class="panel-head">
            <div>
              <div class="panel-title">{{ t("active_students_monthly") }}</div>
              <div class="panel-sub">
                {{ selectedYearTitle || t("global-performance-metrics") }}
              </div>
            </div>
            <span class="panel-chip panel-chip--navy">
              {{ yearEnrollments.length }} {{ t("total") }}
            </span>
          </div>
          <div class="chart-box chart-box--tall">
            <div v-if="!chartLabels.length" class="chart-empty">
              <v-progress-circular indeterminate size="22" width="2" color="primary" />
              <span>{{ t("loading") }}</span>
            </div>
            <ClientOnly v-else>
              <DashboardChart
                :labels="studentTrend.labels"
                :values="studentTrend.values"
                :series-label="t('students')"
              />
            </ClientOnly>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card elevation="0" class="panel h-100">
          <div class="panel-head">
            <div>
              <div class="panel-title">{{ t("classes") }}</div>
              <div class="panel-sub">
                {{ selectedYearTitle || t("recent-classrooms") }}
              </div>
            </div>
            <span class="panel-chip panel-chip--navy">
              {{ chartLabels.length }} {{ t("total") }}
            </span>
          </div>
          <div class="chart-box chart-box--tall">
            <div v-if="!chartLabels.length" class="chart-empty">
              <v-progress-circular indeterminate size="22" width="2" color="primary" />
              <span>{{ t("loading") }}</span>
            </div>
            <ClientOnly v-else>
              <DashboardPieChart :labels="chartLabels" :values="chartValues" />
            </ClientOnly>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ───────── Latest students ───────── -->
    <v-row class="fade-in">
      <v-col cols="12">
        <v-card elevation="0" class="panel panel--flush">
          <div class="panel-head panel-head--bordered">
            <div>
              <div class="panel-title">{{ t("students") }}</div>
              <div class="panel-sub">{{ t("latest-registered-students") }}</div>
            </div>
            <div class="d-flex align-center ga-2">
              <span class="panel-chip panel-chip--navy">
                {{ studentCount }} {{ t("total") }}
              </span>
              <v-btn
                variant="text"
                color="primary"
                size="small"
                class="font-weight-bold d-none d-sm-inline-flex"
                to="/students"
                append-icon="mdi-arrow-right"
              >
                {{ t("all") }}
              </v-btn>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="!flaggedStudents.length" class="chart-empty py-10">
            <v-icon size="28" class="mb-1">mdi-account-search-outline</v-icon>
            <span>{{ t("no-data") }}</span>
          </div>

          <template v-else>
            <!-- Desktop / tablet: table -->
            <div class="table-wrap d-none d-sm-block">
              <v-table class="premium-table">
                <thead>
                  <tr>
                    <th class="pl-6">{{ t("name") }}</th>
                    <th>{{ t("gender") }}</th>
                    <th>{{ t("status") }}</th>
                    <th class="text-right pr-6">{{ t("action") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(student, i) in flaggedStudents" :key="i">
                    <td class="pl-6">
                      <div class="d-flex align-center py-2">
                        <div class="avatar-chip mr-3">
                          {{ (student.name || "?").charAt(0) }}
                        </div>
                        <div>
                          <div class="cell-title">{{ student.name }}</div>
                          <div class="cell-sub">{{ student.id }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="cell-title text-capitalize">{{ student.grade }}</span>
                    </td>
                    <td>
                      <span
                        class="status-pill text-capitalize"
                        :style="{ '--status-color': student.statusColor }"
                      >
                        <span class="status-dot"></span>
                        {{ student.status }}
                      </span>
                    </td>
                    <td class="text-right pr-6">
                      <v-btn
                        variant="tonal"
                        color="primary"
                        size="small"
                        class="font-weight-bold"
                        to="/students"
                      >
                        {{ t("view") }}
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>

            <!-- Phone: stacked list -->
            <div class="mobile-list d-sm-none">
              <NuxtLink
                v-for="(student, i) in flaggedStudents"
                :key="i"
                to="/students"
                class="mobile-row"
              >
                <div class="avatar-chip mr-3">
                  {{ (student.name || "?").charAt(0) }}
                </div>
                <div class="flex-grow-1 min-w-0">
                  <div class="cell-title text-truncate">{{ student.name }}</div>
                  <div class="cell-sub">
                    {{ student.id }} · <span class="text-capitalize">{{ student.grade }}</span>
                  </div>
                </div>
                <span
                  class="status-pill text-capitalize ml-2"
                  :style="{ '--status-color': student.statusColor }"
                >
                  <span class="status-dot"></span>
                  {{ student.status }}
                </span>
                <v-icon size="18" class="ml-2 text-medium-emphasis">mdi-chevron-right</v-icon>
              </NuxtLink>
              <NuxtLink to="/students" class="mobile-all">
                {{ t("all") }}
                <v-icon size="16" class="ml-1">mdi-arrow-right</v-icon>
              </NuxtLink>
            </div>
          </template>
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
const username = useCookie<string>("username", { default: () => "Admin" });

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
    value: studentCount.value.toLocaleString(),
    trendValue: t("live"),
    icon: "mdi-account-multiple",
    color: "#0A3154",
    tint: "#E6ECF2",
    to: "/students",
  },
  {
    title: t("teachers"),
    value: teacherCount.value.toLocaleString(),
    trendValue: t("live"),
    icon: "mdi-account-tie",
    color: "#4F46E5",
    tint: "#EEF2FF",
    to: "/teachers",
  },
  {
    title: t("classes"),
    value: classCount.value.toLocaleString(),
    trendValue: t("live"),
    icon: "mdi-google-classroom",
    color: "#D97706",
    tint: "#FFFBEB",
    to: "/class",
  },
  {
    title: t("subject"),
    value: subjectCount.value.toLocaleString(),
    trendValue: t("live"),
    icon: "mdi-book-open-variant",
    color: "#059669",
    tint: "#ECFDF5",
    to: "/subjects",
  },
]);

const statusColorMap: Record<string, string> = {
  active: "#10B981",
  inactive: "#F59E0B",
  block: "#EF4444",
};

const flaggedStudents = computed(() =>
  recentStudents.value.map((s) => ({
    id: s.student_id || "—",
    name: `${s.first_name || ""} ${s.last_name || ""}`.trim() || "—",
    grade: s.gender ? String(s.gender) : "—",
    status: s.status || "active",
    statusColor: statusColorMap[String(s.status)] || "#0A3154",
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
/* ───────── Layout ───────── */
.dashboard-viewport {
  max-width: 1400px;
  margin: 0 auto;
}

/* ───────── Hero banner ───────── */
.hero-card {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  padding: 28px 28px;
  color: #fff;
  background: linear-gradient(135deg, #0a3154 0%, #0c3d68 55%, #0f4c7a 100%);
  box-shadow: 0 18px 40px -20px rgba(10, 49, 84, 0.55);
}
.hero-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(2px);
}
.hero-glow--1 {
  width: 320px;
  height: 320px;
  right: -90px;
  top: -140px;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.35) 0%, rgba(45, 212, 191, 0) 70%);
}
.hero-glow--2 {
  width: 260px;
  height: 260px;
  left: 30%;
  bottom: -180px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 70%);
}
.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 4px 10px;
  margin-bottom: 12px;
}
.hero-title {
  font-size: 22px;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: 0 0 6px;
}
.hero-subtitle {
  display: inline-flex;
  align-items: center;
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.72);
}
.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.hero-select {
  width: 100%;
}
.hero-select :deep(.v-field) {
  border-radius: 10px !important;
  box-shadow: 0 8px 20px -12px rgba(0, 0, 0, 0.5);
}
.hero-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.hero-btn {
  border-radius: 10px !important;
  font-weight: 800 !important;
  letter-spacing: 0 !important;
  text-transform: none !important;
}
.hero-btn--ghost {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(6px);
}
.hero-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.18) !important;
}

@media (min-width: 960px) {
  .hero-card {
    padding: 32px 36px;
  }
  .hero-title {
    font-size: 28px;
  }
  .hero-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .hero-actions {
    flex-direction: row;
    align-items: center;
    width: auto;
  }
  .hero-select {
    width: 240px;
  }
  .hero-buttons {
    display: flex;
  }
}

/* ───────── KPI cards ───────── */
.stat-card {
  position: relative;
  overflow: hidden;
  padding: 18px 18px 20px;
  border-radius: 16px !important;
  background: #fff;
  border: 1px solid #eef2f7;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-3px);
  border-color: transparent;
  box-shadow: 0 16px 32px -18px rgba(15, 23, 42, 0.35);
}
.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--stat-color);
  background: var(--stat-tint);
}
.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #16a34a;
  background: #f0fdf4;
  border-radius: 999px;
  padding: 3px 8px;
}
.stat-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6);
  animation: pulse 1.8s infinite;
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.55);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}
.stat-value {
  font-size: 26px;
  font-weight: 900;
  line-height: 1.1;
  color: #0f172a;
  letter-spacing: -0.02em;
}
.stat-label {
  margin-top: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}
.stat-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--stat-color), transparent);
  opacity: 0.7;
}
@media (max-width: 599px) {
  .stat-card {
    padding: 14px 14px 16px;
  }
  .stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
  }
  .stat-value {
    font-size: 22px;
  }
  .stat-label {
    font-size: 12px;
  }
  .stat-pill {
    padding: 3px 6px;
  }
}

/* ───────── Panels (chart & table cards) ───────── */
.panel {
  padding: 20px;
  border-radius: 16px !important;
  background: #fff;
  border: 1px solid #eef2f7;
  overflow: hidden;
}
.panel--flush {
  padding: 0;
}
.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.panel--flush .panel-head {
  padding: 20px;
  margin-bottom: 0;
}
.panel-head--bordered {
  border-bottom: 1px solid #f1f5f9;
}
.panel-title {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.3;
}
.panel-sub {
  font-size: 12.5px;
  font-weight: 500;
  color: #64748b;
  margin-top: 2px;
}
.panel-chip {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 800;
  border-radius: 999px;
  padding: 4px 10px;
  color: #0a3154;
  background: #e6ecf2;
}
.panel-chip--navy {
  color: #0a3154;
  background: #e6ecf2;
}
.panel-chip--indigo {
  color: #4338ca;
  background: #eef2ff;
}
.panel-chip--green {
  color: #15803d;
  background: #f0fdf4;
}
.panel-chip--red {
  color: #b91c1c;
  background: #fef2f2;
}
@media (min-width: 960px) {
  .panel {
    padding: 24px;
  }
  .panel--flush {
    padding: 0;
  }
  .panel--flush .panel-head {
    padding: 22px 24px;
  }
}

/* Chart area: shorter on phones, taller on desktop */
.chart-box {
  position: relative;
  height: 240px;
}
.chart-box--tall {
  height: 260px;
}
@media (min-width: 960px) {
  .chart-box {
    height: 280px;
  }
  .chart-box--tall {
    height: 320px;
  }
}
.chart-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  border: 1.5px dashed #e2e8f0;
  border-radius: 12px;
}

/* ───────── Table ───────── */
.table-wrap {
  overflow-x: auto;
}
.premium-table {
  background: transparent !important;
  min-width: 560px;
}
.premium-table :deep(th) {
  background: #f8fafc !important;
  height: 44px !important;
  border-bottom: 1px solid #f1f5f9 !important;
  font-size: 11px !important;
  font-weight: 800 !important;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b !important;
  white-space: nowrap;
}
.premium-table :deep(td) {
  border-bottom: 1px solid #f1f5f9 !important;
  height: 60px !important;
}
.premium-table :deep(tbody tr:last-child td) {
  border-bottom: none !important;
}
.premium-table :deep(tbody tr:hover) {
  background: #f8fafc;
}
.avatar-chip {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 900;
  color: #0a3154;
  background: #e6ecf2;
  text-transform: uppercase;
}
.cell-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
.cell-sub {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
}
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  color: var(--status-color);
  background: color-mix(in srgb, var(--status-color) 12%, #fff);
  white-space: nowrap;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--status-color);
}

/* Phone list */
.mobile-list {
  display: flex;
  flex-direction: column;
}
.mobile-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s ease;
}
.mobile-row:active {
  background: #f8fafc;
}
.mobile-all {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  font-size: 13px;
  font-weight: 800;
  color: #0a3154;
  text-decoration: none;
}
.min-w-0 {
  min-width: 0;
}

/* ───────── Motion ───────── */
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
  animation: fadeIn 0.5s ease-out both;
}
.fade-in:nth-child(2) { animation-delay: 0.05s; }
.fade-in:nth-child(3) { animation-delay: 0.1s; }
.fade-in:nth-child(4) { animation-delay: 0.15s; }
.fade-in:nth-child(5) { animation-delay: 0.2s; }
</style>
