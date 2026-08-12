<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div class="d-flex align-center">
        <v-avatar color="indigo-lighten-5" size="44" class="mr-3 rounded-0">
          <v-icon color="indigo-darken-2" size="22">mdi-clipboard-account-outline</v-icon>
        </v-avatar>
        <div>
          <div class="text-title">{{ $t("teaching_assignments") }}</div>
          <div class="text-detail">
            {{ $t("teaching-assignments-subtitle") }}
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
      {{ $t("administrators-only") }}
    </div>

    <template v-else>
      <!-- Stats -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3" v-for="(s, i) in stats" :key="i">
          <v-card class="metric-card pa-4 h-100" elevation="0">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-detail-tiny mb-1">{{ s.label }}</p>
                <h2 class="text-title">{{ s.value }}</h2>
              </div>
              <v-avatar :color="`${s.color}-lighten-5`" size="40">
                <v-icon :color="`${s.color}-darken-2`" size="18">{{ s.icon }}</v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>

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
            style="max-width: 220px"
            color="primary"
          ></v-select>
        </div>
      </v-card>

      <!-- Empty state -->
      <v-card
        v-if="!groupedByClass.length"
        elevation="0"
        class="intelligence-card pa-10 text-center text-detail"
      >
        {{ $t("no-teaching-assignments-yet") }}
        <div class="text-detail-tiny mt-1">
          {{ $t("press-add-to-assign-teacher", { add: $t("add") }) }}
        </div>
      </v-card>

      <!-- Grouped by class -->
      <v-card
        v-for="grp in groupedByClass"
        :key="grp.classroom_id"
        elevation="0"
        class="intelligence-card pa-0 mb-4 overflow-hidden"
      >
        <div class="class-head d-flex align-center px-5 py-3">
          <v-icon color="indigo-darken-2" size="18" class="mr-2">
            mdi-google-classroom
          </v-icon>
          <div class="text-title-small">{{ grp.classroom }}</div>
          <v-chip
            size="x-small"
            class="ml-3 font-weight-bold text-indigo-darken-2"
            color="indigo-lighten-5"
            variant="flat"
          >
            {{ grp.items.length }} {{ t("subject") }}
          </v-chip>
        </div>

        <div
          v-for="it in grp.items"
          :key="it.id"
          class="assign-row d-flex align-center px-5 py-3"
        >
          <v-chip
            size="small"
            color="teal-lighten-5"
            variant="flat"
            class="text-teal-darken-2 font-weight-bold mr-3 subject-chip"
          >
            {{ it.subject }}
          </v-chip>
          <v-icon size="16" color="grey-lighten-1">mdi-arrow-right</v-icon>
          <div class="d-flex align-center ml-3">
            <v-avatar color="indigo-lighten-5" size="26" class="mr-2">
              <v-icon size="14" color="indigo-darken-2">mdi-account-tie-outline</v-icon>
            </v-avatar>
            <div class="text-detail font-weight-bold">{{ it.teacher }}</div>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-delete-outline"
            variant="text"
            size="x-small"
            color="error"
            @click="removeItem(it)"
          ></v-btn>
        </div>
      </v-card>
    </template>

    <!-- Create dialog -->
    <v-dialog v-model="dialog" width="480">
      <v-card class="pa-6">
        <div class="text-title mb-4">{{ t("add") }} {{ $t("teaching_assignments") }}</div>

        <label class="text-detail-tiny mb-1 d-block">{{ t("class") }}</label>
        <v-select
          v-model="form.classroom_id"
          :items="classFilterOptions"
          item-title="label"
          item-value="id"
          variant="outlined"
          density="compact"
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
import { useUiStore } from "~/stores/ui";

const { t } = useI18n();
const classroomStore = useClassroomStore();
const subjectStore = useSubjectStore();
const teacherStore = useTeacherStore();
const teachingStore = useTeachingStore();
const ui = useUiStore();

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

const rows = computed(() =>
  teachingStore.assignments.map((a: any) => ({
    id: a.id,
    classroom_id: a.classroom_id,
    classroom: a.tb_classroom?.classroom_name || "—",
    subject_id: a.subject_id,
    subject: a.tb_subject?.subject_name || "—",
    teacher_id: a.teacher_id,
    teacher: a.tb_teacher?.full_name || a.tb_teacher?.username || "—",
  }))
);

// Summary tiles across all assignments for the year (unaffected by the filter).
const stats = computed(() => [
  {
    label: t("assignments"),
    value: rows.value.length,
    icon: "mdi-clipboard-account-outline",
    color: "indigo",
  },
  {
    label: t("classes-covered"),
    value: new Set(rows.value.map((r) => r.classroom_id)).size,
    icon: "mdi-google-classroom",
    color: "blue",
  },
  {
    label: t("subjects-assigned"),
    value: new Set(rows.value.map((r) => r.subject_id)).size,
    icon: "mdi-book-open-variant",
    color: "teal",
  },
  {
    label: t("teachers-teaching"),
    value: new Set(rows.value.map((r) => r.teacher_id)).size,
    icon: "mdi-account-tie-outline",
    color: "purple",
  },
]);

const filteredRows = computed(() =>
  filterClassId.value
    ? rows.value.filter((r) => r.classroom_id === filterClassId.value)
    : rows.value
);

// Grouped into one card per class, each listing its subject → teacher rows.
const groupedByClass = computed(() => {
  const map = new Map<string, any>();
  for (const r of filteredRows.value) {
    if (!map.has(r.classroom_id)) {
      map.set(r.classroom_id, {
        classroom_id: r.classroom_id,
        classroom: r.classroom,
        items: [] as any[],
      });
    }
    map.get(r.classroom_id).items.push(r);
  }
  return [...map.values()];
});

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

// The subject a teacher teaches (by name), used to auto-fill the create dialog.
// Uses the teacher's subject group (ໝວດວິຊາ / department); falls back to
// inferring the subject from an existing assignment this year.
const teacherSubjectName = (teacherId: string): string | null => {
  const tc = teacherStore.teachers.find((x: any) => x.id === teacherId);
  if (tc?.department) return tc.department;
  const a = teachingStore.assignments.find(
    (x: any) => x.teacher_id === teacherId && x.tb_subject
  );
  return a?.tb_subject?.subject_name || null;
};

// Once a class + teacher are chosen, auto-select the subject the teacher
// teaches — matched by name against the class's grade subjects. The user can
// still change it manually afterwards.
watch(
  () => [form.value.classroom_id, form.value.teacher_id],
  () => {
    if (!form.value.teacher_id) return;
    const name = teacherSubjectName(form.value.teacher_id);
    if (!name) return;
    const opt = dialogSubjectOptions.value.find((o) => o.label === name);
    if (opt) form.value.subject_id = opt.id;
  }
);

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
    formError.value = t("all-fields-required");
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
    formError.value = error.response?.data?.message || t("failed-to-save");
  } finally {
    saving.value = false;
  }
};

const removeItem = async (item: any) => {
  const ok = await ui.confirm({
    message: t("are_you_sure_delete"),
    confirmText: t("delete"),
    icon: "mdi-delete-outline",
  });
  if (!ok) return;
  try {
    await teachingStore.deleteAssignment(item.id);
    await teachingStore.fetchAssignments({ academic_year_id: selectedYearId.value });
    ui.notify(t("deleted_successfully"), "success");
  } catch (error) {
    ui.notify(t("failed-to-delete"), "error");
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}
.intelligence-card {
  background: white;
  border: 1px solid #f1f5f9;
}
.modern-action-btn {
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 12px !important;
  padding: 0 12px !important;
}
.modern-action-btn.primary {
  background: linear-gradient(135deg, #0A3154 0%, #082741 100%) !important;
  color: white !important;
}
.metric-card {
  background: white;
  border: 1px solid #f1f5f9;
}
/* Class group header band — indigo tint gives this page its own identity */
.class-head {
  background: #eef2ff;
  border-bottom: 1px solid #e0e7ff;
}
.assign-row {
  border-bottom: 1px solid #f1f5f9;
}
.assign-row:last-child {
  border-bottom: 0;
}
.assign-row:hover {
  background: #f8fafc;
}
.subject-chip {
  min-width: 130px;
  justify-content: center;
}
</style>
