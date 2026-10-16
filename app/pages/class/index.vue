<template>
  <div class="page">
    <PageHeader
      :title="`${t('management')} ${t('classes')}`"
      :subtitle="t('manage_classes_desc')"
      icon="mdi-google-classroom"
      :breadcrumbs="breadcrumbs"
    >
      <template #actions>
        <v-btn
          variant="flat"
          class="modern-action-btn secondary"
          prepend-icon="mdi-content-copy"
          @click="openClone"
        >
          {{ t("copy_to_new_year") }}
        </v-btn>
        <v-btn
          variant="flat"
          class="modern-action-btn secondary"
          prepend-icon="mdi-download"
        >
          {{ t("export") }}
        </v-btn>
        <v-btn
          variant="flat"
          class="modern-action-btn primary"
          prepend-icon="mdi-plus"
          to="/class/add"
        >
          {{ $t("add") }}
        </v-btn>
      </template>
    </PageHeader>

    <!-- KPI cards -->
    <v-row class="mb-2 fade-in">
      <v-col v-for="(stat, i) in classStats" :key="i" cols="6" lg="3">
        <StatCard
          :icon="stat.icon"
          :label="stat.label"
          :value="stat.value"
          :color="statPalette[stat.color]?.color"
          :tint="statPalette[stat.color]?.tint"
        />
      </v-col>
    </v-row>

    <!-- List -->
    <v-card elevation="0" class="panel panel--flush fade-in">
      <div class="panel-head">
        <div>
          <div class="panel-title">{{ t("classes") }}</div>
          <div class="panel-sub">{{ t("manage_classes_desc") }}</div>
        </div>
        <span class="panel-chip panel-chip--navy">
          {{ classes.length }} {{ t("total") }}
        </span>
      </div>

      <div class="list-toolbar">
        <div class="filter-bar mb-0">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            :placeholder="t('search')"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            class="filter-search"
            color="primary"
          ></v-text-field>
          <v-select
            v-model="selectedGrade"
            :items="gradeFilterOptions"
            item-title="label"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-filter-variant"
            color="primary"
          ></v-select>
        </div>
      </div>

      <div class="table-wrap">
        <v-data-table
          :headers="headers"
          :items="classes"
          :search="search"
          :loading="classroomStore.loading"
          class="premium-table"
          hover
        >
          <template v-slot:no-data>
            <div class="pa-4">
              <EmptyState
                icon="mdi-google-classroom"
                :title="t('no_classrooms')"
              />
            </div>
          </template>

          <!-- Class Name -->
          <template v-slot:item.title="{ item }">
            <div class="d-flex align-center py-2">
              <div class="avatar-chip mr-3">
                <v-icon icon="mdi-google-classroom" size="18"></v-icon>
              </div>
              <div class="min-w-0">
                <div class="cell-title text-truncate">{{ item.title }}</div>
                <span class="code-chip mt-1">{{ item.classId }}</span>
              </div>
            </div>
          </template>

          <!-- Grade -->
          <template v-slot:item.grade="{ item }">
            <div class="cell-title">{{ item.grade }}</div>
            <div class="cell-sub">{{ item.year }}</div>
          </template>

          <!-- Teacher -->
          <template v-slot:item.teacher="{ item }">
            <div class="d-flex align-center">
              <div class="avatar-chip avatar-chip--teal mr-3">
                <v-icon size="18">mdi-account</v-icon>
              </div>
              <div class="min-w-0">
                <div class="cell-title text-truncate">{{ item.teacher }}</div>
                <div class="cell-sub text-truncate">{{ item.teacherEmail }}</div>
              </div>
            </div>
          </template>

          <!-- Status -->
          <template v-slot:item.status="{ item }">
            <span
              class="status-pill"
              :class="item.status === 'Active' ? 'status-pill--green' : 'status-pill--grey'"
            >
              <span class="status-dot"></span>
              {{ item.status === "Active" ? t("open") : t("closed") }}
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
                icon="mdi-delete-outline"
                variant="text"
                size="small"
                color="error"
                @click="removeClassroom(item)"
              ></v-btn>
            </div>
          </template>

          <template v-slot:bottom>
            <div class="table-footer px-4 px-md-6 pb-4">
              <div class="cell-sub">
                {{ t("showing") }} 1-{{ classes.length }} {{ t("of") }}
                {{ classes.length }} {{ t("results") }}
              </div>
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <!-- Edit Classroom Dialog -->
    <v-dialog v-model="editDialog" width="520">
      <v-card class="dialog-card">
        <div class="dialog-head">
          <div class="page-icon">
            <v-icon size="20">mdi-pencil-outline</v-icon>
          </div>
          <div class="min-w-0">
            <div class="panel-title">{{ t("edit") }} {{ t("classes") }}</div>
            <div class="panel-sub text-truncate">{{ editForm.classroom_name }}</div>
          </div>
        </div>

        <label class="field-label">{{ t("name") }}</label>
        <v-text-field
          v-model="editForm.classroom_name"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
        ></v-text-field>

        <v-row dense>
          <v-col cols="12" sm="6">
            <label class="field-label">{{ t("room_number") }}</label>
            <v-text-field
              v-model="editForm.room_number"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <label class="field-label">{{ t("max_students") }} (≤40)</label>
            <v-text-field
              v-model="editForm.max_student"
              type="number"
              max="40"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
            ></v-text-field>
          </v-col>
        </v-row>

        <label class="field-label">{{ t("homeroom_teacher") }}</label>
        <v-select
          v-model="editForm.homeroom_teacher_id"
          :items="teacherStore.teachers"
          item-title="full_name"
          item-value="id"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
        ></v-select>

        <label class="field-label">{{ t("status") }}</label>
        <v-select
          v-model="editForm.classroom_status"
          :items="['active', 'inactive']"
          variant="outlined"
          density="comfortable"
          hide-details
        ></v-select>

        <v-alert
          v-if="editError"
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
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

    <!-- Clone classrooms to a new academic year -->
    <v-dialog v-model="cloneDialog" width="520">
      <v-card class="dialog-card">
        <div class="dialog-head">
          <div class="page-icon page-icon--teal">
            <v-icon size="20">mdi-content-copy</v-icon>
          </div>
          <div class="min-w-0">
            <div class="panel-title">{{ t("copy_classrooms_title") }}</div>
            <div class="panel-sub">{{ t("copy_classrooms_desc") }}</div>
          </div>
        </div>

        <label class="field-label">{{ t("from_year") }}</label>
        <v-select
          v-model="cloneSource"
          :items="classroomStore.academicYears"
          item-title="title"
          item-value="id"
          :placeholder="t('select_source_year')"
          variant="outlined"
          density="comfortable"
          hide-details
          prepend-inner-icon="mdi-calendar-export"
          class="mb-4"
        ></v-select>

        <label class="field-label">{{ t("to_year") }}</label>
        <v-select
          v-model="cloneTarget"
          :items="classroomStore.academicYears"
          item-title="title"
          item-value="id"
          :placeholder="t('select_target_year')"
          variant="outlined"
          density="comfortable"
          hide-details
          prepend-inner-icon="mdi-calendar-import"
        ></v-select>

        <v-alert
          v-if="cloneMsg"
          :type="cloneOk ? 'success' : 'error'"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="mt-4"
          >{{ cloneMsg }}</v-alert
        >

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn secondary"
            @click="cloneDialog = false"
          >
            {{ t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            :loading="cloning"
            :disabled="!cloneSource || !cloneTarget || cloneSource === cloneTarget"
            @click="doClone"
          >
            {{ t("copy") }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
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
    cloneMsg.value = t("clone-success", { created, skipped });
    await classroomStore.fetchClassrooms(100);
  } catch (error: any) {
    cloneOk.value = false;
    cloneMsg.value =
      error.response?.data?.message || t("clone-failed");
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

// Presentation-only: hex accent/tint per stat colour name for <StatCard>.
const statPalette: Record<string, { color: string; tint: string }> = {
  blue: { color: "#0A3154", tint: "#E6ECF2" },
  green: { color: "#0d9488", tint: "#f0fdfa" },
  purple: { color: "#7c3aed", tint: "#f5f3ff" },
  orange: { color: "#d97706", tint: "#fffbeb" },
};

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
    teacher: c.homeroomTeacher?.full_name || t("unassigned"),
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
    editError.value = error.response?.data?.message || t("failed-update");
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
    ui.notify(t("failed-delete"), "error");
  }
};
</script>

<style scoped>
/* Toolbar row sitting between the panel head and the table */
.list-toolbar {
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--ds-border-soft);
}
@media (min-width: 960px) {
  .list-toolbar {
    padding: 16px 24px;
  }
}

/* Teal variant of the shared avatar chip (homeroom teacher) */
.avatar-chip--teal {
  color: var(--ds-teal-700);
  background: #f0fdfa;
}

/* Dialogs */
.dialog-card {
  padding: 20px;
}
.dialog-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.page-icon--teal {
  color: var(--ds-teal-700);
  background: #f0fdfa;
}
@media (min-width: 600px) {
  .dialog-card {
    padding: 24px;
  }
}
</style>
