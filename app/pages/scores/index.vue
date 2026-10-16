<template>
  <div class="page">
    <PageHeader
      :title="mode === 'enter' ? `${$t('management')} ${$t('scores')}` : $t('score_report')"
      :subtitle="mode === 'enter' ? $t('enter-student-scores') : $t('full-class-results')"
      icon="mdi-clipboard-check-outline"
      :breadcrumbs="breadcrumbs"
    >
      <template #actions>
        <!-- Mode toggle — hidden for the read-only student role. -->
        <v-btn-toggle
          v-if="!isStudent"
          v-model="mode"
          mandatory
          density="compact"
          variant="text"
          color="primary"
          class="mode-toggle"
        >
          <v-btn value="enter" size="small" class="text-none font-weight-bold">
            <v-icon icon="mdi-pencil-outline" start size="16"></v-icon>
            {{ $t("score_entry") }}
          </v-btn>
          <v-btn value="view" size="small" class="text-none font-weight-bold">
            <v-icon icon="mdi-table-large" start size="16"></v-icon>
            {{ $t("score_report") }}
          </v-btn>
        </v-btn-toggle>

        <v-btn
          v-if="mode === 'enter'"
          variant="flat"
          class="modern-action-btn primary"
          :loading="scoreStore.saving"
          :disabled="!canSave"
          @click="saveAll"
        >
          <v-icon icon="mdi-content-save-outline" start size="18"></v-icon>
          {{ $t("save") }}
        </v-btn>
      </template>
    </PageHeader>

    <!-- Filters -->
    <v-card elevation="0" class="panel mb-4 fade-in">
      <v-row dense>
        <v-col cols="12" sm="6" md="3">
          <label class="field-label">{{ t("class") }}</label>
          <v-select
            v-model="selectedClassId"
            :items="classOptions"
            item-title="label"
            item-value="id"
            variant="outlined"
            density="compact"
            hide-details
            color="primary"
            prepend-inner-icon="mdi-google-classroom"
            :disabled="isStudent"
          ></v-select>
        </v-col>
        <v-col v-if="mode === 'enter'" cols="12" sm="6" md="3">
          <label class="field-label">{{ t("subject") }}</label>
          <v-select
            v-model="selectedSubjectId"
            :items="subjectOptions"
            item-title="label"
            item-value="id"
            variant="outlined"
            density="compact"
            hide-details
            color="primary"
            prepend-inner-icon="mdi-book-open-variant"
          ></v-select>
        </v-col>
        <v-col cols="6" sm="3" md="2">
          <label class="field-label">{{ t("semester") }}</label>
          <v-select
            v-model="selectedSemester"
            :items="semesterOptions"
            variant="outlined"
            density="compact"
            hide-details
            color="primary"
          ></v-select>
        </v-col>
        <v-col cols="6" sm="3" md="2">
          <label class="field-label">{{ t("month") }}</label>
          <v-select
            v-model="selectedMonth"
            :items="monthOptions"
            variant="outlined"
            density="compact"
            hide-details
            color="primary"
          ></v-select>
        </v-col>
        <v-col v-if="mode === 'enter' && isAdmin" cols="12" sm="6" md="2">
          <label class="field-label">{{ t("teacher") }}</label>
          <v-select
            v-model="selectedTeacherId"
            :items="teacherOptions"
            item-title="label"
            item-value="id"
            variant="outlined"
            density="compact"
            hide-details
            color="primary"
            prepend-inner-icon="mdi-account-tie-outline"
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <!-- ENTER MODE: editable score grid (one subject) -->
    <v-card v-if="mode === 'enter'" elevation="0" class="panel panel--flush fade-in">
      <div class="panel-head">
        <div class="min-w-0">
          <div class="panel-title">{{ $t("score_entry") }}</div>
          <div class="panel-sub">
            {{ selectedClass?.classroom_name || $t("select-a-class") }}
            · {{ t("semester") }} {{ selectedSemester }} · {{ selectedMonth }}
          </div>
        </div>
        <span v-if="rows.length" class="panel-chip panel-chip--teal">
          {{ rows.length }} {{ t("students") }}
        </span>
      </div>

      <div v-if="!ready" class="pa-4 pa-md-5">
        <EmptyState icon="mdi-filter-variant" :title="$t('select-class-subject-teacher')" />
      </div>

      <div v-else-if="enrollmentStore.loading" class="panel-loading">
        <v-progress-circular indeterminate color="primary" size="28" width="3"></v-progress-circular>
        <span>{{ t("loading") }}</span>
      </div>

      <div v-else-if="!rows.length" class="pa-4 pa-md-5">
        <EmptyState icon="mdi-account-off-outline" :title="$t('no-students-enrolled')" />
      </div>

      <div v-else class="table-wrap">
        <table class="score-table">
          <thead>
            <tr>
              <th class="col-no">{{ t("column-no") }}</th>
              <th class="col-name text-left">{{ t("students") }}</th>
              <th class="col-score">{{ t("scores") }} (0–10)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in rows" :key="row.student_id">
              <td class="col-no text-center">
                <span class="cell-sub">{{ index + 1 }}</span>
              </td>
              <td class="col-name">
                <div class="d-flex align-center ga-3">
                  <div class="avatar-chip avatar-chip--sm">
                    {{ (row.name || "?").charAt(0) }}
                  </div>
                  <span class="cell-title">{{ row.name }}</span>
                </div>
              </td>
              <td class="col-score text-center">
                <!-- Enter / ArrowDown move to the next student and ArrowUp back,
                     so a whole class can be entered from the keyboard without
                     reaching for the mouse between every row. -->
                <v-text-field
                  v-model="row.score"
                  type="number"
                  min="0"
                  max="10"
                  variant="outlined"
                  density="compact"
                  hide-details
                  color="primary"
                  class="score-input"
                  :class="{ 'score-input--filled': Number(row.score) > 0 }"
                  :data-score-index="index"
                  @focus="$event.target.select()"
                  @blur="clampScore(row)"
                  @keydown.enter.prevent="focusScore(index + 1)"
                  @keydown.down.prevent="focusScore(index + 1)"
                  @keydown.up.prevent="focusScore(index - 1)"
                ></v-text-field>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-card>

    <!-- VIEW MODE: read-only results sheet with totals and rank -->
    <v-card v-else elevation="0" class="panel panel--flush fade-in">
      <div class="panel-head">
        <div class="min-w-0">
          <div class="panel-title">{{ $t("score_report") }}</div>
          <div class="panel-sub">
            {{ selectedClass?.classroom_name || $t("select-a-class") }}
            · {{ t("semester") }} {{ selectedSemester }} · {{ selectedMonth }}
          </div>
        </div>
        <span v-if="students.length" class="panel-chip panel-chip--indigo">
          {{ students.length }} {{ t("students") }}
        </span>
      </div>

      <div v-if="!selectedClassId" class="pa-4 pa-md-5">
        <EmptyState icon="mdi-google-classroom" :title="$t('select-a-class')" />
      </div>
      <div v-else-if="scoreStore.loading" class="panel-loading">
        <v-progress-circular indeterminate color="primary" size="28" width="3"></v-progress-circular>
        <span>{{ t("loading") }}</span>
      </div>
      <div v-else-if="scoreStore.error" class="pa-4 pa-md-5">
        <EmptyState icon="mdi-alert-circle-outline" :title="scoreStore.error" />
      </div>
      <div v-else-if="!students.length" class="pa-4 pa-md-5">
        <EmptyState icon="mdi-account-off-outline" :title="$t('no-students')" />
      </div>

      <div v-else class="table-wrap">
        <table class="score-table score-table--report">
          <thead>
            <tr>
              <th class="col-no">{{ t("column-no") }}</th>
              <th class="col-name text-left">{{ t("students") }}</th>
              <th
                v-for="subj in subjects"
                :key="subj.id"
                class="col-subj"
                :title="subj.subject_name"
              >
                {{ subj.subject_code || subj.subject_name }}
              </th>
              <th class="col-total">{{ t("total") }}</th>
              <th class="col-rank">{{ t("rank") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in students"
              :key="row.student_id"
              :class="{ 'is-top': index < 3 }"
            >
              <td class="col-no text-center">
                <span class="cell-sub">{{ index + 1 }}</span>
              </td>
              <td class="col-name">
                <div class="d-flex align-center ga-3">
                  <div class="avatar-chip avatar-chip--sm">
                    {{ (row.name || "?").charAt(0) }}
                  </div>
                  <span class="cell-title">{{ row.name }}</span>
                </div>
              </td>
              <td
                v-for="subj in subjects"
                :key="subj.id"
                class="text-center score-value"
                :class="{ 'score-value--empty': row.scores[subj.id] == null }"
              >
                {{ row.scores[subj.id] ?? "–" }}
              </td>
              <td class="text-center total-cell">{{ row.total }}</td>
              <td class="text-center">
                <v-chip
                  size="small"
                  :color="rankColor(index)"
                  variant="flat"
                  class="font-weight-black rank-chip"
                >
                  {{ index + 1 }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useClassroomStore } from "~/stores/apiClassroom";
import { useSubjectStore } from "~/stores/apiSubject";
import { useTeacherStore } from "~/stores/apiTeacher";
import { useEnrollmentStore } from "~/stores/apiEnrollment";
import { useScoreStore } from "~/stores/apiScore";
import { useTeachingStore } from "~/stores/apiTeaching";
import { useUiStore } from "~/stores/ui";

const { t } = useI18n();
const classroomStore = useClassroomStore();
const subjectStore = useSubjectStore();
const teacherStore = useTeacherStore();
const enrollmentStore = useEnrollmentStore();
const scoreStore = useScoreStore();
const teachingStore = useTeachingStore();
const ui = useUiStore();

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("scores"), disabled: true, to: "/scores" },
];

// Roles: admins pick any teacher; teachers are locked to self; students get a
// read-only report only (enforced again on the server).
const roleCookie = useCookie<string>("role");
const idCookie = useCookie<string>("id");
const isAdmin = computed(() =>
  ["admin", "administrator"].includes((roleCookie.value || "").toLowerCase())
);
const isStudent = computed(
  () => (roleCookie.value || "").toLowerCase() === "student"
);

// The single page has two modes: "enter" (grade entry) and "view" (report).
// Students are locked to "view" (see onMounted); everyone else can toggle.
const mode = ref<"enter" | "view">("enter");

// Shared filters.
const selectedClassId = ref("");
const selectedSemester = ref("1");
// Default to the current calendar month (e.g. ເດືອນ 7 in July).
const selectedMonth = ref(`ເດືອນ ${new Date().getMonth() + 1}`);
// Enter-mode-only filters.
const selectedSubjectId = ref("");
const selectedTeacherId = ref("");

const semesterOptions = ["1", "2"];
const monthOptions = Array.from({ length: 12 }, (_, i) => `ເດືອນ ${i + 1}`);

onMounted(async () => {
  // Students only ever see the read-only report.
  if (isStudent.value) mode.value = "view";

  await Promise.all([
    classroomStore.fetchAcademicYears(),
    // myClassrooms drives report mode (all roles) and enter mode for admins.
    classroomStore.fetchMyClassrooms(),
    // Enter-mode data — not needed for the student report.
    ...(isStudent.value ? [] : [subjectStore.fetchSubjects()]),
    ...(!isAdmin.value && !isStudent.value
      ? [teachingStore.fetchMyTeaching()]
      : []),
    ...(isAdmin.value ? [teacherStore.fetchTeachers(200, 1)] : []),
  ]);

  // Teachers always enter scores under their own account.
  if (!isAdmin.value && idCookie.value) selectedTeacherId.value = idCookie.value;

  // Teachers/students have a small, fixed class list — default to the first so
  // the page shows data immediately. Admins keep choosing from all classes.
  if (!isAdmin.value) {
    selectedClassId.value = classOptions.value[0]?.id || "";
  }
});

const yearId = computed(() => classroomStore.latestAcademicYearId || "");

// A teacher's assignments for the current year.
const myTeachingForYear = computed(() =>
  teachingStore.myTeaching.filter(
    (a: any) => a.academic_year_id === yearId.value
  )
);

const classOptions = computed(() => {
  // Enter mode for a teacher: the distinct classes they teach in.
  if (mode.value === "enter" && !isAdmin.value) {
    const seen = new Map<string, any>();
    myTeachingForYear.value.forEach((a: any) => {
      if (a.tb_classroom && !seen.has(a.classroom_id)) {
        seen.set(a.classroom_id, {
          id: a.classroom_id,
          label: a.tb_classroom.classroom_name,
        });
      }
    });
    return [...seen.values()];
  }
  // Admin (either mode) and report mode for everyone: homeroom/all classrooms.
  return classroomStore.myClassrooms.map((c: any) => ({
    id: c.id,
    label: c.classroom_name,
  }));
});

const selectedClass = computed(() => {
  if (mode.value === "enter" && !isAdmin.value) {
    return myTeachingForYear.value.find(
      (a: any) => a.classroom_id === selectedClassId.value
    )?.tb_classroom;
  }
  return classroomStore.myClassrooms.find(
    (c: any) => c.id === selectedClassId.value
  );
});

const subjectOptions = computed(() => {
  // Teacher: only the subjects they teach in the chosen class.
  if (!isAdmin.value) {
    const seen = new Map<string, any>();
    myTeachingForYear.value
      .filter(
        (a: any) => a.classroom_id === selectedClassId.value && a.tb_subject
      )
      .forEach((a: any) =>
        seen.set(a.subject_id, {
          id: a.subject_id,
          label: a.tb_subject.subject_name,
        })
      );
    return [...seen.values()];
  }
  // Admin: subjects for the class's grade, falling back to all when none map.
  const gradeId = selectedClass.value?.grade_level_id;
  const matched = gradeId
    ? subjectStore.subjects.filter((s: any) => s.grade_id === gradeId)
    : [];
  const list = matched.length ? matched : subjectStore.subjects;
  return list.map((s: any) => ({ id: s.id, label: s.subject_name }));
});

const teacherOptions = computed(() =>
  teacherStore.teachers.map((tc: any) => ({
    id: tc.id,
    label: tc.full_name || tc.username,
  }))
);

// Default the teacher to the class's homeroom teacher when a class is chosen.
watch(selectedClassId, () => {
  const hr = selectedClass.value?.homeroom_teacher_id;
  if (hr && isAdmin.value) selectedTeacherId.value = hr;
  // Reset subject if it no longer belongs to the new class's grade.
  if (
    selectedSubjectId.value &&
    !subjectOptions.value.some((s) => s.id === selectedSubjectId.value)
  ) {
    selectedSubjectId.value = "";
  }
});

// The class list can change between modes — keep the selection valid.
watch(mode, () => {
  if (!classOptions.value.some((c) => c.id === selectedClassId.value)) {
    selectedClassId.value = isAdmin.value
      ? ""
      : classOptions.value[0]?.id || "";
  }
});

/* ---------- ENTER MODE ---------- */

const ready = computed(
  () =>
    mode.value === "enter" &&
    !!selectedClassId.value &&
    !!selectedSubjectId.value &&
    !!selectedTeacherId.value &&
    !!yearId.value
);

const rows = ref<any[]>([]);

// Clamp a score into 0–100 when the user leaves the field. An empty/invalid
// field falls back to 0 (the default).
const clampScore = (row: any) => {
  const n = Number(row.score);
  if (row.score === "" || row.score === null || Number.isNaN(n)) {
    row.score = 0;
    return;
  }
  row.score = Math.min(10, Math.max(0, n));
};

// (Re)build the grid: students of the class, prefilled with any saved score
// for the chosen subject / semester / month.
const buildRows = async () => {
  if (!ready.value) {
    rows.value = [];
    return;
  }
  await Promise.all([
    enrollmentStore.fetchEnrollments({
      class_id: selectedClassId.value,
      academic_year_id: yearId.value,
      status: "active",
    }),
    scoreStore.fetchScores({
      academic_year_id: yearId.value,
      subject_id: selectedSubjectId.value,
      semester: selectedSemester.value,
      month: selectedMonth.value,
    }),
  ]);

  const scoreByStudent: Record<string, any> = {};
  scoreStore.scores.forEach((s: any) => (scoreByStudent[s.student_id] = s));

  const mapped = enrollmentStore.enrollments
    .filter((e: any) => e.tb_student)
    .map((e: any) => {
      const s = e.tb_student;
      const existing = scoreByStudent[s.id];
      return {
        enrollment_id: e.id,
        student_id: s.id,
        name: `${s.first_name} ${s.last_name}`,
        // All fields default to 0; already-scored students keep their score.
        score: existing ? Number(existing.score) : 0,
      };
    });

  // Keep ungraded students (score 0) at the top for quick entry; students who
  // already have a score sink to the bottom. Sort runs only here (on load), so
  // rows never jump while the teacher is typing. Array.sort is stable, so the
  // original enrollment order is preserved within each group.
  mapped.sort(
    (a, b) => (Number(a.score) > 0 ? 1 : 0) - (Number(b.score) > 0 ? 1 : 0)
  );

  rows.value = mapped;
  // Baseline for the unsaved-changes guard: whatever was on screen right after
  // loading counts as "saved".
  savedSnapshot.value = snapshotOf(mapped);
};

// Move focus between score inputs by row index; ignores out-of-range so Enter
// on the last student simply stays put instead of throwing.
const focusScore = (index: number) => {
  if (index < 0 || index >= rows.value.length) return;
  const el = document.querySelector<HTMLInputElement>(
    `.score-input[data-score-index="${index}"] input`
  );
  el?.focus();
  el?.select();
};

/* ---------- unsaved-changes guard ---------- */

// Compare only what the teacher can actually change, so re-fetches and added
// fields never make a clean sheet look dirty.
const snapshotOf = (list: any[]) =>
  JSON.stringify(list.map((r) => [r.student_id, Number(r.score) || 0]));

const savedSnapshot = ref("");
const isDirty = computed(() => snapshotOf(rows.value) !== savedSnapshot.value);
const { markClean } = useUnsavedChanges(isDirty);

watch(
  [ready, selectedClassId, selectedSubjectId, selectedSemester, selectedMonth],
  buildRows
);

const canSave = computed(() => ready.value && rows.value.length > 0);

const saveAll = async () => {
  try {
    const payload = rows.value.map((r) => ({
      enrollment_id: r.enrollment_id,
      student_id: r.student_id,
      academic_year_id: yearId.value,
      teacher_id: selectedTeacherId.value,
      subject_id: selectedSubjectId.value,
      semester: selectedSemester.value,
      month: selectedMonth.value,
      score: Math.min(10, Math.max(0, Number(r.score) || 0)),
    }));
    const res = await scoreStore.bulkUpsertScores(payload);
    // The sheet on screen is now what's stored, so stop warning about it.
    savedSnapshot.value = snapshotOf(rows.value);
    markClean();
    ui.notify(res?.message || t("scores-saved-successfully"), "success");
  } catch (error: any) {
    ui.notify(
      error.response?.data?.message || t("failed-to-save-scores"),
      "error"
    );
  }
};

/* ---------- VIEW MODE ---------- */

const subjects = ref<any[]>([]);
const students = ref<any[]>([]);

const loadReport = async () => {
  if (mode.value !== "view" || !selectedClassId.value || !yearId.value) {
    subjects.value = [];
    students.value = [];
    return;
  }
  try {
    const sheet = await scoreStore.fetchClassSheet({
      classroom_id: selectedClassId.value,
      academic_year_id: yearId.value,
      semester: selectedSemester.value,
      month: selectedMonth.value,
    });
    subjects.value = sheet.subjects;
    students.value = sheet.students; // already sorted by total desc (rank order)
  } catch {
    subjects.value = [];
    students.value = [];
  }
};

watch([mode, selectedClassId, selectedSemester, selectedMonth, yearId], loadReport);

const rankColor = (index: number) => {
  if (index === 0) return "amber-darken-2";
  if (index === 1) return "grey-darken-1";
  if (index === 2) return "brown-darken-1";
  return "blue-grey-lighten-2";
};
</script>

<style scoped>
/* Segmented enter / report switch in the page header */
.mode-toggle {
  height: 40px !important;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-sm) !important;
  background: #fff;
  overflow: hidden;
}
.mode-toggle :deep(.v-btn) {
  height: 38px !important;
  font-size: 12px;
  border-radius: 0 !important;
}
.mode-toggle :deep(.v-btn--active) {
  background: var(--ds-navy-tint);
}
@media (max-width: 599px) {
  .mode-toggle {
    width: 100%;
  }
  .mode-toggle :deep(.v-btn) {
    flex: 1 1 0;
  }
}

.panel-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 44px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ds-muted);
}

.avatar-chip--sm {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  font-size: 12px;
}

/* ---- Score sheet ---- */
.score-table {
  width: 100%;
  min-width: 480px;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
}
.score-table th {
  height: 46px;
  padding: 0 14px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-align: center;
  color: var(--ds-muted);
  background: #f8fafc;
  border-bottom: 1px solid var(--ds-border-soft);
  white-space: nowrap;
}
.score-table td {
  height: 58px;
  padding: 8px 14px;
  font-size: 13.5px;
  background: #fff;
  border-bottom: 1px solid var(--ds-border-soft);
}
.score-table tbody tr:last-child td {
  border-bottom: 0;
}
.score-table tbody tr:hover td {
  background: #f8fafc;
}
.score-table .col-no {
  width: 56px;
  min-width: 56px;
}
.score-table .col-name {
  min-width: 200px;
}
.score-table .col-score {
  width: 180px;
}
.score-table .col-subj {
  min-width: 84px;
}
.score-table .col-total,
.score-table .col-rank {
  width: 84px;
  min-width: 84px;
}

/* First two columns stay put while the sheet scrolls sideways on small screens */
.score-table th.col-no,
.score-table td.col-no {
  position: sticky;
  left: 0;
  z-index: 2;
}
.score-table th.col-name,
.score-table td.col-name {
  position: sticky;
  left: 56px;
  z-index: 2;
  box-shadow: 4px 0 8px -6px rgba(15, 23, 42, 0.18);
}

/* Entry inputs */
.score-input {
  max-width: 120px;
  margin: 0 auto;
}
.score-input :deep(input) {
  text-align: center;
  font-weight: 800;
  color: var(--ds-text);
}
.score-input--filled :deep(.v-field) {
  background: #f0fdfa;
}

/* Report cells */
.score-value {
  font-weight: 600;
  color: var(--ds-text);
}
.score-value--empty {
  color: var(--ds-faint);
}
.total-cell {
  font-weight: 900;
  color: var(--ds-navy);
}
.score-table td.total-cell {
  background: #f8fafc;
}
.is-top .total-cell {
  color: var(--ds-teal-700);
}
.rank-chip {
  min-width: 32px;
  justify-content: center;
}
</style>
