<template>
  <div class="page">
    <PageHeader
      :title="t('admin')"
      :subtitle="t('role-account-status')"
      icon="mdi-shield-account-outline"
      :breadcrumbs="breadcrumbs"
    >
      <template #actions>
        <v-btn
          variant="flat"
          class="modern-action-btn secondary"
          @click="exportList"
        >
          <v-icon icon="mdi-file-download-outline" start size="18"></v-icon>
          {{ t("export") }}
        </v-btn>
        <v-btn
          variant="flat"
          class="modern-action-btn primary"
          to="/admin/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ t("add") }}
        </v-btn>
      </template>
    </PageHeader>

    <!-- KPI tiles -->
    <v-row class="mb-2 fade-in">
      <v-col v-for="(stat, i) in adminStats" :key="i" cols="6" lg="3">
        <StatCard
          :icon="stat.icon"
          :label="stat.label"
          :value="stat.value"
          :color="stat.color"
          :tint="stat.tint"
          :badge="t('live')"
          pulse
        />
      </v-col>
    </v-row>

    <!-- Users table -->
    <v-card elevation="0" class="panel panel--flush fade-in">
      <div class="panel-head">
        <div>
          <div class="panel-title">{{ t("admin") }}</div>
          <div class="panel-sub">{{ t("administrators-only") }}</div>
        </div>
        <span class="panel-chip">{{ filteredAdmins.length }} {{ t("total") }}</span>
      </div>

      <div class="px-4 px-md-5 pt-4 pt-md-5">
        <div class="filter-bar mb-0">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            :placeholder="t('search')"
            variant="outlined"
            density="compact"
            hide-details
            class="filter-search"
            color="primary"
          ></v-text-field>

          <v-select
            v-model="roleFilter"
            :items="roleFilterItems"
            variant="outlined"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-shield-lock-outline"
            :label="t('role')"
          ></v-select>

          <v-select
            v-model="statusFilter"
            :items="statusFilterItems"
            variant="outlined"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-list-status"
            :label="t('status')"
          ></v-select>
        </div>
      </div>

      <div class="table-wrap mt-4">
        <v-data-table
          :headers="headers"
          :items="filteredAdmins"
          :search="search"
          class="premium-table admin-table"
          hover
        >
          <!-- Identity -->
          <template v-slot:item.name="{ item }">
            <div class="d-flex align-center py-2">
              <div class="avatar-chip mr-3">
                <v-img v-if="item.image" :src="item.image" cover alt=""></v-img>
                <span v-else>{{ (item.name || "?").charAt(0) }}</span>
              </div>
              <div class="min-w-0">
                <div class="cell-title text-truncate">{{ item.name }}</div>
                <div class="cell-sub text-truncate">{{ item.email }}</div>
              </div>
            </div>
          </template>

          <!-- ID -->
          <template v-slot:item.id="{ item }">
            <span class="code-chip">{{ item.id || "—" }}</span>
          </template>

          <!-- Role -->
          <template v-slot:item.role="{ item }">
            <div class="cell-title">{{ item.role }}</div>
            <div class="cell-sub">{{ item.department }}</div>
          </template>

          <!-- Contact -->
          <template v-slot:item.phone="{ item }">
            <span class="cell-title font-weight-medium">{{ item.phone || "—" }}</span>
          </template>

          <!-- Status -->
          <template v-slot:item.status="{ item }">
            <span
              class="status-pill"
              :class="
                item.status === 'Active'
                  ? 'status-pill--green'
                  : item.status === 'Suspended'
                    ? 'status-pill--red'
                    : 'status-pill--grey'
              "
            >
              <span class="status-dot"></span>
              {{
                item.status === "Active"
                  ? t("open")
                  : item.status === "Suspended"
                    ? t("closed")
                    : t("inactive")
              }}
            </span>
          </template>

          <!-- Actions -->
          <template v-slot:item.actions="{ item }">
            <div class="row-actions">
              <v-btn
                icon="mdi-pencil-outline"
                variant="text"
                size="small"
                color="primary"
                @click="openEdit(item)"
              ></v-btn>
              <v-btn
                icon="mdi-trash-can-outline"
                variant="text"
                size="small"
                color="error"
                @click="removeAdmin(item)"
              ></v-btn>
            </div>
          </template>

          <template v-slot:no-data>
            <div class="pa-4">
              <EmptyState
                icon="mdi-shield-account-outline"
                :title="t('no-results-found')"
                :description="t('no-data')"
              />
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <!-- Edit user dialog -->
    <v-dialog v-model="editDialog" width="520">
      <v-card class="pa-5 pa-md-6">
        <div class="d-flex align-center mb-5">
          <div class="page-icon mr-3">
            <v-icon size="20">mdi-account-edit-outline</v-icon>
          </div>
          <div class="min-w-0">
            <div class="panel-title">{{ t("edit") }}</div>
            <div class="panel-sub text-truncate">{{ editForm.full_name }}</div>
          </div>
        </div>

        <label class="field-label">{{ t("name") }}</label>
        <v-text-field
          v-model="editForm.full_name"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
        ></v-text-field>

        <v-row dense>
          <v-col cols="12" sm="6">
            <label class="field-label">{{ t("role") }}</label>
            <v-select
              v-model="editForm.role"
              :items="editRoleItems"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <label class="field-label">{{ t("status") }}</label>
            <v-select
              v-model="editForm.status"
              :items="editStatusItems"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-select>
          </v-col>
        </v-row>

        <label class="field-label mt-4">{{ t("phone") }}</label>
        <v-text-field
          v-model="editForm.phone_number"
          variant="outlined"
          density="comfortable"
          hide-details
        ></v-text-field>

        <v-alert
          v-if="editError"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-4"
          >{{ editError }}</v-alert
        >

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn secondary"
            @click="editDialog = false"
          >
            {{ t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            :loading="saving"
            @click="saveEdit"
          >
            {{ t("save") }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTeacherStore } from "~/stores/apiTeacher";
import { useUiStore } from "~/stores/ui";

const { t } = useI18n();

definePageMeta({
  layout: "admin",
});

const search = ref("");
const teacherStore = useTeacherStore();
const ui = useUiStore();

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

onMounted(() => {
  teacherStore.fetchTeachers(100, 1);
});

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("admin"), disabled: true, to: "/admin" },
];

const adminStats = computed(() => [
  {
    label: t("total"),
    value: String(teacherStore.total),
    icon: "mdi-shield-account",
    color: "#0A3154",
    tint: "#E6ECF2",
  },
  {
    label: t("active"),
    value: String(teacherStore.activeCount),
    icon: "mdi-check-circle",
    color: "#059669",
    tint: "#ECFDF5",
  },
  {
    label: t("administrator"),
    value: String(
      teacherStore.teachers.filter((u) => u.role === "admin").length
    ),
    icon: "mdi-crown",
    color: "#4F46E5",
    tint: "#EEF2FF",
  },
  {
    label: t("inactive"),
    value: String(
      teacherStore.teachers.filter((u) => u.status !== "active").length
    ),
    icon: "mdi-clock-outline",
    color: "#D97706",
    tint: "#FFFBEB",
  },
]);

const headers = [
  {
    title: t("admin_name"),
    key: "name",
    align: "start" as const,
    sortable: true,
  },
  { title: t("id"), key: "id", align: "start" as const, sortable: true },
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

const { exportRows } = useExcel();
const exportList = () =>
  exportRows(
    "admins",
    [
      { label: t("id"), key: "id" },
      { label: t("name"), key: "name" },
      { label: t("username"), key: "email" },
      { label: t("role"), key: "role" },
      { label: t("phone"), key: "phone" },
      { label: t("status"), key: "statusRaw" },
    ],
    admins.value
  );

const admins = computed(() =>
  teacherStore.teachers.map((u) => ({
    uuid: u.id,
    id: u.teacher_id,
    name: u.full_name || u.username,
    email: u.username,
    image: u.avatar,
    role: capitalize(u.role),
    roleRaw: u.role,
    department: "@" + u.username,
    phone: u.phone_number,
    genderRaw: u.gender,
    dob: u.dob ? String(u.dob).substring(0, 10) : "",
    status: capitalize(u.status),
    statusRaw: u.status,
  }))
);

// ---- Presentation-only role / status filters for the table ----
const roleFilter = ref<string>("");
const statusFilter = ref<string>("");
const roleFilterItems = computed(() => [
  { title: t("all-roles"), value: "" },
  { title: t("administrator"), value: "admin" },
  { title: t("teacher"), value: "teacher" },
]);
const statusFilterItems = computed(() => [
  { title: t("all-statuses"), value: "" },
  { title: t("active"), value: "active" },
  { title: t("inactive"), value: "inactive" },
]);
const filteredAdmins = computed(() =>
  admins.value.filter(
    (a) =>
      (!roleFilter.value || a.roleRaw === roleFilter.value) &&
      (!statusFilter.value || a.statusRaw === statusFilter.value)
  )
);
// Translated labels for the edit dialog selects (values unchanged).
const editRoleItems = computed(() => [
  { title: t("teacher"), value: "teacher" },
  { title: t("administrator"), value: "admin" },
]);
const editStatusItems = computed(() => [
  { title: t("active"), value: "active" },
  { title: t("inactive"), value: "inactive" },
]);

// ---- Edit / Delete ----
const editDialog = ref(false);
const saving = ref(false);
const editError = ref("");
const editForm = ref({
  uuid: "",
  full_name: "",
  gender: "",
  dob: "",
  phone_number: "",
  role: "teacher",
  status: "active",
});

const openEdit = (item: any) => {
  editError.value = "";
  editForm.value = {
    uuid: item.uuid,
    full_name: item.name,
    gender: item.genderRaw || "male",
    dob: item.dob || "",
    phone_number: item.phone || "",
    role: item.roleRaw || "teacher",
    status: item.statusRaw || "active",
  };
  editDialog.value = true;
};

const saveEdit = async () => {
  saving.value = true;
  try {
    await teacherStore.updateTeacher(editForm.value.uuid, {
      full_name: editForm.value.full_name,
      gender: editForm.value.gender,
      dob: editForm.value.dob,
      phone_number: editForm.value.phone_number,
      role: editForm.value.role,
      status: editForm.value.status,
    });
    editDialog.value = false;
    await teacherStore.fetchTeachers(100, 1);
  } catch (error: any) {
    editError.value = error.response?.data?.message || "Failed to update.";
  } finally {
    saving.value = false;
  }
};

const removeAdmin = async (item: any) => {
  const ok = await ui.confirm({
    message: t("are_you_sure_delete"),
    confirmText: t("delete"),
    icon: "mdi-delete-outline",
  });
  if (!ok) return;
  try {
    await teacherStore.deleteTeacher(item.uuid);
    await teacherStore.fetchTeachers(100, 1);
    ui.notify(t("deleted_successfully"), "success");
  } catch (error) {
    ui.notify("Failed to delete.", "error");
  }
};
</script>

<style scoped>
/* Columns keep a sensible minimum width; .table-wrap scrolls horizontally on
   phones instead of squashing the cells. */
.admin-table {
  min-width: 720px;
}
.admin-table :deep(.v-data-table__td:first-child),
.admin-table :deep(.v-data-table__th:first-child) {
  padding-left: 20px;
}
.admin-table :deep(.v-data-table__td:last-child),
.admin-table :deep(.v-data-table__th:last-child) {
  padding-right: 20px;
}
</style>
