<template>
  <div class="dashboard-viewport pb-12">
    <!-- Quick Actions Bar (Replacement for large header) -->
    <div class="d-flex justify-end mb-6 fade-in">
      <div class="action-stack d-flex ga-2">
        <v-btn
          variant="flat"
          color="white"
          class="modern-action-btn secondary border"
          height="36"
        >
          <v-icon icon="mdi-file-download-outline" start size="16"></v-icon>
          Export
        </v-btn>
        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="36"
        >
          <v-icon icon="mdi-plus" start size="16"></v-icon>
          Action
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

    <!-- Section: Primary Intelligence Area -->
    <v-row>
      <!-- Intelligence Column -->
      <v-col cols="12" lg="8">
        <!-- Academic Performance Visualization -->
        <v-card elevation="0" class="intelligence-card mb-6">
          <div class="pa-6">
            <div class="d-flex justify-space-between align-center mb-6">
              <div>
                <div class="text-title mb-1">Academic Pulse</div>
                <div class="text-detail">
                  Global performance metrics across all faculties
                </div>
              </div>
              <div class="chart-controls d-flex ga-1">
                <v-btn
                  v-for="p in ['Daily', 'Weekly', 'Monthly']"
                  :key="p"
                  variant="flat"
                  :color="
                    chartPeriod === p.toLowerCase()
                      ? 'primary'
                      : 'grey-lighten-4'
                  "
                  height="28"
                  class="rounded-0 text-none text-detail font-weight-bold"
                  @click="chartPeriod = p.toLowerCase()"
                >
                  {{ p }}
                </v-btn>
              </div>
            </div>

            <div class="chart-container" style="height: 300px">
              <ClientOnly>
                <DashboardChart />
              </ClientOnly>
            </div>
          </div>
        </v-card>

        <!-- Attention Required Hub -->
        <v-card elevation="0" class="intelligence-card overflow-hidden">
          <header
            class="pa-6 d-flex justify-space-between align-center border-b"
          >
            <div>
              <div class="text-title mb-1">{{ t("students") }}</div>
              <div class="text-detail">Latest registered students</div>
            </div>
            <v-chip
              color="primary"
              variant="flat"
              size="x-small"
              rounded="0"
              class="font-weight-black px-2"
            >
              {{ studentCount }} TOTAL
            </v-chip>
          </header>

          <v-table class="premium-table">
            <thead>
              <tr>
                <th class="text-detail">Stakeholder</th>
                <th class="text-detail">Context</th>
                <th class="text-detail">Alert</th>
                <th class="text-right text-detail pr-6">Action</th>
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
                    <v-avatar size="32" class="mr-3 elevation-1 border-white">
                      <v-img
                        :src="`https://ui-avatars.com/api/?name=${student.name}&background=random`"
                      ></v-img>
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
                  >
                    Action
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- Contextual Utilities Column -->
      <v-col cols="12" lg="4">
        <!-- Unified Schedule Widget -->
        <v-card elevation="0" class="utility-card dark mb-6 overflow-hidden">
          <div class="pa-6 relative-z">
            <div class="d-flex justify-space-between align-center mb-6">
              <div class="text-title text-white">{{ t("academic") }}</div>
              <v-btn
                icon="mdi-calendar"
                variant="text"
                color="white"
                size="x-small"
              ></v-btn>
            </div>

            <div class="schedule-list ga-3 d-flex flex-column">
              <div v-for="(event, i) in events" :key="i" class="schedule-item">
                <div class="date-shard">
                  <span class="day">{{ event.day }}</span>
                  <span class="month">{{ event.month }}</span>
                </div>
                <div class="details flex-grow-1">
                  <div class="title">{{ event.title }}</div>
                  <div class="time d-flex align-center">
                    <v-icon
                      icon="mdi-clock-outline"
                      size="12"
                      class="mr-1"
                    ></v-icon>
                    {{ event.time }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card>

        <!-- System Intelligence Feed -->
        <v-card elevation="0" class="utility-card pb-4">
          <div class="pa-6 pb-2">
            <h3 class="text-title mb-1">{{ t("classes") }}</h3>
            <p class="text-detail mb-6">Recent classrooms</p>

            <div class="feed-container">
              <div v-for="(log, i) in activities" :key="i" class="feed-item">
                <div class="feed-indicator">
                  <div :class="`feed-icon bg-${log.color}-lighten-5`">
                    <v-icon
                      :icon="log.icon"
                      :color="log.color"
                      size="14"
                    ></v-icon>
                  </div>
                  <div
                    class="feed-line"
                    v-if="i !== activities.length - 1"
                  ></div>
                </div>
                <div class="feed-content">
                  <div class="message text-detail mb-1">
                    <span class="font-weight-black text-slate-800">{{
                      log.user
                    }}</span>
                    <span class="text-grey-darken-1 ml-1">{{
                      log.action
                    }}</span>
                  </div>
                  <div class="meta text-detail-tiny">{{ log.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import DashboardChart from "~/components/DashboardChart.vue";
const { t } = useI18n();

const chartPeriod = ref("monthly");

const { $axios } = useNuxtApp();

const studentCount = ref(0);
const teacherCount = ref(0);
const classCount = ref(0);
const subjectCount = ref(0);
const recentStudents = ref<any[]>([]);
const academicYears = ref<any[]>([]);
const recentClasses = ref<any[]>([]);

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

onMounted(async () => {
  try {
    const [sRes, tRes, cRes, subRes, yRes] = await Promise.all([
      $axios.get("/get-all-students"),
      $axios.get("/get-all-teachers?limit=100"),
      $axios.get("/get-all-classrooms?limit=100"),
      $axios.get("/get-all-subjects?limit=100"),
      $axios.get("/get-all-academic-year"),
    ]);

    const students = Array.isArray(sRes.data?.data)
      ? sRes.data.data
      : (sRes.data?.data?.students ?? []);
    studentCount.value = students.length;
    recentStudents.value = students.slice(0, 5);

    teacherCount.value = tRes.data?.data?.pagination?.total ?? 0;

    const classes = cRes.data?.data?.classrooms ?? [];
    classCount.value = cRes.data?.data?.pagination?.total ?? classes.length;
    recentClasses.value = classes.slice(0, 4);

    subjectCount.value = subRes.data?.data?.pagination?.total ?? 0;

    academicYears.value = yRes.data?.data ?? [];
  } catch (error) {
    console.error("dashboard load error:", error);
  }
});

const stats = computed(() => [
  {
    title: t("students"),
    value: String(studentCount.value),
    trendUp: true,
    trendValue: "LIVE",
    icon: "mdi-account-multiple",
    iconColor: "primary",
  },
  {
    title: t("teachers"),
    value: String(teacherCount.value),
    trendUp: true,
    trendValue: "LIVE",
    icon: "mdi-account-tie",
    iconColor: "indigo",
  },
  {
    title: t("classes"),
    value: String(classCount.value),
    trendUp: true,
    trendValue: "LIVE",
    icon: "mdi-google-classroom",
    iconColor: "amber-darken-2",
  },
  {
    title: t("subject"),
    value: String(subjectCount.value),
    trendUp: true,
    trendValue: "LIVE",
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

const events = computed(() =>
  academicYears.value.slice(0, 4).map((y) => {
    const d = y.start_date ? new Date(y.start_date) : null;
    return {
      day: d ? String(d.getUTCDate()).padStart(2, "0") : "--",
      month: d ? MONTHS[d.getUTCMonth()] : "--",
      title: y.title || "—",
      time: y.status || "",
    };
  })
);

const activities = computed(() =>
  recentClasses.value.map((c) => ({
    user: c.classroom_name || "—",
    action: `· ${c.homeroomTeacher?.full_name || "no homeroom teacher"}`,
    time: c.gradeLevel?.grade_level_name || "",
    icon: "mdi-google-classroom",
    color: "primary",
  }))
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
