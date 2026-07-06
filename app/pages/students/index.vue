<template>
  <v-container fluid class="pa-6 dashboard-container">
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
          to="/students/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ t("enroll") }} {{ t("students") }}
        </v-btn>
      </div>
    </div>

    <!-- Section: High-Signal Metrics -->
    <v-row class="mb-6 ga-y-4 fade-in">
      <v-col cols="12" sm="6" lg="3" v-for="(stat, i) in studentStats" :key="i">
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
                LIVE CAPTURE
              </v-chip>
            </div>

            <div class="metric-info">
              <div class="text-detail mb-1 uppercase">{{ stat.label }}</div>
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
            :items="[
              'All Grades',
              'Grade 9',
              'Grade 10',
              'Grade 11',
              'Grade 12',
            ]"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 150px"
            prepend-inner-icon="mdi-school-outline"
            class="cream-select text-detail"
          ></v-select>

          <v-select
            :items="['All Statuses', 'Active', 'Inactive', 'Graduated']"
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

      <v-alert
        v-if="studentStore.error"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4"
        >{{ studentStore.error }}</v-alert
      >

      <!-- Data Intelligence Grid -->
      <v-data-table
        :headers="headers"
        :items="students"
        :search="search"
        :loading="studentStore.loading"
        class="premium-table"
        hover
      >
        <template v-slot:no-data>
          <div class="text-detail py-8 text-center">No students found.</div>
        </template>
        <!-- Student Identity Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              size="36"
              class="mr-3 elevation-1 border-white"
              rounded="lg"
            >
              <v-img :src="item.avatar" cover></v-img>
            </v-avatar>
            <div>
              <div class="text-title-small">{{ item.name }}</div>
              <div class="text-detail-tiny">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <!-- Academic Identifier Slot -->
        <template v-slot:item.studentId="{ item }">
          <span
            class="text-detail-tiny bg-grey-lighten-4 px-2 py-1 rounded-md font-weight-black"
          >
            {{ item.studentId }}
          </span>
        </template>

        <!-- Curricular Level Slot -->
        <template v-slot:item.grade="{ item }">
          <div>
            <div class="text-title-small">{{ item.grade }}</div>
            <div class="text-detail-tiny text-grey">
              {{ item.class || "Class A" }}
            </div>
          </div>
        </template>

        <!-- Guardian Intelligence Slot -->
        <template v-slot:item.parentContact="{ item }">
          <div>
            <div class="text-detail font-weight-bold">
              {{ item.parentContact }}
            </div>
            <div class="text-detail-tiny text-grey">{{ item.parentName }}</div>
          </div>
        </template>

        <!-- Lifecycle Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
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
              @click="openEdit(item)"
            ></v-btn>
            <v-btn
              icon="mdi-trash-can-outline"
              variant="text"
              size="x-small"
              color="error"
              @click="removeStudent(item)"
            ></v-btn>
          </div>
        </template>

        <!-- Navigation Architecture Slot -->
        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-4 border-t">
            <div class="text-detail-tiny">
              Displaying 1 to {{ students.length }} of
              {{ studentStore.total }} academic records
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
                variant="text"
                color="grey-darken-1"
                size="x-small"
                class="font-weight-black"
                style="min-width: 24px; height: 24px"
              >
                2
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

    <!-- Edit Student Dialog -->
    <v-dialog v-model="editDialog" width="480">
      <v-card rounded="xl" class="pa-6">
        <div class="text-title mb-4">{{ t("edit") }} {{ t("students") }}</div>
        <v-row>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{
              t("firstname")
            }}</label>
            <v-text-field
              v-model="editForm.first_name"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{
              t("lastname")
            }}</label>
            <v-text-field
              v-model="editForm.last_name"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-1">
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
            <label class="text-detail-tiny mb-1 d-block">{{ t("phone") }}</label>
            <v-text-field
              v-model="editForm.phone_number"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <label class="text-detail-tiny mb-1 mt-3 d-block">{{ t("status") }}</label>
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
import { useStudentStore } from "~/stores/apiStudent";

const { t } = useI18n();

const search = ref("");

const studentStore = useStudentStore();

onMounted(() => {
  studentStore.fetchStudents();
});

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("students"), disabled: true, to: "/students" },
];

const studentStats = computed(() => [
  {
    label: "total students",
    value: String(studentStore.total),
    icon: "mdi-account-group",
    color: "blue",
  },
  {
    label: "active enrollment",
    value: String(studentStore.activeCount),
    icon: "mdi-check-circle",
    color: "green",
  },
  {
    label: "inactive",
    value: String(
      studentStore.students.filter(
        (s) => s.status && s.status.toLowerCase() !== "active"
      ).length
    ),
    icon: "mdi-account-plus",
    color: "purple",
  },
  {
    label: "loaded",
    value: String(studentStore.students.length),
    icon: "mdi-clock-time-four-outline",
    color: "orange",
  },
]);

const headers = [
  {
    title: t("firstname"),
    key: "name",
    align: "start" as const,
    sortable: true,
  },
  {
    title: "STUDENT ID",
    key: "studentId",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("classes"),
    key: "grade",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("parent"),
    key: "parentContact",
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

// Map live API students into the shape this table expects. Field names are
// resolved defensively because the backend list is currently empty.
const students = computed(() =>
  studentStore.students.map((s) => {
    const fullName =
      s.full_name ||
      [s.first_name || s.firstName, s.last_name || s.lastName]
        .filter(Boolean)
        .join(" ") ||
      "—";
    const id = s.student_id || s.studentId || s.id || "";
    return {
      uuid: s.id,
      studentId: id,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(String(id))}`,
      name: fullName,
      firstName: s.first_name || s.firstName || "",
      lastName: s.last_name || s.lastName || "",
      genderRaw: s.gender || "male",
      email: s.email || "",
      grade: s.grade || s.class_name || "—",
      class: s.class_name || s.section || "",
      parentContact: s.parent_phone || s.phone_number || s.phone || "",
      phoneRaw: s.phone_number || s.phone || "",
      parentName: s.parent_name || s.father_name || s.mother_name || "",
      status: capitalize(s.status) || "Active",
      statusRaw: s.status || "active",
    };
  })
);

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "success";
    case "graduated":
      return "info";
    case "inactive":
      return "grey";
    default:
      return "grey";
  }
};

// ---- Edit / Delete ----
const editDialog = ref(false);
const saving = ref(false);
const editError = ref("");
const editForm = ref({
  uuid: "",
  first_name: "",
  last_name: "",
  gender: "male",
  phone_number: "",
  status: "active",
});

const openEdit = (item: any) => {
  editError.value = "";
  editForm.value = {
    uuid: item.uuid,
    first_name: item.firstName,
    last_name: item.lastName,
    gender: item.genderRaw,
    phone_number: item.phoneRaw,
    status: item.statusRaw,
  };
  editDialog.value = true;
};

const saveEdit = async () => {
  saving.value = true;
  try {
    await studentStore.updateStudent(editForm.value.uuid, {
      first_name: editForm.value.first_name,
      last_name: editForm.value.last_name,
      gender: editForm.value.gender,
      phone_number: editForm.value.phone_number,
      status: editForm.value.status,
    });
    editDialog.value = false;
    await studentStore.fetchStudents();
  } catch (error: any) {
    editError.value = error.response?.data?.message || "Failed to update.";
  } finally {
    saving.value = false;
  }
};

const removeStudent = async (item: any) => {
  if (!confirm(t("are_you_sure_delete"))) return;
  try {
    await studentStore.deleteStudent(item.uuid);
    await studentStore.fetchStudents();
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

.metric-footer-line {
  height: 3px;
  width: 100%;
  opacity: 0.15;
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
</style>
