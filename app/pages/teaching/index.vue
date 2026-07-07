<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div class="d-flex align-center">
        <v-avatar color="indigo-lighten-5" size="44" class="mr-3 rounded-lg">
          <v-icon color="indigo-darken-2" size="22">mdi-clipboard-account-outline</v-icon>
        </v-avatar>
        <div>
          <div class="text-title">{{ $t("teaching_assignments") }}</div>
          <div class="text-detail">
            ອາຈານຄົນໃດສອນວິຊາໃດ ໃນຫ້ອງໃດ · Who teaches what, in each class.
          </div>
        </div>
      </div>
      <v-btn
        v-if="isAdmin"
        color="primary"
        class="modern-action-btn primary elevation-4"
        height="36"
        @click="openCreate"
      >
        <v-icon icon="mdi-plus" start size="18"></v-icon>
        {{ $t("add") }}
      </v-btn>
    </div>

    <div v-if="!isAdmin" class="text-detail text-center py-10">
      ສະເພາະຜູ້ດູແລລະບົບ · Administrators only.
    </div>

    <template v-else>
      <!-- Filters -->
      <v-card elevation="0" class="intelligence-card pa-4 mb-6">
        <div class="d-flex flex-column flex-md-row gap-3">
          <v-select
            v-model="filterClassId"
            :items="classFilterOptions"
            item-title="label"
            item-value="id"
            :label="t('class')"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            clearable
            style="max-width: 260px"
            color="primary"
          ></v-select>
          <v-select
            v-model="selectedYearId"
            :items="classroomStore.academicYears"
            item-title="title"
            item-value="id"
            :label="t('academic')"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="max-width: 220px"
            color="primary"
          ></v-select>
        </div>
      </v-card>

      <v-card elevation="0" class="intelligence-card pa-4">
        <v-data-table
          :headers="headers"
          :items="filteredRows"
          :loading="teachingStore.loading"
          class="premium-table"
          hover
        >
          <template v-slot:no-data>
            <div class="text-detail py-8 text-center">No assignments yet.</div>
          </template>

          <template v-slot:item.classroom="{ item }">
            <div class="text-title-small">{{ item.classroom }}</div>
          </template>
          <template v-slot:item.subject="{ item }">
            <v-chip size="x-small" color="teal-lighten-5" class="text-teal-darken-2 font-weight-bold" variant="flat">
              {{ item.subject }}
            </v-chip>
          </template>
          <template v-slot:item.teacher="{ item }">
            <div class="d-flex align-center py-2">
              <v-avatar color="indigo-lighten-5" size="28" class="mr-2">
                <v-icon size="15" color="indigo-darken-2">mdi-account-tie-outline</v-icon>
              </v-avatar>
              <div class="text-title-small">{{ item.teacher }}</div>
            </div>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              size="x-small"
              color="error"
              @click="removeItem(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card>
    </template>

    <!-- Create dialog -->
    <v-dialog v-model="dialog" width="480">
      <v-card rounded="xl" class="pa-6">
        <div class="text-title mb-4">{{ t("add") }} {{ $t("teaching_assignments") }}</div>

        <label class="text-detail-tiny mb-1 d-block">{{ t("class") }}</label>
        <v-select
          v-model="form.classroom_id"
          :items="classFilterOptions"
          item-title="label"
          item-value="id"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          class="mb-3"
        ></v-select>

        <label class="text-detail-tiny mb-1 d-block">{{ t("subject") }}</label>
        <v-select
          v-model="form.subject_id"
          :items="dialogSubjectOptions"
          item-title="label"
          item-value="id"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          class="mb-3"
        ></v-select>

        <label class="text-detail-tiny mb-1 d-block">{{ t("teacher") }}</label>
        <v-select
          v-model="form.teacher_id"
          :items="teacherOptions"
          item-title="label"
          item-value="id"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
        ></v-select>

        <v-alert
          v-if="formError"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-4"
          >{{ formError }}</v-alert
        >

        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" @click="dialog = false">{{ t("cancel") }}</v-btn>
          <v-btn
            color="primary"
            class="modern-action-btn primary"
            :loading="saving"
            @click="save"
            >{{ t("save") }}</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useClassroomStore } from "~/stores/apiClassroom";
import { useSubjectStore } from "~/stores/apiSubject";
import { useTeacherStore } from "~/stores/apiTeacher";
import { useTeachingStore } from "~/stores/apiTeaching";

const { t } = useI18n();
const classroomStore = useClassroomStore();
const subjectStore = useSubjectStore();
const teacherStore = useTeacherStore();
const teachingStore = useTeachingStore();

const roleCookie = useCookie<string>("role");
const isAdmin = computed(() => (roleCookie.value || "").toLowerCase() === "admin");

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("teaching_assignments"), disabled: true, to: "/teaching" },
];

const selectedYearId = ref("");
const filterClassId = ref<string | null>(null);

onMounted(async () => {
  if (!isAdmin.value) return;
  await Promise.all([
    classroomStore.fetchClassrooms(200),
    classroomStore.fetchAcademicYears(),
    subjectStore.fetchSubjects(),
    teacherStore.fetchTeachers(200, 1),
  ]);
  selectedYearId.value = classroomStore.latestAcademicYearId || "";
});

watch(selectedYearId, (y) => {
  if (y) teachingStore.fetchAssignments({ academic_year_id: y });
});

const classFilterOptions = computed(() =>
  classroomStore.classrooms.map((c: any) => ({
    id: c.id,
    label: c.classroom_name,
    grade_level_id: c.grade_level_id,
  }))
);

const teacherOptions = computed(() =>
  teacherStore.teachers.map((tc: any) => ({
    id: tc.id,
    label: tc.full_name || tc.username,
  }))
);

const headers = [
  { title: t("class"), key: "classroom", align: "start" as const, sortable: true },
  { title: t("subject"), key: "subject", align: "start" as const, sortable: true },
  { title: t("teacher"), key: "teacher", align: "start" as const, sortable: true },
  { title: "", key: "actions", align: "end" as const, sortable: false },
].map((h) => ({ ...h, class: "text-detail-tiny pb-2" }));

const rows = computed(() =>
  teachingStore.assignments.map((a: any) => ({
    id: a.id,
    classroom_id: a.classroom_id,
    classroom: a.tb_classroom?.classroom_name || "—",
    subject: a.tb_subject?.subject_name || "—",
    teacher: a.tb_teacher?.full_name || a.tb_teacher?.username || "—",
  }))
);

const filteredRows = computed(() =>
  filterClassId.value
    ? rows.value.filter((r) => r.classroom_id === filterClassId.value)
    : rows.value
);

// ---- Create ----
const dialog = ref(false);
const saving = ref(false);
const formError = ref("");
const form = ref({ classroom_id: "", subject_id: "", teacher_id: "" });

// Subjects for the class chosen in the dialog (grade match, fallback to all).
const dialogSubjectOptions = computed(() => {
  const cls = classFilterOptions.value.find((c) => c.id === form.value.classroom_id);
  const gradeId = cls?.grade_level_id;
  const matched = gradeId
    ? subjectStore.subjects.filter((s: any) => s.grade_id === gradeId)
    : [];
  const list = matched.length ? matched : subjectStore.subjects;
  return list.map((s: any) => ({ id: s.id, label: s.subject_name }));
});

const openCreate = () => {
  formError.value = "";
  form.value = {
    classroom_id: filterClassId.value || "",
    subject_id: "",
    teacher_id: "",
  };
  dialog.value = true;
};

const save = async () => {
  if (!form.value.classroom_id || !form.value.subject_id || !form.value.teacher_id) {
    formError.value = "All fields are required.";
    return;
  }
  saving.value = true;
  try {
    await teachingStore.createAssignment({
      classroom_id: form.value.classroom_id,
      subject_id: form.value.subject_id,
      teacher_id: form.value.teacher_id,
      academic_year_id: selectedYearId.value,
    });
    dialog.value = false;
    await teachingStore.fetchAssignments({ academic_year_id: selectedYearId.value });
  } catch (error: any) {
    formError.value = error.response?.data?.message || "Failed to save.";
  } finally {
    saving.value = false;
  }
};

const removeItem = async (item: any) => {
  if (!confirm(t("are_you_sure_delete"))) return;
  try {
    await teachingStore.deleteAssignment(item.id);
    await teachingStore.fetchAssignments({ academic_year_id: selectedYearId.value });
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
.intelligence-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
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
</style>
