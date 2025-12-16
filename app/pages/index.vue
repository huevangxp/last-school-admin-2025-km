<template>
  <div>
    <!-- Stats Row -->
    <v-row>
      <v-col cols="12" md="3" v-for="(stat, index) in stats" :key="index">
        <v-card elevation="0" rounded="xl" class="pa-4 h-100">
          <div class="d-flex justify-space-between mb-2">
            <span class="text-subtitle-2 text-grey-darken-1"><span>{{ stat.title }}</span></span>
            <!-- <v-chip size="x-small" :color="stat.badgeColor" variant="flat" class="font-weight-bold">
              <span>{{ stat.badgeText }}</span>
            </v-chip> -->
          </div>
          <div class="text-h4 font-weight-bold text-grey-darken-4 mb-2">
           <span> {{ stat.value }}</span>
          </div>
         
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts & Deadlines Row -->
    <v-row class="mt-4">
      <!-- Project Progress -->
      <v-col cols="12" md="8">
        <v-card elevation="0" rounded="xl" class="pa-6 h-100">
          <div class="d-flex justify-space-between align-center mb-6">
            <div>
              <div class="text-h6 font-weight-bold text-grey-darken-4"><span>Project Progress Over Time</span></div>
              <div class="text-caption text-grey"><span>Weekly task completion across all active projects</span></div>
            </div>
            <div class="d-flex ga-2">
              <v-btn size="small" variant="tonal" color="primary" rounded="lg">Overview</v-btn>
              <v-btn size="small" variant="text" color="grey" rounded="lg">Productivity</v-btn>
              <v-btn size="small" variant="text" color="grey" rounded="lg">Deadlines</v-btn>
            </div>
          </div>
          <div style="height: 300px;">
            <ClientOnly>
              <DashboardChart />
            </ClientOnly>
          </div>
        </v-card>
      </v-col>

      <!-- Upcoming Deadlines -->
      <v-col cols="12" md="4">
        <v-card elevation="0" rounded="xl" class="pa-6 h-100">
          <div class="d-flex justify-space-between align-center mb-6">
            <span class="text-h6 font-weight-bold text-grey-darken-4">Upcoming Deadlines</span>
            <v-btn variant="text" size="small" color="grey">View all</v-btn>
          </div>
          
          <div class="d-flex flex-column ga-4">
            <div v-for="(deadline, i) in deadlines" :key="i" class="d-flex align-start">
              <div class="mr-4 text-center rounded-lg bg-grey-lighten-4 pa-2" style="min-width: 50px;">
                <div class="text-h6 font-weight-bold text-grey-darken-3">{{ deadline.day }}</div>
                <div class="text-caption text-grey">{{ deadline.month }}</div>
              </div>
              <div>
                <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">{{ deadline.title }}</div>
                <div class="text-caption text-grey mb-1">{{ deadline.subtitle }}</div>
                <v-chip
                  size="x-small"
                  :color="deadline.urgent ? 'error' : 'success'"
                  variant="tonal"
                  label
                >
                  {{ deadline.status }}
                </v-chip>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tasks, Workload, Activity Row -->
    <v-row class="mt-4">
      <!-- Tasks by Status -->
      <v-col cols="12" md="4">
        <v-card elevation="0" rounded="xl" class="pa-6 h-100">
          <div class="text-h6 font-weight-bold text-grey-darken-4 mb-1">Tasks by Status</div>
          <div class="text-caption text-grey mb-6">Distribution across all projects</div>

          <div v-for="(task, i) in taskStatus" :key="i" class="mb-4">
            <div class="d-flex justify-space-between mb-1">
              <span class="text-body-2 text-grey-darken-2">{{ task.label }}</span>
              <span class="text-body-2 font-weight-bold text-grey-darken-3">{{ task.count }}</span>
            </div>
            <v-progress-linear
              :model-value="task.percentage"
              :color="task.color"
              height="8"
              rounded
            ></v-progress-linear>
          </div>
        </v-card>
      </v-col>

      <!-- Workload -->
      <v-col cols="12" md="4">
        <v-card elevation="0" rounded="xl" class="pa-6 h-100">
          <div class="text-h6 font-weight-bold text-grey-darken-4 mb-1">Workload by Team Member</div>
          <div class="text-caption text-grey mb-4">Open tasks assigned</div>
          
          <div style="height: 200px; position: relative;">
             <div class="d-flex align-center justify-center h-100" style="position: absolute; width: 100%; pointer-events: none;">
                <div class="text-center">
                  <div class="text-h5 font-weight-bold text-grey-darken-3">124</div>
                  <div class="text-caption text-grey">tasks</div>
                </div>
             </div>
             <ClientOnly>
               <WorkloadChart />
             </ClientOnly>
          </div>
        </v-card>
      </v-col>

      <!-- Recent Activity -->
      <v-col cols="12" md="4">
        <v-card elevation="0" rounded="xl" class="pa-6 h-100">
          <div class="d-flex justify-space-between align-center mb-6">
            <span class="text-h6 font-weight-bold text-grey-darken-4">Recent Activity</span>
            <v-btn variant="text" size="small" color="grey">View log</v-btn>
          </div>

          <div class="d-flex flex-column ga-4">
            <div v-for="(activity, i) in recentActivity" :key="i" class="d-flex align-start">
              <v-avatar size="32" class="mr-3">
                <v-img :src="activity.avatar"></v-img>
              </v-avatar>
              <div>
                <div class="text-body-2 text-grey-darken-3">
                  <span class="font-weight-bold">{{ activity.user }}</span> {{ activity.action }}
                </div>
                <div class="text-caption text-grey mt-1">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Project List & Calendar Row -->
    <v-row class="mt-4">
      <!-- Project List -->
      <v-col cols="12" md="8">
        <v-card elevation="0" rounded="xl" class="pa-6 h-100">
          <div class="d-flex justify-space-between align-center mb-6">
            <div class="d-flex ga-2">
              <v-btn variant="tonal" color="primary" rounded="lg" class="px-6">All</v-btn>
              <v-btn variant="text" color="grey" rounded="lg">Active</v-btn>
              <v-btn variant="text" color="grey" rounded="lg">Overdue</v-btn>
            </div>
            <div class="d-flex ga-2">
               <v-btn variant="outlined" color="grey-lighten-1" rounded="lg" prepend-icon="mdi-sort">Sort: Due date</v-btn>
               <v-btn variant="flat" color="primary" rounded="lg" prepend-icon="mdi-plus">New Project</v-btn>
            </div>
          </div>

          <v-table>
            <thead>
              <tr>
                <th class="text-left text-caption text-grey font-weight-bold">PROJECT NAME</th>
                <th class="text-left text-caption text-grey font-weight-bold">OWNER</th>
                <th class="text-left text-caption text-grey font-weight-bold">STATUS</th>
                <th class="text-left text-caption text-grey font-weight-bold">PROGRESS</th>
                <th class="text-left text-caption text-grey font-weight-bold">DUE DATE</th>
                <th class="text-left text-caption text-grey font-weight-bold">PRIORITY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(project, i) in projects" :key="i">
                <td class="py-4">
                  <div class="font-weight-bold text-grey-darken-3">{{ project.name }}</div>
                  <div class="text-caption text-grey">{{ project.subtitle }}</div>
                </td>
                <td>{{ project.owner }}</td>
                <td>
                  <v-chip size="small" :color="project.statusColor" variant="tonal" label class="font-weight-bold">
                    {{ project.status }}
                  </v-chip>
                </td>
                <td style="width: 150px;">
                  <v-progress-linear
                    :model-value="project.progress"
                    :color="project.progressColor"
                    height="6"
                    rounded
                  ></v-progress-linear>
                </td>
                <td class="text-grey-darken-2">{{ project.dueDate }}</td>
                <td>
                  <v-chip size="small" :color="project.priorityColor" variant="tonal" label class="font-weight-bold">
                    {{ project.priority }}
                  </v-chip>
                </td>
                <td>
                  <v-btn icon variant="text" size="small" color="grey">
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- Focus Map (Calendar) -->
      <v-col cols="12" md="4">
        <v-card elevation="0" rounded="xl" class="pa-6 h-100">
          <div class="d-flex justify-space-between align-center mb-4">
            <span class="text-h6 font-weight-bold text-grey-darken-4">Focus Map</span>
            <span class="text-caption text-grey">This week</span>
          </div>
          <v-date-picker
            elevation="0"
            color="primary"
            class="w-100"
            hide-header
          ></v-date-picker>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import DashboardChart from '~/components/DashboardChart.vue'
import WorkloadChart from '~/components/WorkloadChart.vue'

const stats = [
  {
    title: 'Teachers',
    value: '18',
    badgeText: 'Last 7 days',
    badgeColor: 'grey-lighten-4',
    trendUp: true,
    trendValue: '12%',
    trendText: 'vs last week'
  },
  {
    title: 'Students',
    value: '42',
    badgeText: 'All teams',
    badgeColor: 'grey-lighten-4',
    trendUp: false,
    trendValue: '5%',
    trendText: 'vs yesterday'
  },
  {
    title: 'Admin',
    value: '1',
    badgeText: 'This month',
    badgeColor: 'grey-lighten-4',
    trendUp: true,
    trendValue: '9%',
    trendText: 'Improvement'
  },
  {
    title: 'Classes',
    value: '10',
    badgeText: 'Per task',
    badgeColor: 'grey-lighten-4',
    trendUp: false,
    trendValue: '0.6d',
    trendText: 'faster'
  }
]

const deadlines = [
  {
    day: '12',
    month: 'May',
    title: 'Prototype usability test',
    subtitle: 'Capstone: Campus Portal Redesign',
    status: 'Due today',
    urgent: true
  },
  {
    day: '14',
    month: 'May',
    title: 'API integration review',
    subtitle: 'Library Booking System',
    status: 'In 2 days',
    urgent: false
  },
  {
    day: '18',
    month: 'May',
    title: 'Sprint 4 demo',
    subtitle: 'Lab Equipment Tracker',
    status: 'Next week',
    urgent: false
  }
]

const taskStatus = [
  { label: 'To Do', count: 96, percentage: 30, color: 'orange' },
  { label: 'In Progress', count: 143, percentage: 60, color: 'purple-accent-2' },
  { label: 'Blocked', count: 28, percentage: 15, color: 'red-accent-2' },
  { label: 'Done', count: 321, percentage: 85, color: 'success' }
]

const recentActivity = [
  {
    user: 'Jordan',
    action: 'marked 8 tasks as done in Library Booking System.',
    time: '12 min ago',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    user: 'Priya',
    action: 'added new milestone Orientation week launch.',
    time: '45 min ago',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    user: 'Alex',
    action: 'updated priority for Lab Equipment Tracker to High.',
    time: '1 hr ago',
    avatar: 'https://i.pravatar.cc/150?img=32'
  }
]

const projects = [
  {
    name: 'Capstone: Campus Portal Redesign',
    subtitle: 'CS-401 • UX, Dev, Research',
    owner: 'Alex Kim',
    status: 'Active',
    statusColor: 'success',
    progress: 45,
    progressColor: 'purple-accent-2',
    dueDate: 'May 24',
    priority: 'High',
    priorityColor: 'error'
  },
  {
    name: 'Library Booking System',
    subtitle: 'IS-320 • Backend, QA',
    owner: 'Jordan Lee',
    status: 'Planning',
    statusColor: 'info',
    progress: 20,
    progressColor: 'orange',
    dueDate: 'Jun 3',
    priority: 'Medium',
    priorityColor: 'warning'
  },
  {
    name: 'Orientation App',
    subtitle: 'HCI-210 • Mobile, Design',
    owner: 'Priya Patel',
    status: 'Complete',
    statusColor: 'primary',
    progress: 100,
    progressColor: 'success',
    dueDate: 'Apr 14',
    priority: 'Low',
    priorityColor: 'success'
  },
  {
    name: 'Lab Equipment Tracker',
    subtitle: 'ENG-330 • Hardware, Data',
    owner: 'Samir Rao',
    status: 'At Risk',
    statusColor: 'warning',
    progress: 15,
    progressColor: 'warning',
    dueDate: 'May 10',
    priority: 'High',
    priorityColor: 'error'
  }
]
</script>

<style scoped>
/* Custom scrollbar for table if needed */
.v-table {
  background: transparent !important;
}
</style>