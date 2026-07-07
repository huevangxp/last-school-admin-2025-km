<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <div class="text-title mb-1">
          {{ t("management") }} {{ t("classes") }}
        </div>
        <div class="text-detail">{{ t("manage_classes_desc") }}</div>
      </div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="outlined"
          color="teal-darken-1"
          class="modern-action-btn secondary border"
          height="32"
          prepend-icon="mdi-content-copy"
          @click="openClone"
        >
          {{ t("copy_to_new_year") }}
        </v-btn>

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
          to="/class/add"
        >
          {{ $t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in classStats" :key="i">
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
            v-model="selectedGrade"
            :items="gradeFilterOptions"
            item-title="label"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 160px"
            prepend-inner-icon="mdi-filter-variant"
            class="cream-select text-detail"
            color="primary"
            base-color="grey-lighten-1"
          ></v-select>
        </div>
      </div>

      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="classes"
        :search="search"
        :loading="classroomStore.loading"
        class="premium-table"
        hover
      >
        <template v-slot:no-data>
          <div class="text-detail py-8 text-center">{{ t("no_classrooms") }}</div>
        </template>
        <!-- Class Name Slot -->
        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="blue-lighten-5"
              size="32"
              class="mr-3 elevation-1 border-white"
            >
              <v-icon
                icon="mdi-google-classroom"
                size="16"
                color="blue-darken-2"
              ></v-icon>
            </v-avatar>
            <div>
              <div class="text-title-small">{{ item.title }}</div>
              <div class="text-detail-tiny">{{ item.classId }}</div>
            </div>
          </div>
        </template>

        <!-- Grade Slot -->
        <template v-slot:item.grade="{ item }">
          <div class="text-title-small">{{ item.grade }}</div>
          <div class="text-detail-tiny text-grey">{{ item.year }}</div>
        </template>

        <!-- Teacher Slot -->
        <template v-slot:item.teacher="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" class="mr-2 elevation-1">
              <v-img
                :src="`https://ui-avatars.com/api/?name=${item.teacher}&background=random`"
              ></v-img>
            </v-avatar>
            <div>
              <div class="text-title-small">{{ item.teacher }}</div>
              <div class="text-detail-tiny">{{ item.teacherEmail }}</div>
            </div>
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
          <div class="d-flex justify-end ga-1">
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
              @click="removeClassroom(item)"
            ></v-btn>
          </div>
        </template>

        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-4 border-t">
            <div class="text-detail-tiny">
              {{ t("showing") }} 1-{{ classes.length }} {{ t("of") }}
              {{ classes.length }} {{ t("results") }}
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Edit Classroom Dialog -->
    <v-dialog v-model="editDialog" width="480">
      <v-card rounded="lg" class="pa-6">
        <div class="text-title mb-4">{{ t("edit") }} {{ t("classes") }}</div>
        <label class="text-detail-tiny mb-1 d-block">{{ t("name") }}</label>
        <v-text-field
          v-model="editForm.classroom_name"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          class="mb-3"
        ></v-text-field>
        <v-row>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">{{ t("room_number") }}</label>
            <v-text-field
              v-model="editForm.room_number"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block"
              >{{ t("max_students") }} (≤40)</label
            >
            <v-text-field
              v-model="editForm.max_student"
              type="number"
              max="40"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <label class="text-detail-tiny mb-1 mt-3 d-block">{{ t("homeroom_teacher") }}</label>
        <v-select
          v-model="editForm.homeroom_teacher_id"
          :items="teacherStore.teachers"
          item-title="full_name"
          item-value="id"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          class="mb-3"
        ></v-select>
        <label class="text-detail-tiny mb-1 d-block">{{ t("status") }}</label>
        <v-select
          v-model="editForm.classroom_status"
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

    <!-- Clone classrooms to a new academic year -->
    <v-dialog v-model="cloneDialog" width="480">
      <v-card rounded="lg" class="pa-6">
        <div class="d-flex align-center mb-1">
          <v-avatar color="teal-lighten-5" size="36" class="mr-3 rounded-lg">
            <v-icon color="teal-darken-2" size="18">mdi-content-copy</v-icon>
          </v-avatar>
          <div class="text-title">{{ t("copy_classrooms_title") }}</div>
        </div>
        <div class="text-detail mb-4">
          {{ t("copy_classrooms_desc") }}
        </div>

        <label class="text-detail-tiny mb-1 d-block">{{ t("from_year") }}</label>
        <v-select
          v-model="cloneSource"
          :items="classroomStore.academicYears"
          item-title="title"
          item-value="id"
          :placeholder="t('select_source_year')"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          class="mb-3"
        ></v-select>

        <label class="text-detail-tiny mb-1 d-block">{{ t("to_year") }}</label>
        <v-select
          v-model="cloneTarget"
          :items="classroomStore.academicYears"
          item-title="title"
          item-value="id"
          :placeholder="t('select_target_year')"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
        ></v-select>

        <v-alert
          v-if="cloneMsg"
          :type="cloneOk ? 'success' : 'error'"
          variant="tonal"
          density="compact"
          class="mt-4"
          >{{ cloneMsg }}</v-alert
        >

        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" @click="cloneDialog = false">{{
            t("cancel")
          }}</v-btn>
          <v-btn
            color="primary"
            class="modern-action-btn primary"
            :loading="cloning"
            :disabled="!cloneSource || !cloneTarget || cloneSource === cloneTarget"
            @click="doClone"
            >{{ t("copy") }}</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useClassroomStore } from "~/stores/apiClassroom";
import { useTeacherStore } from "~/stores/apiTeacher";
import { useUiStore } from "~/stores/ui";

const { t } = useI18n();

const search = ref("");
const classroomStore = useClassroomStore();
const teacherStore = useTeacherStore();
const ui = useUiStore();

onMounted(() => {
  classroomStore.fetchClassrooms(100);
  classroomStore.fetchAcademicYears();
  classroomStore.fetchGradeLevels();
});

// ---- Grade filter (real grade levels) ----
const selectedGrade = ref<string | null>(null);
const gradeFilterOptions = computed(() => [
  { label: t("all_grades"), value: null },
  ...classroomStore.gradeLevels.map((g: any) => ({
    label: g.grade_level_name,
    value: g.id,
  })),
]);

// ---- Clone classrooms to a new academic year ----
const cloneDialog = ref(false);
const cloning = ref(false);
const cloneSource = ref<string | null>(null);
const cloneTarget = ref<string | null>(null);
const cloneMsg = ref("");
const cloneOk = ref(false);

const openClone = () => {
  cloneMsg.value = "";
  // Default target to the latest year; source to the previous one if any.
  const years = classroomStore.academicYears;
  cloneTarget.value = classroomStore.latestAcademicYearId;
  cloneSource.value =
    years.find((y: any) => y.id !== cloneTarget.value)?.id ?? null;
  cloneDialog.value = true;
};

const doClone = async () => {
  if (!cloneSource.value || !cloneTarget.value) return;
  cloning.value = true;
  cloneMsg.value = "";
  try {
    const res = await classroomStore.cloneClassrooms(
      cloneSource.value,
      cloneTarget.value
    );
    cloneOk.value = true;
    const created = res?.data?.created ?? 0;
    const skipped = res?.data?.skipped?.length ?? 0;
    cloneMsg.value = `ກ໊ອບປີ້ສຳເລັດ ${created} ຫ້ອງ. ຂ້າມ ${skipped} ຫ້ອງ (ມີຢູ່ແລ້ວ).`;
    await classroomStore.fetchClassrooms(100);
  } catch (error: any) {
    cloneOk.value = false;
    cloneMsg.value =
      error.response?.data?.message || "ກ໊ອບປີ້ບໍ່ສຳເລັດ.";
  } finally {
    cloning.value = false;
  }
};

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("classes"), disabled: true, to: "/class" },
];

const classStats = computed(() => {
  const rooms = classroomStore.classrooms;
  const capacity = rooms.reduce(
    (sum, c) => sum + (Number(c.max_student) || 0),
    0
  );
  return [
    {
      label: t("total_classes"),
      value: String(classroomStore.total),
      icon: "mdi-google-classroom",
      color: "blue",
    },
    {
      label: t("active_sections"),
      value: String(
        rooms.filter((c) => c.classroom_status === "active").length
      ),
      icon: "mdi-check-circle",
      color: "green",
    },
    {
      label: t("total_capacity"),
      value: String(capacity),
      icon: "mdi-account-group",
      color: "purple",
    },
    {
      label: t("grade_levels"),
      value: String(new Set(rooms.map((c) => c.grade_level_id)).size),
      icon: "mdi-account-multiple",
      color: "orange",
    },
  ];
});

const headers = [
  {
    title: t("classes"),
    key: "title",
    align: "start" as const,
    sortable: true,
  },
  { title: t("grade"), key: "grade", align: "start" as const, sortable: true },
  {
    title: t("teachers"),
    key: "teacher",
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

const classes = computed(() =>
  classroomStore.classrooms
    .filter((c) => !selectedGrade.value || c.grade_level_id === selectedGrade.value)
    .map((c) => ({
    uuid: c.id,
    classId: c.classroom_code,
    title: c.classroom_name,
    roomNumber: c.room_number,
    maxStudent: c.max_student,
    homeroomTeacherId: c.homeroom_teacher_id,
    statusRaw: c.classroom_status,
    grade: c.gradeLevel?.grade_level_name || "—",
    year: c.academicYear?.title || "—",
    teacher: c.homeroomTeacher?.full_name || "Unassigned",
    teacherEmail: c.homeroomTeacher?.username || "",
    status: c.classroom_status === "active" ? "Active" : "Inactive",
  }))
);

// ---- Edit / Delete ----
const editDialog = ref(false);
const saving = ref(false);
const editError = ref("");
const editForm = ref({
  uuid: "",
  classroom_name: "",
  room_number: "",
  max_student: "",
  homeroom_teacher_id: "",
  classroom_status: "active",
});

const openEdit = (item: any) => {
  editError.value = "";
  teacherStore.fetchTeachers(100, 1);
  editForm.value = {
    uuid: item.uuid,
    classroom_name: item.title || "",
    room_number: item.roomNumber || "",
    max_student: item.maxStudent != null ? String(item.maxStudent) : "",
    homeroom_teacher_id: item.homeroomTeacherId || "",
    classroom_status: item.statusRaw || "active",
  };
  editDialog.value = true;
};

const saveEdit = async () => {
  saving.value = true;
  try {
    await classroomStore.updateClassroom(editForm.value.uuid, {
      classroom_name: editForm.value.classroom_name,
      room_number: editForm.value.room_number,
      max_student: editForm.value.max_student
        ? Number(editForm.value.max_student)
        : null,
      homeroom_teacher_id: editForm.value.homeroom_teacher_id || null,
      classroom_status: editForm.value.classroom_status,
    });
    editDialog.value = false;
    await classroomStore.fetchClassrooms(100);
  } catch (error: any) {
    editError.value = error.response?.data?.message || "Failed to update.";
  } finally {
    saving.value = false;
  }
};

const removeClassroom = async (item: any) => {
  const ok = await ui.confirm({
    message: t("are_you_sure_delete"),
    confirmText: t("delete"),
    icon: "mdi-delete-outline",
  });
  if (!ok) return;
  try {
    await classroomStore.deleteClassroom(item.uuid);
    await classroomStore.fetchClassrooms(100);
    ui.notify(t("deleted_successfully"), "success");
  } catch (error) {
    ui.notify("Failed to delete.", "error");
  }
};
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
  border-radius: 10px !important;
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
  border-radius: 10px !important;
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
</style>
