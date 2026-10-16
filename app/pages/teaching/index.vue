<template>
  <div class="page">
    <PageHeader
      :title="$t('teaching_assignments')"
      :subtitle="$t('teaching-assignments-subtitle')"
      icon="mdi-clipboard-account-outline"
      :breadcrumbs="breadcrumbs"
    >
      <template v-if="isAdmin" #actions>
        <v-btn variant="flat" class="modern-action-btn primary" @click="openCreate">
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ $t("add") }}
        </v-btn>
      </template>
    </PageHeader>

    <!-- Non-admins only ever see this notice -->
    <v-card v-if="!isAdmin" elevation="0" class="panel fade-in">
      <EmptyState icon="mdi-shield-lock-outline" :title="$t('administrators-only')" />
    </v-card>

    <template v-else>
      <!-- Stats -->
      <v-row class="mb-2 fade-in">
        <v-col v-for="(s, i) in stats" :key="i" cols="6" lg="3">
          <StatCard
            :icon="s.icon"
            :label="s.label"
            :value="s.value"
            :color="statPalette[s.color]?.color"
            :tint="statPalette[s.color]?.tint"
          />
        </v-col>
      </v-row>

      <!-- Filters -->
      <v-card elevation="0" class="panel mb-4 fade-in">
        <div class="filter-bar mb-0">
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
            color="primary"
            prepend-inner-icon="mdi-google-classroom"
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
            color="primary"
            prepend-inner-icon="mdi-calendar-check"
          ></v-select>
          <span class="filter-spacer d-none d-md-block"></span>
          <span class="panel-chip panel-chip--indigo">
            {{ filteredRows.length }} {{ t("assignments") }}
          </span>
        </div>
      </v-card>

      <!-- Empty state -->
      <v-card v-if="!groupedByClass.length" elevation="0" class="panel fade-in">
        <EmptyState
          icon="mdi-clipboard-text-off-outline"
          :title="$t('no-teaching-assignments-yet')"
          :description="$t('press-add-to-assign-teacher', { add: $t('add') })"
        />
      </v-card>

      <!-- Grouped by class -->
      <v-card
        v-for="grp in groupedByClass"
        :key="grp.classroom_id"
        elevation="0"
        class="panel panel--flush mb-4 fade-in"
      >
        <div class="panel-head class-head">
          <div class="d-flex align-center ga-3 min-w-0">
            <div class="class-icon">
              <v-icon size="18">mdi-google-classroom</v-icon>
            </div>
            <div class="panel-title text-truncate">{{ grp.classroom }}</div>
          </div>
          <span class="panel-chip panel-chip--indigo">
            {{ grp.items.length }} {{ t("subject") }}
          </span>
        </div>

        <div v-for="it in grp.items" :key="it.id" class="assign-row">
          <span class="assign-subject">
            <v-icon size="14" class="mr-1">mdi-book-open-variant</v-icon>
            <span class="text-truncate">{{ it.subject }}</span>
          </span>
          <v-icon size="16" class="assign-arrow d-none d-sm-flex">mdi-arrow-right</v-icon>
          <div class="assign-teacher">
            <div class="avatar-chip avatar-chip--sm">
              {{ (it.teacher || "?").charAt(0) }}
            </div>
            <span class="cell-title text-truncate">{{ it.teacher }}</span>
          </div>
          <div class="row-actions">
            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              size="small"
              color="error"
              @click="removeItem(it)"
            ></v-btn>
          </div>
        </div>
      </v-card>
    </template>

    <!-- Create dialog -->
    <v-dialog v-model="dialog" width="480">
      <v-card class="pa-5 pa-sm-6">
        <div class="d-flex align-center ga-3 mb-5">
          <div class="page-icon">
            <v-icon size="20">mdi-clipboard-account-outline</v-icon>
          </div>
          <div class="min-w-0">
            <div class="panel-title">{{ t("add") }} {{ $t("teaching_assignments") }}</div>
            <div class="panel-sub">{{ $t("teaching-assignments-subtitle") }}</div>
          </div>
        </div>

        <label class="field-label">{{ t("class") }}</label>
        <v-select
          v-model="form.classroom_id"
          :items="classFilterOptions"
          item-title="label"
          item-value="id"
          variant="outlined"
          density="comfortable"
          hide-details
          color="primary"
          prepend-inner-icon="mdi-google-classroom"
          class="mb-4"
        ></v-select>

        <label class="field-label">{{ t("teacher") }}</label>
        <v-select
          v-model="form.teacher_id"
          :items="teacherOptions"
          item-title="label"
          item-value="id"
          variant="outlined"
          density="comfortable"
          hide-details
          color="primary"
          prepend-inner-icon="mdi-account-tie-outline"
          class="mb-4"
        ></v-select>

        <label class="field-label">{{ t("subject") }}</label>
        <v-select
          v-model="form.subject_id"
          :items="dialogSubjectOptions"
          item-title="label"
          item-value="id"
          variant="outlined"
          density="comfortable"
          hide-details
          color="primary"
          prepend-inner-icon="mdi-book-open-variant"
        ></v-select>

        <v-alert
          v-if="formError"
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="mt-4"
          >{{ formError }}</v-alert
        >

        <div class="form-actions">
          <v-btn variant="flat" class="modern-action-btn secondary" @click="dialog = false">
            {{ t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            :loading="saving"
            @click="save"
          >
            {{ t("save") }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
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

// Presentation only: StatCard takes hex colours, stats[] keeps its colour names.
const statPalette: Record<string, { color: string; tint: string }> = {
  indigo: { color: "#4f46e5", tint: "#eef2ff" },
  blue: { color: "#2563eb", tint: "#eff6ff" },
  teal: { color: "#0d9488", tint: "#f0fdfa" },
  purple: { color: "#7c3aed", tint: "#f5f3ff" },
};

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
/* Class group header band — indigo tint gives this page its own identity */
.class-head {
  background: #f7f8ff;
}
.class-icon {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4338ca;
  background: #eef2ff;
}

.avatar-chip--sm {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  font-size: 12px;
}

/* One subject → teacher line */
.assign-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--ds-border-soft);
}
.assign-row:last-child {
  border-bottom: 0;
}
.assign-row:hover {
  background: #f8fafc;
}
.assign-subject {
  flex: 0 1 auto;
  min-width: 0;
  max-width: 45%;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 800;
  padding: 5px 10px;
  border-radius: 999px;
  color: #0f766e;
  background: #f0fdfa;
  white-space: nowrap;
}
.assign-subject .text-truncate {
  min-width: 0;
}
.assign-arrow {
  color: var(--ds-faint);
}
.assign-teacher {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
@media (min-width: 600px) {
  .assign-row {
    padding: 10px 24px;
  }
  .assign-subject {
    flex: 0 0 auto;
    min-width: 140px;
    max-width: 260px;
  }
}
</style>
