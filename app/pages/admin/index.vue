<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-title mb-1">{{ t("management") }} {{ t("admin") }}</h1>
        <p class="text-detail">
          Manage system administrators and security permissions.
        </p>
      </div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          class="modern-action-btn secondary border"
          height="32"
          prepend-icon="mdi-download"
        >
          {{ t("export") }}
        </v-btn>

        <v-btn
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="32"
          prepend-icon="mdi-plus"
          to="/admin/add"
        >
          {{ t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in adminStats" :key="i">
        <v-card
          class="metric-card pa-4 d-flex flex-column justify-space-between h-100"
          elevation="0"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p class="text-detail-tiny mb-1">
                {{ stat.label }}
              </p>
              <h2 class="text-title">{{ stat.value }}</h2>
            </div>
            <v-avatar
              :color="`${stat.color}-lighten-5`"
              rounded="lg"
              size="40"
              class="metric-icon-box"
            >
              <v-icon :color="`${stat.color}-darken-2`" size="18">{{
                stat.icon
              }}</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card elevation="0" class="intelligence-card pa-4">
      <!-- Search and Filter Section -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-3"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :placeholder="t('search')"
          variant="outlined"
          density="compact"
          hide-details
          class="cream-input"
          style="max-width: 320px"
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
            style="min-width: 140px"
            prepend-inner-icon="mdi-filter-variant"
            class="cream-select text-detail"
            color="primary"
            base-color="grey-lighten-1"
          ></v-select>

          <v-select
            :items="['All Statuses', 'Active', 'Inactive']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 130px"
            class="cream-select text-detail"
            color="primary"
            base-color="grey-lighten-1"
          ></v-select>

          <v-btn
            variant="outlined"
            color="grey-darken-1"
            class="modern-action-btn secondary border"
            height="32"
            width="32"
            icon="mdi-dots-horizontal"
          ></v-btn>
        </div>
      </div>

      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="admins"
        :search="search"
        class="premium-table"
        hover
      >
        <!-- Admin Name with Image Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="32" class="mr-3 elevation-1 border-white">
              <v-img :src="item.image" cover></v-img>
            </v-avatar>
            <div>
              <div class="text-title-small">
                {{ item.name }}
              </div>
              <div class="text-detail-tiny">
                {{ item.email }}
              </div>
            </div>
          </div>
        </template>

        <!-- ID Number Slot -->
        <template v-slot:item.id="{ item }">
          <span class="text-detail-tiny bg-grey-lighten-4 px-2 py-1 rounded">
            {{ item.id }}
          </span>
        </template>

        <!-- Role Slot -->
        <template v-slot:item.role="{ item }">
          <div>
            <div class="text-title-small">
              {{ item.role }}
            </div>
            <div class="text-detail-tiny text-grey">
              {{ item.department }}
            </div>
          </div>
        </template>

        <!-- Contact Slot -->
        <template v-slot:item.phone="{ item }">
          <div class="text-title-small">
            {{ item.phone }}
          </div>
        </template>

        <!-- Status Slot -->
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

        <!-- Actions Slot -->
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil-outline"
            variant="text"
            size="x-small"
            color="primary"
          ></v-btn>
          <v-btn
            icon="mdi-delete-outline"
            variant="text"
            size="x-small"
            color="error"
          ></v-btn>
        </template>

        <!-- Bottom Pagination Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-4 border-t">
            <div class="text-detail-tiny">
              Showing 1 to {{ admins.length }} of {{ admins.length }} results
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

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("admin"), disabled: true, to: "/admin" },
];

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
  { title: t("id_number"), key: "id", align: "start" as const, sortable: true },
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

.modern-action-btn {
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 12px !important;
  padding: 0 12px !important;
}

.modern-action-btn.primary {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
}

.metric-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
}

.metric-icon-box {
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intelligence-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
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

.gap-3 {
  gap: 12px;
}
.gap-2 {
  gap: 8px;
}
.gap-1 {
  gap: 4px;
}
</style>
