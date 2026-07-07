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
          rounded="0"
        ></v-text-field>

        <div class="d-flex gap-2 align-center flex-wrap">
          <v-select
            v-model="selectedClass"
            :items="classOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
            rounded="0"
            style="min-width: 170px"
            prepend-inner-icon="mdi-google-classroom"
            class="cream-select text-detail"
            no-data-text="No classrooms yet"
          ></v-select>

          <v-select
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
          ></v-select>
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
        :items="filteredStudents"
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
              rounded="0"
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
            class="text-detail-tiny bg-grey-lighten-4 px-2 py-1 rounded-0 font-weight-black"
          >
            {{ item.studentId }}
          </span>
        </template>

        <!-- Curricular Level Slot -->
        <template v-slot:item.grade="{ item }">
          <div>
            <div class="text-title-small">{{ item.className }}</div>
            <div class="text-detail-tiny text-grey">
              {{ item.gradeName }}
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
              :icon="
                item.statusRaw === 'active'
                  ? 'mdi-account-cancel-outline'
                  : 'mdi-account-check-outline'
              "
              variant="text"
              size="x-small"
              :color="item.statusRaw === 'active' ? 'warning' : 'success'"
              :title="item.statusRaw === 'active' ? 'ປິດ (close)' : 'ເປີດ (open)'"
              @click="requestToggle(item)"
            ></v-btn>
            <v-btn
              icon="mdi-pencil-outline"
              variant="text"
              size="x-small"
              color="primary"
              :to="`/students/edit/${item.uuid}`"
            ></v-btn>
            <v-btn
              icon="mdi-trash-can-outline"
              variant="text"
              size="x-small"
              color="error"
              @click="requestDelete(item)"
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
                class="font-weight-black rounded-0"
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
import { useStudentStore } from "~/stores/apiStudent";
import { useClassroomStore } from "~/stores/apiClassroom";

const { t } = useI18n();

const search = ref("");
const selectedClass = ref<string | null>(null);
const selectedStatus = ref<string | null>(null);

const studentStore = useStudentStore();
const classroomStore = useClassroomStore();

onMounted(() => {
  studentStore.fetchStudents();
  classroomStore.fetchClassrooms(100);
});

// Classroom id -> { name, grade } for filtering + display.
const classroomMap = computed<Record<string, { name: string; grade: string }>>(
  () => {
    const map: Record<string, { name: string; grade: string }> = {};
    classroomStore.classrooms.forEach((c: any) => {
      map[c.id] = {
        name: c.classroom_name || c.classroom_code || "",
        grade: c.gradeLevel?.grade_level_name || "",
      };
    });
    return map;
  }
);

// Class filter dropdown (real classrooms).
const classOptions = computed(() => [
  { title: "ທຸກຫ້ອງ / All Classes", value: null },
  ...classroomStore.classrooms.map((c: any) => ({
    title: c.classroom_name || c.classroom_code,
    value: c.id,
  })),
]);

const statusOptions = [
  { title: "ທຸກສະຖານະ / All", value: null },
  { title: "Active", value: "active" },
  { title: "Inactive", value: "inactive" },
  { title: "Block", value: "block" },
];

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
    const classId = (s.class_id as string) || "";
    const room = classroomMap.value[classId];
    return {
      uuid: s.id,
      studentId: id,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(String(id))}`,
      name: fullName,
      firstName: s.first_name || s.firstName || "",
      lastName: s.last_name || s.lastName || "",
      genderRaw: s.gender || "male",
      email: s.email || "",
      classId,
      className: room?.name || s.class_name || "—",
      gradeName: room?.grade || s.grade || "",
      parentContact: s.parent_number || s.parent_phone || s.phone_number || "",
      phoneRaw: s.phone_number || s.phone || "",
      parentName: s.parent_name || s.father_name || s.mother_name || "",
      status: capitalize(s.status) || "Active",
      statusRaw: s.status || "active",
    };
  })
);

// Apply class + status filters (search is handled by the data table).
const filteredStudents = computed(() =>
  students.value.filter((s) => {
    const classOk = !selectedClass.value || s.classId === selectedClass.value;
    const statusOk =
      !selectedStatus.value || s.statusRaw === selectedStatus.value;
    return classOk && statusOk;
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
    title: "ລຶບນັກຮຽນ? / Delete student?",
    message: `"${item.name}" ${t("are_you_sure_delete")}`,
    confirmText: "ລຶບ / Delete",
    color: "error",
    icon: "mdi-trash-can-outline",
    loading: false,
    action: () => doDelete(item),
  };
};

const requestToggle = (item: any) => {
  const closing = item.statusRaw === "active";
  confirm.value = {
    show: true,
    title: closing ? "ປິດບັນຊີ? / Close account?" : "ເປີດບັນຊີ? / Open account?",
    message: closing
      ? `"${item.name}" ຈະຖືກປິດ (inactive).`
      : `"${item.name}" ຈະຖືກເປີດຄືນ (active).`,
    confirmText: closing ? "ປິດ / Close" : "ເປີດ / Open",
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
  await studentStore.updateStudent(item.uuid, { status: next });
  await studentStore.fetchStudents();
};

const doDelete = async (item: any) => {
  await studentStore.deleteStudent(item.uuid);
  await studentStore.fetchStudents();
};

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

</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.metric-card {
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
