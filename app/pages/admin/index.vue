<template>
  <v-container fluid class="pa-6 dashboard-container bg-red">
    <!-- Quick Actions Bar: Intelligence Style -->
    <div class="d-flex justify-end mb-6 fade-in">
      <div class="action-stack d-flex ga-2">
        <v-btn
          variant="flat"
          color="white"
          class="modern-action-btn secondary border"
          height="36"
        >
          <v-icon icon="mdi-file-download-outline" start size="18"></v-icon>
          Export
        </v-btn>

        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="36"
          to="/admin/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ t("add") }} {{ t("admin") }}
        </v-btn>
      </div>
    </div>

    <!-- Section: High-Signal Metrics -->
    <v-row class="mb-6 ga-y-4 fade-in">
      <v-col cols="12" sm="6" lg="3" v-for="(stat, i) in adminStats" :key="i">
        <v-card elevation="0" class="metric-card h-100 overflow-hidden">
          <div class="pa-4">
            <div class="d-flex justify-space-between align-center mb-4">
              <div :class="`metric-icon-box bg-${stat.color}-lighten-5`">
                <v-icon
                  :icon="stat.icon"
                  :color="`${stat.color}-darken-2`"
                  size="18"
                ></v-icon>
              </div>
              <v-chip
                color="grey-lighten-4"
                class="text-detail-tiny font-weight-black"
                size="x-small"
                variant="flat"
              >
                REAL-TIME
              </v-chip>
            </div>

            <div class="metric-info">
              <div class="text-detail mb-1">{{ stat.label }}</div>
              <div class="text-title" style="font-size: 18px !important">
                {{ stat.value }}
              </div>
            </div>
          </div>
          <div
            class="metric-footer-line"
            :style="`background: var(--v-${stat.color}-base)`"
          ></div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Repository: Intelligence Area -->
    <v-card elevation="0" class="intelligence-card pa-6 fade-in">
      <!-- Search & Contextual Filters -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-8 gap-4"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :placeholder="t('search')"
          variant="outlined"
          density="compact"
          hide-details
          class="cream-input"
          style="max-width: 400px"
          bg-color="white"
          color="primary"
          base-color="grey-lighten-1"
          rounded="lg"
        ></v-text-field>

        <div class="d-flex gap-2 align-center flex-wrap">
          <v-select
            :items="['All Roles', 'Super Admin', 'Admin', 'Moderator']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 150px"
            prepend-inner-icon="mdi-shield-lock-outline"
            class="cream-select text-detail"
          ></v-select>

          <v-select
            :items="['All Statuses', 'Active', 'Inactive']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 140px"
            class="cream-select text-detail"
          ></v-select>

          <v-btn
            variant="flat"
            color="white"
            class="modern-action-btn secondary border px-0"
            height="40"
            width="40"
            min-width="40"
          >
            <v-icon icon="mdi-tune" size="18"></v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Data Intelligence Grid -->
      <v-data-table
        :headers="headers"
        :items="admins"
        :search="search"
        class="premium-table"
        hover
      >
        <!-- Administrator Identity Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              size="36"
              class="mr-3 elevation-1 border-white"
              rounded="lg"
            >
              <v-img :src="item.image" cover></v-img>
            </v-avatar>
            <div>
              <div class="text-title-small">{{ item.name }}</div>
              <div class="text-detail-tiny">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <!-- Access Identifier Slot -->
        <template v-slot:item.id="{ item }">
          <span
            class="text-detail-tiny bg-grey-lighten-4 px-2 py-1 rounded-md font-weight-black"
          >
            {{ item.id }}
          </span>
        </template>

        <!-- Functional Role Slot -->
        <template v-slot:item.role="{ item }">
          <div>
            <div class="text-title-small">{{ item.role }}</div>
            <div class="text-detail-tiny text-grey">{{ item.department }}</div>
          </div>
        </template>

        <!-- Communication Channel Slot -->
        <template v-slot:item.phone="{ item }">
          <div class="text-detail font-weight-bold">{{ item.phone }}</div>
        </template>

        <!-- Lifecycle Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.status === 'Active' ? 'success' : 'grey'"
            size="x-small"
            variant="flat"
            class="font-weight-black text-uppercase px-2"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Intelligence Actions Slot -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end ga-1">
            <v-btn
              icon="mdi-pencil-outline"
              variant="text"
              size="x-small"
              color="primary"
            ></v-btn>
            <v-btn
              icon="mdi-shield-key-outline"
              variant="text"
              size="x-small"
              color="warning"
            ></v-btn>
            <v-btn
              icon="mdi-trash-can-outline"
              variant="text"
              size="x-small"
              color="error"
            ></v-btn>
          </div>
        </template>

        <!-- Navigation Architecture Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-4 border-t">
            <div class="text-detail-tiny">
              Displaying 1-{{ admins.length }} of {{ admins.length }} security
              records
            </div>
            <div class="d-flex gap-1 align-center">
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                color="grey-darken-1"
                size="x-small"
              ></v-btn>
              <v-btn
                color="primary"
                size="x-small"
                variant="flat"
                class="font-weight-black rounded-md"
                style="min-width: 24px; height: 24px"
              >
                1
              </v-btn>
              <v-btn
                icon="mdi-chevron-right"
                variant="text"
                color="grey-darken-1"
                size="x-small"
              ></v-btn>
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
const { t } = useI18n();

definePageMeta({
  layout: "admin",
});

const search = ref("");

const adminStats = [
  {
    label: "Total Admins",
    value: "14",
    icon: "mdi-shield-account",
    color: "blue",
  },
  {
    label: "Active online",
    value: "3",
    icon: "mdi-check-circle",
    color: "green",
  },
  { label: "Super Admins", value: "2", icon: "mdi-crown", color: "purple" },
  {
    label: "Access Requests",
    value: "0",
    icon: "mdi-clock-outline",
    color: "orange",
  },
];

const headers = [
  {
    title: t("admin_name"),
    key: "name",
    align: "start" as const,
    sortable: true,
  },
  { title: "ACCESS ID", key: "id", align: "start" as const, sortable: true },
  { title: t("role"), key: "role", align: "start" as const, sortable: true },
  {
    title: t("contact"),
    key: "phone",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("status"),
    key: "status",
    align: "start" as const,
    sortable: true,
  },
  { title: "", key: "actions", align: "end" as const, sortable: false },
].map((h) => ({
  ...h,
  class: "text-detail-tiny pb-2",
}));

const admins = ref([
  {
    id: "#ADM-001",
    name: "Alex Morgan",
    email: "alex.m@school.com",
    image: "https://i.pravatar.cc/150?img=10",
    role: "Super Admin",
    department: "IT Department",
    phone: "+1 (555) 123-4567",
    status: "Active",
  },
  {
    id: "#ADM-002",
    name: "Jessica Lee",
    email: "jessica.l@school.com",
    image: "https://i.pravatar.cc/150?img=20",
    role: "Admin",
    department: "Academic Affairs",
    phone: "+1 (555) 987-6543",
    status: "Active",
  },
  {
    id: "#ADM-003",
    name: "Michael Brown",
    email: "michael.b@school.com",
    image: "https://i.pravatar.cc/150?img=30",
    role: "Moderator",
    department: "Student Services",
    phone: "+1 (555) 234-5678",
    status: "Active",
  },
]);
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.metric-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intelligence-card {
  border-radius: 20px !important;
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

.premium-table {
  background: transparent !important;
}

:deep(.v-data-table__th) {
  background-color: #f8fafc !important;
  border-bottom: 1px solid #f1f5f9 !important;
  height: 48px !important;
}

:deep(.v-data-table__td) {
  border-bottom: 1px solid #f1f5f9 !important;
  height: 60px !important;
}

.cream-input :deep(.v-field__outline__start),
.cream-input :deep(.v-field__outline__end),
.cream-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.border-white {
  border: 1.5px solid #ffffff;
}

.border-t {
  border-top: 1px solid #f1f5f9;
}

.gap-4 {
  gap: 16px;
}
</style>
