<template>
  <div class="page">
    <!-- Header: title, breadcrumbs and primary actions -->
    <PageHeader
      :title="t('students')"
      :subtitle="t('enrolled-students')"
      icon="mdi-account-group-outline"
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
          to="/students/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ t("enroll") }} {{ t("students") }}
        </v-btn>
      </template>
    </PageHeader>

    <!-- KPI cards (2 per row on phones, 4 on desktop) -->
    <v-row class="mb-2 fade-in">
      <v-col v-for="(stat, i) in studentStats" :key="i" cols="6" lg="3">
        <StatCard
          :icon="stat.icon"
          :label="stat.label"
          :value="stat.value"
          :color="statPalette[stat.color]?.color"
          :tint="statPalette[stat.color]?.tint"
          :badge="t('live')"
          pulse
        />
      </v-col>
    </v-row>

    <!-- Student list -->
    <v-card elevation="0" class="panel panel--flush fade-in">
      <div class="panel-head">
        <div class="min-w-0">
          <div class="panel-title">{{ t("students") }}</div>
          <div class="panel-sub">
            {{ t("showing") }} 1 {{ t("to") }} {{ students.length }}
            {{ t("of") }} {{ studentStore.total }} {{ t("records") }}
          </div>
        </div>
        <span class="panel-chip panel-chip--teal">
          {{ filteredStudents.length }} {{ t("total") }}
        </span>
      </div>

      <!-- Search + contextual filters -->
      <div class="list-toolbar">
        <div class="filter-bar">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            :placeholder="t('search')"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            color="primary"
            class="filter-search"
          ></v-text-field>

          <v-select
            v-model="selectedClass"
            :items="classOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
            color="primary"
            prepend-inner-icon="mdi-google-classroom"
            :no-data-text="t('no-classrooms')"
          ></v-select>

          <v-select
            v-model="selectedStatus"
            :items="statusOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
            color="primary"
            prepend-inner-icon="mdi-filter-variant"
          ></v-select>
        </div>

        <v-alert
          v-if="studentStore.error"
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="mb-4"
        >
          {{ studentStore.error }}
        </v-alert>
      </div>

      <!-- Data table (scrolls horizontally inside the card on small screens) -->
      <div class="table-wrap">
        <v-data-table
          :headers="headers"
          :items="filteredStudents"
          :search="search"
          :loading="studentStore.loading"
          class="premium-table"
          hover
        >
          <template v-slot:no-data>
            <div class="pa-4">
              <EmptyState
                icon="mdi-account-search-outline"
                :title="t('no-students-found')"
              />
            </div>
          </template>

          <!-- Student identity -->
          <template v-slot:item.name="{ item }">
            <div class="d-flex align-center ga-3 py-2">
              <div class="avatar-chip">
                <v-img
                  v-if="item.avatar"
                  :src="item.avatar"
                  cover
                  alt=""
                  width="36"
                  height="36"
                ></v-img>
                <v-icon v-else size="18">mdi-account</v-icon>
              </div>
              <div class="min-w-0">
                <div class="cell-title text-truncate">{{ item.name }}</div>
                <div class="cell-sub text-truncate">{{ item.email }}</div>
              </div>
            </div>
          </template>

          <!-- Student ID -->
          <template v-slot:item.studentId="{ item }">
            <span class="code-chip">{{ item.studentId }}</span>
          </template>

          <!-- Class / grade -->
          <template v-slot:item.grade="{ item }">
            <div class="cell-title">{{ item.className }}</div>
            <div class="cell-sub">{{ item.gradeName }}</div>
          </template>

          <!-- Guardian -->
          <template v-slot:item.parentContact="{ item }">
            <div class="cell-title">{{ item.parentContact }}</div>
            <div class="cell-sub">{{ item.parentName }}</div>
          </template>

          <!-- Status -->
          <template v-slot:item.status="{ item }">
            <span class="status-pill" :class="statusPillClass(item.status)">
              <span class="status-dot"></span>
              {{ item.status === "Active" ? t("open") : t("closed") }}
            </span>
          </template>

          <!-- Row actions -->
          <template v-slot:item.actions="{ item }">
            <div class="row-actions">
              <v-btn
                :icon="
                  item.statusRaw === 'active'
                    ? 'mdi-account-cancel-outline'
                    : 'mdi-account-check-outline'
                "
                variant="text"
                size="small"
                :color="item.statusRaw === 'active' ? 'warning' : 'success'"
                :title="item.statusRaw === 'active' ? t('closed') : t('open')"
                @click="requestToggle(item)"
              ></v-btn>
              <v-btn
                icon="mdi-pencil-outline"
                variant="text"
                size="small"
                color="primary"
                :title="t('edit')"
                :to="`/students/edit/${item.uuid}`"
              ></v-btn>
              <v-btn
                icon="mdi-trash-can-outline"
                variant="text"
                size="small"
                color="error"
                :title="t('delete')"
                @click="requestDelete(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </div>
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
  </div>
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
  { title: t("all-classes"), value: null },
  ...classroomStore.classrooms.map((c: any) => ({
    title: c.classroom_name || c.classroom_code,
    value: c.id,
  })),
]);

const statusOptions = [
  { title: t("all-status"), value: null },
  { title: t("status-active"), value: "active" },
  { title: t("status-inactive"), value: "inactive" },
  { title: t("status-block"), value: "block" },
];

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("students"), disabled: true, to: "/students" },
];

const studentStats = computed(() => [
  {
    label: t("total-students"),
    value: String(studentStore.total),
    icon: "mdi-account-group",
    color: "blue",
  },
  {
    label: t("active-enrollment"),
    value: String(studentStore.activeCount),
    icon: "mdi-check-circle",
    color: "green",
  },
  {
    label: t("inactive-students"),
    value: String(
      studentStore.students.filter(
        (s) => s.status && s.status.toLowerCase() !== "active"
      ).length
    ),
    icon: "mdi-account-plus",
    color: "purple",
  },
  {
    label: t("loaded-count"),
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
    title: t("student-id"),
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
const { mediaUrl } = useMedia();
const { exportRows } = useExcel();
const exportList = () =>
  exportRows(
    "students",
    [
      { label: t("student-id"), key: "studentId" },
      { label: t("name"), key: "name" },
      { label: t("gender"), key: "genderRaw" },
      { label: t("class"), key: "className" },
      { label: t("grade"), key: "gradeName" },
      { label: t("phone"), key: "phoneRaw" },
      { label: t("guardian-name"), key: "parentName" },
      { label: t("parentphone"), key: "parentContact" },
    ],
    students.value
  );

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
      avatar: s.avatar ? mediaUrl(s.avatar as string) : "",
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
    title: t("delete-student-title"),
    message: `"${item.name}" ${t("are_you_sure_delete")}`,
    confirmText: t("delete"),
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
    title: closing ? t("close-account-title") : t("open-account-title"),
    message: closing
      ? `"${item.name}" ${t("account-will-close")}`
      : `"${item.name}" ${t("account-will-open")}`,
    confirmText: closing ? t("closed") : t("open"),
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

// Presentation-only: hex accents for the StatCard tiles, keyed by the colour
// names used in `studentStats`.
const statPalette: Record<string, { color: string; tint: string }> = {
  blue: { color: "#0A3154", tint: "#E6ECF2" },
  green: { color: "#10B981", tint: "#ECFDF5" },
  purple: { color: "#7C3AED", tint: "#F5F3FF" },
  orange: { color: "#F59E0B", tint: "#FFFBEB" },
};

// Presentation-only: status-pill modifier class for a lifecycle status.
const statusPillClass = (status: string) => {
  switch ((status || "").toLowerCase()) {
    case "active":
      return "status-pill--green";
    case "graduated":
      return "status-pill--indigo";
    case "block":
      return "status-pill--red";
    default:
      return "status-pill--grey";
  }
};
</script>

<style scoped>
/* Padded area (filters + alert) above the table inside the flush panel. */
.list-toolbar {
  padding: 16px 16px 0;
}
@media (min-width: 960px) {
  .list-toolbar {
    padding: 20px 24px 0;
  }
}

/* Keep the table readable on phones; .table-wrap scrolls it horizontally. */
.table-wrap :deep(table) {
  min-width: 760px;
}
</style>
