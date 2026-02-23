<template>
  <div class="dashboard-container">
    <!-- Header Section -->
    <div class="d-flex justify-space-between align-center mb-8">
      <div>
        <h1
          class="text-h4 font-weight-bold text-secondary"
          style="letter-spacing: -0.5px"
        >
          {{ $t("dashboard") }}
        </h1>
        <p class="text-subtitle-1 text-grey-darken-1 mt-1 font-weight-medium">
          Welcome back, here's your daily overview.
        </p>
      </div>
      <div class="d-flex ga-3">
        <v-btn
          prepend-icon="mdi-tray-arrow-down"
          variant="outlined"
          color="grey-darken-1"
          class="text-none font-weight-bold px-4"
          rounded="xl"
          border
        >
          Export
        </v-btn>
        <v-btn
          prepend-icon="mdi-plus"
          color="primary"
          class="text-none font-weight-bold px-6 text-white"
          rounded="xl"
          elevation="4"
        >
          New Project
        </v-btn>
      </div>
    </div>

    <!-- Stats Row -->
    <v-row class="mb-6">
      <v-col
        cols="12"
        sm="6"
        md="3"
        v-for="(stat, index) in stats"
        :key="index"
      >
        <v-card
          elevation="0"
          rounded="xl"
          class="bean-card pa-5 h-100 d-flex flex-column justify-space-between"
          color="white"
        >
          <div class="d-flex align-center justify-space-between mb-4">
            <v-avatar
              :color="stat.bgColor"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon
                :icon="stat.icon"
                size="26"
                :color="stat.iconColor"
              ></v-icon>
            </v-avatar>
            <div
              v-if="stat.trendValue"
              class="d-flex align-center px-3 py-1 rounded-pill trend-badge"
              :class="stat.trendUp ? 'bg-green-light' : 'bg-red-light'"
            >
              <v-icon
                :icon="
                  stat.trendUp ? 'mdi-arrow-up-right' : 'mdi-arrow-down-right'
                "
                size="16"
                :color="stat.trendUp ? 'green-darken-2' : 'red-darken-2'"
                class="mr-1"
              ></v-icon>
              <span
                class="text-caption font-weight-bold"
                :class="
                  stat.trendUp ? 'text-green-darken-3' : 'text-red-darken-3'
                "
              >
                {{ stat.trendValue }}
              </span>
            </div>
          </div>
          <div>
            <div class="text-h4 font-weight-bold text-secondary mb-1">
              {{ stat.value }}
            </div>
            <div class="text-body-2 text-grey-darken-1 font-weight-medium">
              {{ stat.title }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Grid -->
    <v-row>
      <!-- Left Column (Charts & Tables) -->
      <v-col cols="12" lg="8">
        <!-- Project Progress Chart -->
        <v-card elevation="0" rounded="xl" class="bean-card pa-6 mb-6">
          <div
            class="d-flex flex-wrap justify-space-between align-center mb-8 ga-4"
          >
            <div>
              <h2 class="text-h6 font-weight-bold text-secondary">
                Analytics Overview
              </h2>
              <div
                class="text-caption text-grey-darken-1 font-weight-bold text-uppercase tracking-wide"
              >
                Project Performance
              </div>
            </div>
            <v-btn-toggle
              v-model="chartPeriod"
              density="compact"
              class="cream-toggle rounded-pill"
              color="primary"
              mandatory
              borderless
            >
              <v-btn
                value="weekly"
                size="small"
                class="text-none font-weight-bold px-5"
                >Weekly</v-btn
              >
              <v-btn
                value="monthly"
                size="small"
                class="text-none font-weight-bold px-5"
                >Monthly</v-btn
              >
            </v-btn-toggle>
          </div>
          <div style="height: 320px" class="w-100 chart-container rounded-lg">
            <ClientOnly>
              <DashboardChart />
            </ClientOnly>
          </div>
        </v-card>

        <!-- Projects Table -->
        <v-card elevation="0" rounded="xl" class="bean-card overflow-hidden">
          <div class="pa-6 border-b d-flex justify-space-between align-center">
            <div>
              <h2 class="text-h6 font-weight-bold text-secondary">
                Recent Projects
              </h2>
              <div
                class="text-caption text-grey-darken-1 font-weight-bold text-uppercase tracking-wide"
              >
                {{ projects.length }} active tracks
              </div>
            </div>
            <v-btn
              variant="text"
              color="primary"
              class="text-none font-weight-bold px-0"
              append-icon="mdi-arrow-right"
            >
              View All
            </v-btn>
          </div>

          <v-table class="projects-table">
            <thead>
              <tr class="bg-grey-lighten-5">
                <th
                  class="text-caption font-weight-bold text-grey-darken-1 pl-6 py-4 text-uppercase"
                >
                  Project Name
                </th>
                <th
                  class="text-caption font-weight-bold text-grey-darken-1 py-4 text-uppercase"
                >
                  Lead
                </th>
                <th
                  class="text-caption font-weight-bold text-grey-darken-1 py-4 text-uppercase"
                >
                  Status
                </th>
                <th
                  class="text-caption font-weight-bold text-grey-darken-1 py-4 text-uppercase"
                >
                  Progress
                </th>
                <th class="text-right pr-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(project, i) in projects" :key="i" class="project-row">
                <td class="pl-6 py-5">
                  <div class="d-flex align-center">
                    <v-sheet
                      rounded="lg"
                      class="d-flex align-center justify-center mr-4 bg-primary-lighten-5"
                      height="44"
                      width="44"
                    >
                      <span class="text-primary text-h6 font-weight-bold">
                        {{ project.name.charAt(0) }}
                      </span>
                    </v-sheet>
                    <div>
                      <div
                        class="text-subtitle-2 font-weight-bold text-secondary"
                      >
                        {{ project.name }}
                      </div>
                      <div
                        class="text-caption text-grey-darken-1 font-weight-medium"
                      >
                        {{ project.subtitle }}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <v-avatar size="28" class="border">
                    <v-img
                      :src="`https://ui-avatars.com/api/?name=${project.owner}&background=random`"
                    ></v-img>
                  </v-avatar>
                </td>
                <td>
                  <v-chip
                    :color="project.statusColor"
                    size="small"
                    variant="flat"
                    class="font-weight-bold text-uppercase status-chip"
                  >
                    {{ project.status }}
                  </v-chip>
                </td>
                <td style="min-width: 140px">
                  <div class="d-flex align-center">
                    <v-progress-linear
                      :model-value="project.progress"
                      :color="project.progressColor"
                      bg-color="grey-lighten-2"
                      height="8"
                      rounded
                      class="flex-grow-1 mr-3"
                    ></v-progress-linear>
                    <span
                      class="text-caption text-grey-darken-4 font-weight-bold"
                      >{{ project.progress }}%</span
                    >
                  </div>
                </td>
                <td class="text-right pr-6">
                  <v-btn
                    icon="mdi-dots-horizontal"
                    variant="text"
                    density="comfortable"
                    color="grey-darken-1"
                  ></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- Right Column (Sidebar Widgets) -->
      <v-col cols="12" lg="4">
        <!-- Deadlines -->
        <v-card elevation="0" rounded="xl" class="bean-card pa-6 mb-6">
          <div class="d-flex justify-space-between align-center mb-6">
            <h2 class="text-h6 font-weight-bold text-secondary">Schedule</h2>
            <v-btn
              icon="mdi-calendar-month"
              variant="text"
              density="comfortable"
              color="grey-darken-1"
            ></v-btn>
          </div>
          <div class="d-flex flex-column ga-3">
            <div
              v-for="(deadline, i) in deadlines"
              :key="i"
              class="d-flex align-center pa-4 rounded-xl transition-swing hover-scale bg-grey-lighten-5"
            >
              <div
                class="d-flex flex-column align-center justify-center bg-white rounded-lg px-3 py-2 mr-4 shadow-sm"
                style="min-width: 60px"
              >
                <div
                  class="text-h6 font-weight-black text-secondary"
                  style="line-height: 1"
                >
                  {{ deadline.day }}
                </div>
                <div
                  class="text-caption font-weight-bold text-grey text-uppercase mt-1"
                  style="font-size: 0.65rem !important"
                >
                  {{ deadline.month }}
                </div>
              </div>
              <div class="flex-grow-1" style="min-width: 0">
                <div
                  class="text-subtitle-2 font-weight-bold text-secondary text-truncate"
                >
                  {{ deadline.title }}
                </div>
                <div class="d-flex align-center mt-1">
                  <span
                    class="status-dot mr-2"
                    :class="deadline.urgent ? 'bg-error' : 'bg-success'"
                  ></span>
                  <span
                    class="text-caption text-grey-darken-1 font-weight-medium"
                  >
                    {{ deadline.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </v-card>

        <!-- Tasks Status -->
        <v-card elevation="0" rounded="xl" class="bean-card pa-6 mb-6">
          <div class="mb-6">
            <h2 class="text-h6 font-weight-bold text-secondary">Workload</h2>
            <div
              class="text-caption text-grey-darken-1 font-weight-bold text-uppercase tracking-wide"
            >
              Task Distribution
            </div>
          </div>
          <div v-for="(task, i) in taskStatus" :key="i" class="mb-5 last-mb-0">
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2 font-weight-bold text-secondary">{{
                task.label
              }}</span>
              <span class="text-caption font-weight-bold text-grey-darken-1"
                >{{ task.count }} tasks</span
              >
            </div>
            <v-progress-linear
              :model-value="task.percentage"
              :color="task.color"
              bg-color="grey-lighten-3"
              height="8"
              rounded
            ></v-progress-linear>
          </div>
        </v-card>

        <!-- Activity -->
        <v-card elevation="0" rounded="xl" class="bean-card pa-6">
          <div class="d-flex justify-space-between align-center mb-6">
            <h2 class="text-h6 font-weight-bold text-secondary">
              Latest Activity
            </h2>
          </div>

          <div class="activity-timeline pl-2">
            <div
              v-for="(activity, i) in recentActivity"
              :key="i"
              class="d-flex align-start mb-6 last-mb-0 relative activity-item"
            >
              <div class="mr-4 relative z-10">
                <v-avatar
                  :image="activity.avatar"
                  size="42"
                  class="border-2 border-white shadow-sm"
                ></v-avatar>
              </div>
              <div class="pt-1">
                <div
                  class="text-subtitle-2 text-secondary mb-1"
                  style="line-height: 1.4"
                >
                  <span class="font-weight-black">{{ activity.user }}</span>
                  <span class="font-weight-medium text-grey-darken-2">
                    {{ activity.action }}</span
                  >
                </div>
                <div class="text-caption text-grey-lighten-1 font-weight-bold">
                  {{ activity.time }}
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
import DashboardChart from "~/components/DashboardChart.vue";
import WorkloadChart from "~/components/WorkloadChart.vue";
const { t } = useI18n();

const chartPeriod = ref("weekly");

const stats = [
  {
    title: "Total Faculty",
    value: "24",
    trendUp: true,
    trendValue: "12%",
    icon: "mdi-human-lecturer",
    bgColor: "orange-lighten-5",
    iconColor: "orange-darken-2",
  },
  {
    title: "Students Enrolled",
    value: "1,204",
    trendUp: true,
    trendValue: "8%",
    icon: "mdi-school-outline",
    bgColor: "blue-lighten-5",
    iconColor: "blue-darken-2",
  },
  {
    title: "Pending Tasks",
    value: "13",
    trendUp: false,
    trendValue: "2%",
    icon: "mdi-clipboard-text-clock-outline",
    bgColor: "red-lighten-5",
    iconColor: "red-darken-2",
  },
  {
    title: "Revenue",
    value: "$42k",
    trendUp: true,
    trendValue: "15%",
    icon: "mdi-currency-usd",
    bgColor: "green-lighten-5",
    iconColor: "green-darken-2",
  },
  {
    title: "Reports",
    value: "45",
    trendUp: true,
    trendValue: "5%",
    icon: "mdi-file-chart-outline",
    bgColor: "purple-lighten-5",
    iconColor: "purple-darken-2",
  },
];

const deadlines = [
  {
    day: "12",
    month: "May",
    title: "UX Research Review",
    status: "Urgent",
    urgent: true,
  },
  {
    day: "14",
    month: "May",
    title: "Library API Integration",
    status: "In Progress",
    urgent: false,
  },
  {
    day: "18",
    month: "May",
    title: "Marketing Strategy",
    status: "Upcoming",
    urgent: false,
  },
];

const taskStatus = [
  {
    label: "Design Phase",
    count: 45,
    percentage: 70,
    color: "warning",
  },
  {
    label: "Development",
    count: 28,
    percentage: 45,
    color: "info",
  },
  { label: "Testing", count: 12, percentage: 20, color: "success" },
];

const recentActivity = [
  {
    user: "Sarah M.",
    action: "completed the wireframes for the new portal.",
    time: "2 mins ago",
    avatar: "https://i.pravatar.cc/150?img=35",
  },
  {
    user: "David K.",
    action: "commented on the API documentation.",
    time: "1 hour ago",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    user: "Elena R.",
    action: "added 3 new tasks to the backlog.",
    time: "3 hours ago",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

const projects = [
  {
    name: "Student Portal",
    subtitle: "Web Development",
    owner: "Alex Kim",
    status: "Active",
    statusColor: "green-lighten-4 text-green-darken-4",
    progress: 75,
    progressColor: "success",
  },
  {
    name: "LMS Upgrade",
    subtitle: "System Architecture",
    owner: "Jordan Lee",
    status: "Review",
    statusColor: "orange-lighten-4 text-orange-darken-4",
    progress: 40,
    progressColor: "warning",
  },
  {
    name: "Mobile App",
    subtitle: "React Native",
    owner: "Priya Patel",
    status: "On Hold",
    statusColor: "grey-lighten-3 text-grey-darken-3",
    progress: 15,
    progressColor: "grey-darken-1",
  },
  {
    name: "Analytics D.B",
    subtitle: "Data Science",
    owner: "Samir Rao",
    status: "Active",
    statusColor: "green-lighten-4 text-green-darken-4",
    progress: 55,
    progressColor: "success",
  },
  {
    name: "Library System",
    subtitle: "Backend API",
    owner: "Chen Wei",
    status: "Active",
    statusColor: "green-lighten-4 text-green-darken-4",
    progress: 90,
    progressColor: "success",
  },
];
</script>

<style scoped>
/* Cream Theme Variables */
.dashboard-container {
  /* This simulates the background if layout allows, or just applies to this component's area */
  --cream-bg: #fafaf5;
  --cream-card: #ffffff;
  --cream-border: #efebe0;
}

/* Bean Card - The core component of the cream UI */
.bean-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0 !important;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bean-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 4px 6px -2px rgba(0, 0, 0, 0.025) !important;
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}

/* Typography Tools */
.tracking-wide {
  letter-spacing: 0.05em;
}

/* Custom Colors */
.bg-cream-light {
  background-color: #fcfbf9;
}
.bg-cream-soft {
  background-color: #f9f7f5;
}
.bg-primary-lighten-5 {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}
.border {
  border: 1px solid #e2e8f0 !important;
}
.border-b {
  border-bottom: 1px solid #e2e8f0 !important;
}

.bg-green-light {
  background-color: #e8f5e9;
}
.bg-red-light {
  background-color: #ffebee;
}

/* Toggle Button Styling */
.cream-toggle {
  background-color: #f8fafc !important;
  border: 1px solid #e2e8f0;
}

:deep(.v-btn--active) {
  background-color: #ffffff !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Table Enhancements */
:deep(.projects-table tbody tr:hover) {
  background-color: #f8fafc !important;
}

.status-chip {
  letter-spacing: 0.5px;
}

.shadow-sm {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03) !important;
}

.hover-scale:hover {
  transform: scale(1.02);
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.status-dot {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* Activity Timeline Line */
.activity-timeline {
  position: relative;
}
.activity-timeline::before {
  content: "";
  position: absolute;
  top: 15px;
  bottom: 30px;
  left: 21px; /* Align with avatar center (42px / 2 = 21px) */
  width: 2px;
  background-color: #e2e8f0;
  z-index: 0;
}
</style>
