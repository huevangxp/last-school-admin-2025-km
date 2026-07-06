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
          Manage your faculty members and their assignments.
        </div>
      </div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
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
            :items="[
              'All Subjects',
              'Math',
              'Physics',
              'Biology',
              'Chemistry',
              'English',
            ]"
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
            :items="['All Statuses', 'Active', 'Inactive', 'Suspended']"
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
        :items="teachers"
        :search="search"
        :loading="teacherStore.loading"
        class="premium-table"
        hover
      >
        <template v-slot:no-data>
          <div class="text-detail py-8 text-center">No teachers found.</div>
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
                {{ item.email || "No email" }}
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
            @click="openEdit(item)"
          ></v-btn>
          <v-btn
            icon="mdi-delete-outline"
            variant="text"
            size="x-small"
            color="error"
            @click="removeTeacher(item)"
          ></v-btn>
        </template>

        <!-- Bottom Pagination Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-4 border-t">
            <div class="text-detail-tiny">
              Showing 1 to {{ teachers.length }} of
              {{ teachers.length }} results
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

    <!-- Organization Chart -->
    <v-card elevation="0" class="intelligence-card pa-4 mt-6">
      <div class="d-flex align-center justify-space-between mb-2">
        <div class="d-flex align-center">
          <v-avatar color="teal-lighten-5" size="40" class="mr-3 rounded-lg">
            <v-icon color="teal-darken-1" size="20"
              >mdi-sitemap-outline</v-icon
            >
          </v-avatar>
          <div>
            <div class="text-title">Organization Chart</div>
            <div class="text-detail">Faculty hierarchy & reporting structure</div>
          </div>
        </div>
        <v-btn
          :icon="showChart ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          variant="text"
          color="grey-darken-1"
          size="small"
          @click="showChart = !showChart"
        ></v-btn>
      </div>

      <v-expand-transition>
        <div v-show="showChart" class="org-scroll pt-4">
          <div class="tree">
            <ul>
              <li>
                <!-- Root: School -->
                <div class="org-node org-root">
                  <v-avatar size="44" class="mb-1 org-root-logo">
                    <v-img src="/logo.png" contain></v-img>
                  </v-avatar>
                  <div class="org-node-name">{{ t("schoolmanagement") }}</div>
                  <div class="org-node-role">{{ t("management") }}</div>
                </div>

                <ul v-if="admins.length || staff.length">
                  <!-- Administration branch -->
                  <li v-if="admins.length">
                    <div class="org-node org-dept">
                      <v-avatar size="38" color="teal-lighten-4" class="mb-1">
                        <v-icon color="teal-darken-2" size="20"
                          >mdi-shield-account-outline</v-icon
                        >
                      </v-avatar>
                      <div class="org-node-name">Administration</div>
                      <div class="org-node-role">
                        {{ admins.length }}
                        {{ admins.length === 1 ? "member" : "members" }}
                      </div>
                    </div>
                    <ul>
                      <li v-for="a in admins" :key="a.uuid">
                        <div class="org-node org-person">
                          <v-avatar size="40" class="mb-1 border-white elevation-1">
                            <v-img :src="a.image" cover></v-img>
                          </v-avatar>
                          <div class="org-node-name">{{ a.username }}</div>
                          <div class="org-node-role">Admin</div>
                          <v-chip
                            :color="a.status === 'Active' ? 'success' : 'grey'"
                            size="x-small"
                            variant="tonal"
                            class="font-weight-black text-uppercase mt-1"
                          >
                            {{ a.status }}
                          </v-chip>
                        </div>
                      </li>
                    </ul>
                  </li>

                  <!-- Teaching staff branch -->
                  <li v-if="staff.length">
                    <div class="org-node org-dept">
                      <v-avatar size="38" color="teal-lighten-4" class="mb-1">
                        <v-icon color="teal-darken-2" size="20"
                          >mdi-account-tie-outline</v-icon
                        >
                      </v-avatar>
                      <div class="org-node-name">Teaching Staff</div>
                      <div class="org-node-role">
                        {{ staff.length }}
                        {{ staff.length === 1 ? "member" : "members" }}
                      </div>
                    </div>
                    <ul>
                      <li v-for="s in staff" :key="s.uuid">
                        <div class="org-node org-person">
                          <v-avatar size="40" class="mb-1 border-white elevation-1">
                            <v-img :src="s.image" cover></v-img>
                          </v-avatar>
                          <div class="org-node-name">{{ s.username }}</div>
                          <div class="org-node-role">
                            {{ s.grade || "Teacher" }}
                          </div>
                          <v-chip
                            :color="s.status === 'Active' ? 'success' : 'grey'"
                            size="x-small"
                            variant="tonal"
                            class="font-weight-black text-uppercase mt-1"
                          >
                            {{ s.status }}
                          </v-chip>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div
            v-if="!admins.length && !staff.length"
            class="text-detail py-6 text-center"
          >
            No faculty members to display yet.
          </div>
        </div>
      </v-expand-transition>
    </v-card>

    <!-- Edit Teacher Dialog -->
    <v-dialog v-model="editDialog" width="480">
      <v-card rounded="xl" class="pa-6">
        <div class="text-title mb-4">{{ t("edit") }} {{ t("teachers") }}</div>
        <label class="text-detail-tiny mb-1 d-block">{{ t("name") }}</label>
        <v-text-field
          v-model="editForm.full_name"
          variant="outlined"
          density="compact"
          rounded="lg"
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
              rounded="lg"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{ t("dob") }}</label>
            <v-text-field
              v-model="editForm.dob"
              type="date"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <label class="text-detail-tiny mb-1 mt-3 d-block">{{ t("phone") }}</label>
        <v-text-field
          v-model="editForm.phone_number"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          class="mb-3"
        ></v-text-field>
        <label class="text-detail-tiny mb-1 d-block">{{ t("status") }}</label>
        <v-select
          v-model="editForm.status"
          :items="['active', 'inactive']"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
        ></v-select>

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
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTeacherStore } from "~/stores/apiTeacher";

const { t } = useI18n();

const search = ref("");

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
    label: "Total Teachers",
    value: String(teacherStore.total),
    icon: "mdi-account-group",
    color: "blue",
  },
  {
    label: "Active",
    value: String(teacherStore.activeCount),
    icon: "mdi-check-circle-outline",
    color: "green",
  },
  {
    label: "Never Logged In",
    value: String(
      teacherStore.teachers.filter((tc) => !tc.last_login_at).length
    ),
    icon: "mdi-account-star-outline",
    color: "purple",
  },
  {
    label: "Inactive",
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
  }))
);

// ---- Organization chart ----
const showChart = ref(true);
const admins = computed(() =>
  teachers.value.filter((x) => (x.role || "").toLowerCase() === "admin")
);
const staff = computed(() =>
  teachers.value.filter((x) => (x.role || "").toLowerCase() !== "admin")
);

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
    full_name: item.fullName || item.username,
    gender: item.genderRaw || "",
    dob: item.dob || "",
    phone_number: item.phone || "",
    role: item.role || "teacher",
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

const removeTeacher = async (item: any) => {
  if (!confirm(t("are_you_sure_delete"))) return;
  try {
    await teacherStore.deleteTeacher(item.uuid);
    await teacherStore.fetchTeachers(100, 1);
  } catch (error) {
    console.error(error);
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

/* ---- Organization Chart ---- */
.org-scroll {
  overflow-x: auto;
  overflow-y: hidden;
}

.org-scroll::-webkit-scrollbar {
  height: 6px;
}
.org-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.tree {
  display: inline-block;
  min-width: 100%;
  padding: 0 8px;
  white-space: nowrap;
}

.tree ul {
  display: flex;
  justify-content: center;
  padding-top: 26px;
  position: relative;
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.tree li {
  list-style: none;
  text-align: center;
  position: relative;
  padding: 26px 14px 0;
}

/* Connector lines */
.tree li::before,
.tree li::after {
  content: "";
  position: absolute;
  top: 0;
  right: 50%;
  border-top: 2px solid #d9e2ec;
  width: 50%;
  height: 26px;
}
.tree li::after {
  right: auto;
  left: 50%;
  border-left: 2px solid #d9e2ec;
}
.tree li:only-child::after,
.tree li:only-child::before {
  display: none;
}
.tree li:only-child {
  padding-top: 0;
}
.tree li:first-child::before,
.tree li:last-child::after {
  border: 0 none;
}
.tree li:last-child::before {
  border-right: 2px solid #d9e2ec;
  border-radius: 0 6px 0 0;
}
.tree li:first-child::after {
  border-radius: 6px 0 0 0;
}
.tree ul ul::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  border-left: 2px solid #d9e2ec;
  width: 0;
  height: 26px;
}
.tree > ul {
  padding-top: 0;
}

/* Node card */
.org-node {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 132px;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 14px -8px rgba(15, 23, 42, 0.18);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  white-space: normal;
  vertical-align: top;
}

.org-node:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px -12px rgba(15, 23, 42, 0.3);
}

.org-node-name {
  font-weight: 800;
  font-size: 13px;
  color: #0f172a;
  line-height: 1.2;
}

.org-node-role {
  font-size: 10.5px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

/* Root (school) node */
.org-root {
  background: linear-gradient(135deg, #14b8a5 0%, #0d9488 100%);
  border: 0;
  box-shadow: 0 10px 24px -10px rgba(13, 148, 136, 0.5);
}
.org-root .org-node-name {
  color: #ffffff;
}
.org-root .org-node-role {
  color: rgba(255, 255, 255, 0.8);
}
.org-root-logo {
  background: #ffffff;
  padding: 6px;
}

/* Department nodes */
.org-dept {
  background: #f0fdfa;
  border-color: #99f6e4;
}
.org-dept .org-node-name {
  color: #0d9488;
}
</style>
