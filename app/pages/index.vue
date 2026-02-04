<template>
  <div>
    <!-- Header Section -->
    <div class="d-flex justify-space-between align-center mb-8">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-4">Dashboard</h1>
        <p class="text-subtitle-1 text-grey text-medium-emphasis mt-1">
          Welcome back, here's what's happening today.
        </p>
      </div>
      <div class="d-flex ga-2">
        <v-btn
          prepend-icon="mdi-download"
          variant="outlined"
          color="grey-darken-1"
          class="text-none font-weight-medium"
          rounded="lg"
        >
          Export
        </v-btn>
        <v-btn
          prepend-icon="mdi-plus"
          color="primary"
          class="text-none font-weight-bold"
          rounded="lg"
          elevation="2"
        >
          New Project
        </v-btn>
      </div>
    </div>

    <!-- Stats Row -->
    <v-row class="mb-4">
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
          class="pa-5 h-100 border transition-swing card-hover bg-white"
        >
          <div class="d-flex align-center justify-space-between mb-4">
            <v-avatar
              :color="stat.color"
              variant="tonal"
              rounded="lg"
              size="48"
            >
              <v-icon :icon="stat.icon" size="24"></v-icon>
            </v-avatar>
            <v-chip
              v-if="stat.trendValue"
              :color="stat.trendUp ? 'success' : 'error'"
              variant="flat"
              size="x-small"
              class="font-weight-bold px-2"
            >
              <v-icon
                :icon="stat.trendUp ? 'mdi-arrow-up' : 'mdi-arrow-down'"
                start
                size="x-small"
                class="mr-1"
              ></v-icon>
              {{ stat.trendValue }}
            </v-chip>
          </div>
          <div>
            <div
              class="text-caption text-grey-darken-1 font-weight-medium text-uppercase mb-1"
            >
              {{ stat.title }}
            </div>
            <div class="text-h4 font-weight-bold text-grey-darken-4">
              {{ stat.value }}
            </div>
            <div class="text-caption text-grey mt-2 d-flex align-center">
              <v-icon icon="mdi-clock-outline" size="14" class="mr-1"></v-icon>
              {{ stat.badgeText }}
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
        <v-card elevation="0" rounded="xl" class="pa-6 border mb-6 bg-white">
          <div
            class="d-flex flex-wrap justify-space-between align-center mb-6 ga-4"
          >
            <div>
              <h2 class="text-h6 font-weight-bold text-grey-darken-4">
                Project Progress
              </h2>
              <div class="text-body-2 text-grey">Weekly completion rates</div>
            </div>
            <v-btn-toggle
              v-model="chartPeriod"
              density="compact"
              color="primary"
              variant="outlined"
              rounded="lg"
              divided
              class="border-thin"
            >
              <v-btn value="weekly" size="small" class="text-capitalize px-4"
                >Weekly</v-btn
              >
              <v-btn value="monthly" size="small" class="text-capitalize px-4"
                >Monthly</v-btn
              >
            </v-btn-toggle>
          </div>
          <div style="height: 320px" class="w-100">
            <ClientOnly>
              <DashboardChart />
            </ClientOnly>
          </div>
        </v-card>

        <!-- Projects Table -->
        <v-card
          elevation="0"
          rounded="xl"
          class="pa-0 border overflow-hidden bg-white"
        >
          <div class="pa-6 d-flex justify-space-between align-center border-b">
            <div>
              <h2 class="text-h6 font-weight-bold text-grey-darken-4">
                Active Projects
              </h2>
              <div class="text-body-2 text-grey">
                {{ projects.length }} projects in progress
              </div>
            </div>
            <v-btn variant="text" color="primary" class="text-none">
              View All Projects
            </v-btn>
          </div>

          <v-table class="projects-table">
            <thead>
              <tr class="bg-grey-lighten-5">
                <th
                  class="text-caption font-weight-bold text-grey-darken-1 pl-6 py-4 text-uppercase"
                >
                  Project
                </th>
                <th
                  class="text-caption font-weight-bold text-grey-darken-1 py-4 text-uppercase"
                >
                  Owner
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
                <td class="pl-6 py-4">
                  <div class="d-flex align-center">
                    <v-avatar
                      color="grey-lighten-4"
                      rounded="lg"
                      size="44"
                      class="mr-4"
                    >
                      <span class="text-primary text-h6 font-weight-bold">{{
                        project.name.charAt(0)
                      }}</span>
                    </v-avatar>
                    <div>
                      <div
                        class="text-subtitle-2 font-weight-bold text-grey-darken-3"
                      >
                        {{ project.name }}
                      </div>
                      <div class="text-caption text-grey">
                        {{ project.subtitle }}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-center">
                    <v-avatar size="24" class="mr-2">
                      <v-img
                        :src="`https://ui-avatars.com/api/?name=${project.owner}&background=random`"
                      ></v-img>
                    </v-avatar>
                    <span class="text-body-2 text-grey-darken-3">{{
                      project.owner
                    }}</span>
                  </div>
                </td>
                <td>
                  <v-chip
                    :color="project.statusColor"
                    size="small"
                    label
                    variant="tonal"
                    class="font-weight-bold text-uppercase"
                  >
                    {{ project.status }}
                  </v-chip>
                </td>
                <td style="min-width: 140px">
                  <div class="d-flex align-center">
                    <v-progress-linear
                      :model-value="project.progress"
                      :color="project.progressColor"
                      height="6"
                      rounded
                      class="flex-grow-1 mr-3"
                    ></v-progress-linear>
                    <span class="text-caption text-grey font-weight-bold"
                      >{{ project.progress }}%</span
                    >
                  </div>
                </td>
                <td class="text-right pr-6">
                  <v-btn
                    icon="mdi-dots-horizontal"
                    variant="text"
                    density="comfortable"
                    color="grey"
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
        <v-card elevation="0" rounded="xl" class="pa-6 border mb-6 bg-white">
          <div class="d-flex justify-space-between align-center mb-6">
            <h2 class="text-h6 font-weight-bold text-grey-darken-4">
              Upcoming Deadlines
            </h2>
          </div>
          <div class="d-flex flex-column ga-3">
            <div
              v-for="(deadline, i) in deadlines"
              :key="i"
              class="d-flex align-center pa-3 rounded-lg bg-grey-lighten-5 border-thin transition-swing hover-light"
            >
              <div
                class="d-flex flex-column align-center justify-center bg-white rounded-lg px-3 py-2 border mr-4"
                style="min-width: 56px"
              >
                <div
                  class="text-h6 font-weight-bold text-primary"
                  style="line-height: 1"
                >
                  {{ deadline.day }}
                </div>
                <div
                  class="text-caption text-grey font-weight-bold text-uppercase mt-1"
                  style="font-size: 0.65rem !important"
                >
                  {{ deadline.month }}
                </div>
              </div>
              <div class="flex-grow-1" style="min-width: 0">
                <div
                  class="text-subtitle-2 font-weight-bold text-grey-darken-3 text-truncate"
                >
                  {{ deadline.title }}
                </div>
                <!-- truncated -->
                <div class="d-flex align-center mt-1">
                  <v-chip
                    v-if="deadline.urgent"
                    size="x-small"
                    color="error"
                    variant="flat"
                    label
                    class="mr-2 font-weight-bold"
                    >Urgent</v-chip
                  >
                  <span class="text-caption text-grey font-weight-medium">{{
                    deadline.status
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <v-btn
            block
            variant="tonal"
            color="primary"
            class="mt-4 text-none"
            rounded="lg"
            >View Calendar</v-btn
          >
        </v-card>

        <!-- Workload Chart -->
        <v-card elevation="0" rounded="xl" class="pa-6 border mb-6 bg-white">
          <div class="mb-4">
            <h2 class="text-h6 font-weight-bold text-grey-darken-4">
              Team Workload
            </h2>
            <div class="text-body-2 text-grey">Active tasks distribution</div>
          </div>
          <div
            style="height: 220px; position: relative"
            class="d-flex justify-center align-center"
          >
            <div class="position-absolute text-center" style="z-index: 0">
              <div class="text-h4 font-weight-bold text-grey-darken-3">124</div>
              <div class="text-caption text-grey-darken-1 font-weight-medium">
                Tasks
              </div>
            </div>
            <ClientOnly>
              <WorkloadChart />
            </ClientOnly>
          </div>
        </v-card>

        <!-- Recent Activity -->
        <v-card elevation="0" rounded="xl" class="pa-6 border bg-white">
          <div class="d-flex justify-space-between align-center mb-6">
            <h2 class="text-h6 font-weight-bold text-grey-darken-4">
              Activity
            </h2>
            <v-btn
              icon="mdi-history"
              variant="text"
              size="small"
              color="grey"
            ></v-btn>
          </div>

          <div class="activity-timeline">
            <div
              v-for="(activity, i) in recentActivity"
              :key="i"
              class="d-flex align-start mb-6 last-mb-0 relative"
            >
              <div class="mr-4 relative">
                <v-avatar
                  :image="activity.avatar"
                  size="40"
                  class="border"
                ></v-avatar>
                <!-- Connector line could go here if we wanted a real timeline look -->
              </div>
              <div>
                <div
                  class="text-subtitle-2 text-grey-darken-3 lin-height-tight mb-1"
                >
                  <span class="font-weight-bold">{{ activity.user }}</span>
                  <span class="font-weight-regular text-grey-darken-1">
                    {{ activity.action }}</span
                  >
                </div>
                <div class="text-caption text-grey font-weight-medium">
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

const chartPeriod = ref("weekly");

const stats = [
  {
    title: "Total Teachers",
    value: "18",
    badgeText: "Since last week",
    trendUp: true,
    trendValue: "12%",
    icon: "mdi-human-male-board",
    color: "primary",
  },
  {
    title: "Total Students",
    value: "42",
    badgeText: "Since yesterday",
    trendUp: false,
    trendValue: "5%",
    icon: "mdi-school",
    color: "purple",
  },
  {
    title: "Administrators",
    value: "3",
    badgeText: "Updated today",
    trendUp: true,
    trendValue: null,
    icon: "mdi-shield-crown",
    color: "indigo",
  },
  {
    title: "Active Classes",
    value: "10",
    badgeText: "Currently running",
    trendUp: true,
    trendValue: null,
    icon: "mdi-google-classroom",
    color: "teal",
  },
];

const deadlines = [
  {
    day: "12",
    month: "May",
    title: "Prototype usability test",
    subtitle: "Capstone: Campus Portal Redesign",
    status: "Due today",
    urgent: true,
  },
  {
    day: "14",
    month: "May",
    title: "API integration review",
    subtitle: "Library Booking System",
    status: "In 2 days",
    urgent: false,
  },
  {
    day: "18",
    month: "May",
    title: "Sprint 4 demo",
    subtitle: "Lab Equipment Tracker",
    status: "Next week",
    urgent: false,
  },
];

const taskStatus = [
  { label: "To Do", count: 96, percentage: 30, color: "orange" },
  {
    label: "In Progress",
    count: 143,
    percentage: 60,
    color: "purple-accent-2",
  },
  { label: "Blocked", count: 28, percentage: 15, color: "red-accent-2" },
  { label: "Done", count: 321, percentage: 85, color: "success" },
];

const recentActivity = [
  {
    user: "Jordan",
    action: "marked 8 tasks as done in Library Booking System.",
    time: "12 min ago",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    user: "Priya",
    action: "added new milestone Orientation week launch.",
    time: "45 min ago",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    user: "Alex",
    action: "updated priority for Lab Equipment Tracker to High.",
    time: "1 hr ago",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

const projects = [
  {
    name: "Campus Portal",
    subtitle: "UX Research",
    owner: "Alex Kim",
    status: "Active",
    statusColor: "success",
    progress: 45,
    progressColor: "purple-accent-2",
    dueDate: "May 24",
    priority: "High",
    priorityColor: "error",
  },
  {
    name: "Library System",
    subtitle: "Backend Dev",
    owner: "Jordan Lee",
    status: "Planning",
    statusColor: "info",
    progress: 20,
    progressColor: "orange",
    dueDate: "Jun 3",
    priority: "Medium",
    priorityColor: "warning",
  },
  {
    name: "Orientation App",
    subtitle: "Mobile Design",
    owner: "Priya Patel",
    status: "Complete",
    statusColor: "primary",
    progress: 100,
    progressColor: "success",
    dueDate: "Apr 14",
    priority: "Low",
    priorityColor: "success",
  },
  {
    name: "Lab Tracker",
    subtitle: "Data Analysis",
    owner: "Samir Rao",
    status: "At Risk",
    statusColor: "warning",
    progress: 15,
    progressColor: "warning",
    dueDate: "May 10",
    priority: "High",
    priorityColor: "error",
  },
];
</script>

<style scoped>
.border-thin {
  border-width: 1px !important;
}

/* Enhanced Card Hover Effect */
.card-hover {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1) !important;
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}

.lin-height-tight {
  line-height: 1.4;
}
.last-mb-0:last-child {
  margin-bottom: 0 !important;
}

/* Table Styling */
:deep(.v-table .v-table__wrapper) {
  overflow-x: auto;
}
:deep(.projects-table tbody tr) {
  transition: background-color 0.2s ease;
}
:deep(.projects-table tbody tr:hover) {
  background-color: #f8f9fa !important;
}

.hover-light:hover {
  background-color: #f0f0f0 !important;
}
</style>
