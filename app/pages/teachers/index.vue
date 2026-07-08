<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <div class="text-title mb-1">
          {{ t("management") }} {{ t("teachers") }}
        </div>
        <div class="text-detail">
          {{ t("manage-faculty-desc") }}
        </div>
      </div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="flat"
          color="white"
          class="modern-action-btn secondary border"
          height="36"
          to="/teachers/organization"
        >
          <v-icon icon="mdi-sitemap-outline" start size="18"></v-icon>
          {{ t("organization") }}
        </v-btn>

        <v-btn
          variant="flat"
          color="white"
          class="modern-action-btn secondary border"
          height="36"
        >
          <v-icon icon="mdi-file-download-outline" start size="18"></v-icon>
          {{ t("export") }}
        </v-btn>

        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="36"
          to="/teachers/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in teacherStats" :key="i">
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
              rounded="0"
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
        <!-- Searchable teacher-name filter (type to search, pick from the list). -->
        <v-autocomplete
          v-model="selectedName"
          :items="teacherNameOptions"
          prepend-inner-icon="mdi-magnify"
          :placeholder="t('search-teacher-name')"
          :no-data-text="t('no-teachers-found')"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          auto-select-first
          class="cream-input"
          style="max-width: 320px"
          bg-color="white"
          color="primary"
          base-color="grey-lighten-1"
          rounded="0"
        ></v-autocomplete>

        <div class="d-flex gap-2 align-center flex-wrap">
          <v-autocomplete
            v-model="selectedRole"
            :items="roleOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
            rounded="0"
            style="min-width: 150px"
            prepend-inner-icon="mdi-account-cog-outline"
            class="cream-select text-detail"
            color="primary"
            base-color="grey-lighten-1"
          ></v-autocomplete>

          <v-autocomplete
            v-model="selectedStatus"
            :items="statusOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
            rounded="0"
            style="min-width: 150px"
            prepend-inner-icon="mdi-filter-variant"
            class="cream-select text-detail"
            color="primary"
            base-color="grey-lighten-1"
          ></v-autocomplete>
        </div>
      </div>

      <!-- Data Table -->
      <v-alert
        v-if="teacherStore.error"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4"
        >{{ teacherStore.error }}</v-alert
      >

      <v-data-table
        :headers="headers"
        :items="filteredTeachers"
        :search="search"
        :loading="teacherStore.loading"
        class="premium-table"
        hover
      >
        <template v-slot:no-data>
          <div class="text-detail py-8 text-center">{{ t("no-teachers-found") }}</div>
        </template>

        <!-- Teacher Name with Image Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="32" class="mr-3 elevation-1 border-white">
              <v-img :src="item.image" cover></v-img>
            </v-avatar>
            <div>
              <div class="text-title-small">
                {{ item.username }}
              </div>
              <div class="text-detail-tiny">
                {{ item.email || t("no-email") }}
              </div>
            </div>
          </div>
        </template>

        <!-- ID Number Slot -->
        <template v-slot:item.id="{ item }">
          <span class="text-detail-tiny bg-grey-lighten-4 px-2 py-1 rounded-0">
            {{ item.id }}
          </span>
        </template>

        <!-- Subject/Class Slot -->
        <template v-slot:item.teacherSubject="{ item }">
          <div>
            <div class="text-title-small">
              {{ item.teacherSubject }}
            </div>
            <div class="text-detail-tiny text-grey">
              {{ item.grade || "Grade 10-A" }}
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
            :color="
              item.status === 'Active'
                ? 'success'
                : item.status === 'Suspended'
                  ? 'error'
                  : 'grey'
            "
            size="x-small"
            rounded="0"
            variant="flat"
            class="font-weight-black text-uppercase px-2"
          >
            {{ item.status === 'Active'
              ? t('open')
              : item.status === 'Suspended'
                ? t('closed')
                : t('inactive') }}
          </v-chip>
        </template>

        <!-- Actions Slot -->
        <template v-slot:item.actions="{ item }">
          <v-btn
            :icon="
              item.statusRaw === 'active'
                ? 'mdi-account-cancel-outline'
                : 'mdi-account-check-outline'
            "
            variant="text"
            size="x-small"
            :color="item.statusRaw === 'active' ? 'warning' : 'success'"
            :title="item.statusRaw === 'active' ? t('close') : t('open')"
            @click="requestToggle(item)"
          ></v-btn>
          <v-btn
            icon="mdi-pencil-outline"
            variant="text"
            size="x-small"
            color="primary"
            @click="openEdit(item)"
          ></v-btn>
          <v-btn
            icon="mdi-delete-outline"
            variant="text"
            size="x-small"
            color="error"
            @click="requestDelete(item)"
          ></v-btn>
        </template>

        <!-- Bottom Pagination Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-4 border-t">
            <div class="text-detail-tiny">
              {{ t("showing") }} 1-{{ teachers.length }} {{ t("of") }}
              {{ teachers.length }} {{ t("results") }}
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
                class="font-weight-black rounded-0"
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

    <!-- Edit Teacher Dialog -->
    <v-dialog v-model="editDialog" width="560" scrollable>
      <v-card rounded="0" class="pa-6">
        <div class="text-title mb-4">{{ t("edit") }} {{ t("teachers") }}</div>
        <label class="text-detail-tiny mb-1 d-block">{{ t("name") }}</label>
        <v-text-field
          v-model="editForm.full_name"
          variant="outlined"
          density="compact"
          rounded="0"
          hide-details
          class="mb-3"
        ></v-text-field>
        <v-row>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{ t("gender") }}</label>
            <v-select
              v-model="editForm.gender"
              :items="['male', 'female']"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{ t("dob") }}</label>
            <DialogDate
              v-model="showDobPicker"
              :date="editForm.dob"
              @update:date="editForm.dob = $event"
            />
            <v-text-field
              v-model="editForm.dob"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details
              prepend-inner-icon="mdi-calendar"
              readonly
              @click="showDobPicker = true"
            ></v-text-field>
          </v-col>
        </v-row>
        <label class="text-detail-tiny mb-1 mt-3 d-block">{{ t("phone") }}</label>
        <v-text-field
          v-model="editForm.phone_number"
          variant="outlined"
          density="compact"
          rounded="0"
          hide-details
          class="mb-3"
        ></v-text-field>
        <v-row>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{ t("role") }}</label>
            <v-select
              v-model="editForm.role"
              :items="['teacher', 'admin']"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{ t("status") }}</label>
            <v-select
              v-model="editForm.status"
              :items="['active', 'inactive']"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details
            ></v-select>
          </v-col>
        </v-row>

        <v-row class="mt-1">
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{
              t("position")
            }}</label>
            <v-combobox
              v-model="editForm.position"
              :items="positionOptions"
              :placeholder="t('select-or-type')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details
              clearable
            ></v-combobox>
          </v-col>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{
              t("department")
            }}</label>
            <v-combobox
              v-model="editForm.department"
              :items="departmentOptions"
              :placeholder="t('select-or-type')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details
              clearable
            ></v-combobox>
          </v-col>
        </v-row>

        <v-row class="mt-1">
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{ t("layer") }}</label>
            <v-select
              v-model="editForm.layer"
              :items="layerOptions"
              :placeholder="t('select-layer')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details
              clearable
            ></v-select>
          </v-col>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{
              t("reports_to")
            }}</label>
            <v-select
              v-model="editForm.manager_id"
              :items="managerOptions.filter((m) => m.value !== editForm.uuid)"
              :placeholder="t('select-manager-optional')"
              variant="outlined"
              density="compact"
              rounded="0"
              hide-details
              clearable
              :no-data-text="t('no-other-staff')"
            ></v-select>
          </v-col>
        </v-row>

        <v-alert
          v-if="editError"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-4"
          >{{ editError }}</v-alert
        >

        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" @click="editDialog = false">{{
            t("cancel")
          }}</v-btn>
          <v-btn
            color="primary"
            class="modern-action-btn primary"
            :loading="saving"
            @click="saveEdit"
            >{{ t("save") }}</v-btn
          >
        </div>
      </v-card>
    </v-dialog>

    <!-- Confirm popup for delete / block -->
    <ConfirmDialog
      v-model="confirm.show"
      :title="confirm.title"
      :message="confirm.message"
      :confirm-text="confirm.confirmText"
      :color="confirm.color"
      :icon="confirm.icon"
      :loading="confirm.loading"
      @confirm="runConfirm"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  positionOptions,
  departmentOptions,
  layerOptions,
} from "~/utils/orgPresets";
import { useTeacherStore } from "~/stores/apiTeacher";

// Managing teachers (list / edit / delete) is admin-only; teachers are sent to
// the read-only org chart instead.
definePageMeta({ requiresAdmin: true });

const { t } = useI18n();

const search = ref("");
const selectedRole = ref<string | null>(null);
const selectedStatus = ref<string | null>(null);

const roleOptions = [
  { title: t("all-roles"), value: null },
  { title: t("teacher"), value: "teacher" },
  { title: t("admin"), value: "admin" },
];
const statusOptions = [
  { title: t("all-statuses"), value: null },
  { title: t("active"), value: "active" },
  { title: t("inactive"), value: "inactive" },
  { title: t("block"), value: "block" },
];

const teacherStore = useTeacherStore();

onMounted(() => {
  teacherStore.fetchTeachers(100, 1);
});

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("teachers"), disabled: true, to: "/teachers" },
];

const teacherStats = computed(() => [
  {
    label: t("total-teachers"),
    value: String(teacherStore.total),
    icon: "mdi-account-group",
    color: "blue",
  },
  {
    label: t("active"),
    value: String(teacherStore.activeCount),
    icon: "mdi-check-circle-outline",
    color: "green",
  },
  {
    label: t("never-logged-in"),
    value: String(
      teacherStore.teachers.filter((tc) => !tc.last_login_at).length
    ),
    icon: "mdi-account-star-outline",
    color: "purple",
  },
  {
    label: t("inactive"),
    value: String(
      teacherStore.teachers.filter(
        (tc) => tc.status?.toLowerCase() !== "active"
      ).length
    ),
    icon: "mdi-clock-time-four-outline",
    color: "orange",
  },
]);

const headers = [
  { title: t("id"), key: "id", align: "start" as const, sortable: true },
  {
    title: t("teachers"),
    key: "name",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("subject"),
    key: "teacherSubject",
    align: "start" as const,
    sortable: true,
  },
  { title: t("phone"), key: "phone", align: "start" as const, sortable: true },
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

// Map live API teachers into the shape this table expects.
const teachers = computed(() =>
  teacherStore.teachers.map((tc) => ({
    uuid: tc.id,
    id: tc.teacher_id,
    image: tc.avatar,
    username: tc.full_name || tc.username,
    fullName: tc.full_name,
    email: tc.username,
    teacherSubject: capitalize(tc.role),
    role: tc.role,
    grade: tc.gender ? capitalize(tc.gender) : "",
    genderRaw: tc.gender,
    dob: tc.dob ? String(tc.dob).substring(0, 10) : "",
    phone: tc.phone_number,
    status: capitalize(tc.status),
    statusRaw: tc.status,
    position: tc.position || "",
    department: tc.department || "",
    layer: tc.layer ?? null,
    managerId: tc.manager_id || null,
  }))
);

// Apply role + status filters (search handled by the data table).
const filteredTeachers = computed(() =>
  teachers.value.filter((tc) => {
    const roleOk =
      !selectedRole.value ||
      (tc.role || "").toLowerCase() === selectedRole.value;
    const statusOk =
      !selectedStatus.value || tc.statusRaw === selectedStatus.value;
    return roleOk && statusOk;
  })
);

// ---- Confirm popup (shared for delete + block) ----
const confirm = ref({
  show: false,
  title: "",
  message: "",
  confirmText: "",
  color: "error",
  icon: "mdi-alert-circle-outline",
  loading: false,
  action: null as null | (() => Promise<void>),
});

const requestDelete = (item: any) => {
  confirm.value = {
    show: true,
    title: t("delete-teacher-title"),
    message: `"${item.username}" ${t("are_you_sure_delete")}`,
    confirmText: t("delete"),
    color: "error",
    icon: "mdi-delete-outline",
    loading: false,
    action: () => doDelete(item),
  };
};

const requestToggle = (item: any) => {
  const closing = item.statusRaw === "active";
  confirm.value = {
    show: true,
    title: closing ? t("close-account-title") : t("open-account-title"),
    message: closing
      ? t("account-will-close", { name: item.username })
      : t("account-will-open", { name: item.username }),
    confirmText: closing ? t("close") : t("open"),
    color: closing ? "warning" : "success",
    icon: closing ? "mdi-account-cancel-outline" : "mdi-account-check-outline",
    loading: false,
    action: () => doToggle(item),
  };
};

const runConfirm = async () => {
  if (!confirm.value.action) return;
  confirm.value.loading = true;
  try {
    await confirm.value.action();
    confirm.value.show = false;
  } catch (error) {
    console.error(error);
  } finally {
    confirm.value.loading = false;
  }
};

const doToggle = async (item: any) => {
  const next = item.statusRaw === "active" ? "inactive" : "active";
  await teacherStore.updateTeacher(item.uuid, { status: next });
  await teacherStore.fetchTeachers(100, 1);
};

const doDelete = async (item: any) => {
  await teacherStore.deleteTeacher(item.uuid);
  await teacherStore.fetchTeachers(100, 1);
};

// Teachers available as "reports to" managers in the edit form.
const managerOptions = computed(() =>
  teachers.value.map((tc) => ({
    title: `${tc.username}${tc.position ? " — " + tc.position : ""}`,
    value: tc.uuid,
  }))
);

// ---- Edit / Delete ----
const editDialog = ref(false);
const saving = ref(false);
const editError = ref("");
const showDobPicker = ref(false);

const editForm = ref({
  uuid: "",
  full_name: "",
  gender: "",
  dob: "",
  phone_number: "",
  role: "teacher",
  status: "active",
  position: "",
  department: "",
  layer: null as number | null,
  manager_id: null as string | null,
});

const openEdit = (item: any) => {
  editError.value = "";
  editForm.value = {
    uuid: item.uuid,
    full_name: item.fullName || item.username,
    gender: item.genderRaw || "",
    dob: item.dob || "",
    phone_number: item.phone || "",
    role: item.role || "teacher",
    status: item.statusRaw || "active",
    position: item.position || "",
    department: item.department || "",
    layer: item.layer ?? null,
    manager_id: item.managerId || null,
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
      position: editForm.value.position,
      department: editForm.value.department,
      layer: editForm.value.layer,
      manager_id: editForm.value.manager_id,
    });
    editDialog.value = false;
    await teacherStore.fetchTeachers(100, 1);
  } catch (error: any) {
    editError.value = error.response?.data?.message || t("failed-update");
  } finally {
    saving.value = false;
  }
};

</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.gap-4 {
  gap: 16px;
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

.metric-card {
  background: white;
  border: 1px solid #f1f5f9;
}

.metric-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.intelligence-card {
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

.cream-select :deep(.v-field__outline__start),
.cream-select :deep(.v-field__outline__end),
.cream-select :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.border-white {
  border: 1.5px solid #ffffff;
}

.border-t {
  border-top: 1px solid #f1f5f9;
}
</style>
