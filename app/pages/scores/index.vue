<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between ga-4 mb-6"
    >
      <div>
        <div class="text-title mb-1">
          {{ mode === "enter" ? `${$t("management")} ${$t("scores")}` : $t("score_report") }}
        </div>
        <div class="text-detail">
          {{ mode === "enter" ? $t("enter-student-scores") : $t("full-class-results") }}
        </div>
      </div>

      <div class="d-flex align-center ga-3">
        <!-- Mode toggle — hidden for the read-only student role. -->
        <v-btn-toggle
          v-if="!isStudent"
          v-model="mode"
          mandatory
          density="compact"
          variant="outlined"
          divided
          rounded="0"
          color="primary"
        >
          <v-btn value="enter" size="small" class="text-none">
            <v-icon icon="mdi-pencil-outline" start size="16"></v-icon>
            {{ $t("score_entry") }}
          </v-btn>
          <v-btn value="view" size="small" class="text-none">
            <v-icon icon="mdi-table-large" start size="16"></v-icon>
            {{ $t("score_report") }}
          </v-btn>
        </v-btn-toggle>

        <v-btn
          v-if="mode === 'enter'"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="36"
          :loading="scoreStore.saving"
          :disabled="!canSave"
          @click="saveAll"
        >
          <v-icon icon="mdi-content-save-outline" start size="18"></v-icon>
          {{ $t("save") }}
        </v-btn>
      </div>
    </div>

    <!-- Filters -->
    <v-card elevation="0" class="intelligence-card pa-4 mb-6">
      <v-row dense>
        <v-col cols="12" sm="6" md="3">
          <label class="text-detail-tiny mb-1 d-block">{{ t("class") }}</label>
          <v-select
            v-model="selectedClassId"
            :items="classOptions"
            item-title="label"
            item-value="id"
            variant="outlined"
            density="compact"
            rounded="0"
            hide-details
            color="primary"
            :disabled="isStudent"
          ></v-select>
        </v-col>
        <v-col v-if="mode === 'enter'" cols="12" sm="6" md="3">
          <label class="text-detail-tiny mb-1 d-block">{{ t("subject") }}</label>
          <v-select
            v-model="selectedSubjectId"
            :items="subjectOptions"
            item-title="label"
            item-value="id"
            variant="outlined"
            density="compact"
            rounded="0"
            hide-details
            color="primary"
          ></v-select>
        </v-col>
        <v-col cols="6" sm="4" md="2">
          <label class="text-detail-tiny mb-1 d-block">{{ t("semester") }}</label>
          <v-select
            v-model="selectedSemester"
            :items="semesterOptions"
            variant="outlined"
            density="compact"
            rounded="0"
            hide-details
            color="primary"
          ></v-select>
        </v-col>
        <v-col cols="6" sm="4" md="2">
          <label class="text-detail-tiny mb-1 d-block">{{ t("month") }}</label>
          <v-select
            v-model="selectedMonth"
            :items="monthOptions"
            variant="outlined"
            density="compact"
            rounded="0"
            hide-details
            color="primary"
          ></v-select>
        </v-col>
        <v-col v-if="mode === 'enter' && isAdmin" cols="12" sm="4" md="2">
          <label class="text-detail-tiny mb-1 d-block">{{ t("teacher") }}</label>
          <v-select
            v-model="selectedTeacherId"
            :items="teacherOptions"
            item-title="label"
            item-value="id"
            variant="outlined"
            density="compact"
            rounded="0"
            hide-details
            color="primary"
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <!-- ENTER MODE: editable score grid (one subject) -->
    <v-card v-if="mode === 'enter'" elevation="0" class="intelligence-card pa-4">
      <div v-if="!ready" class="text-detail text-center py-10">
        {{ $t("select-class-subject-teacher") }}
      </div>

      <div v-else-if="enrollmentStore.loading" class="py-10 text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <div v-else-if="!rows.length" class="text-detail text-center py-10">
        {{ $t("no-students-enrolled") }}
      </div>

      <div v-else class="table-wrapper">
        <table class="score-table">
          <thead>
            <tr>
              <th class="col-no text-detail-tiny">{{ t("column-no") }}</th>
              <th class="col-name text-detail-tiny text-left">
                {{ t("students") }}
              </th>
              <th class="col-score text-detail-tiny">
                {{ t("scores") }} (0–10)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in rows" :key="row.student_id" class="table-row">
              <td class="text-center text-detail-tiny">{{ index + 1 }}</td>
              <td class="text-left px-4 text-detail font-weight-black">
                {{ row.name }}
              </td>
              <td class="text-center score-cell">
                <v-text-field
                  v-model="row.score"
                  type="number"
                  min="0"
                  max="10"
                  variant="outlined"
                  density="compact"
                  hide-details
                  rounded="0"
                  style="max-width: 120px; margin: 0 auto"
                  @focus="$event.target.select()"
                  @blur="clampScore(row)"
                ></v-text-field>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-card>

    <!-- VIEW MODE: read-only results sheet with totals and rank -->
    <v-card v-else elevation="0" class="intelligence-card pa-4">
      <div v-if="!selectedClassId" class="text-detail text-center py-10">
        {{ $t("select-a-class") }}
      </div>
      <div v-else-if="scoreStore.loading" class="py-10 text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div
        v-else-if="scoreStore.error"
        class="text-detail text-center py-10 text-error"
      >
        {{ scoreStore.error }}
      </div>
      <div v-else-if="!students.length" class="text-detail text-center py-10">
        {{ $t("no-students") }}
      </div>

      <div v-else class="table-wrapper">
        <table class="score-table">
          <thead>
            <tr>
              <th class="col-no text-detail-tiny">{{ t("column-no") }}</th>
              <th class="col-name text-detail-tiny text-left">{{ t("students") }}</th>
              <th
                v-for="subj in subjects"
                :key="subj.id"
                class="col-score text-detail-tiny"
                :title="subj.subject_name"
              >
                {{ subj.subject_code || subj.subject_name }}
              </th>
              <th class="col-total text-detail-tiny">{{ t("total") }}</th>
              <th class="col-rank text-detail-tiny">{{ t("rank") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in students"
              :key="row.student_id"
              class="table-row"
            >
              <td class="text-center text-detail-tiny">{{ index + 1 }}</td>
              <td class="text-left px-4 text-detail font-weight-black">
                {{ row.name }}
              </td>
              <td
                v-for="subj in subjects"
                :key="subj.id"
                class="text-center score-cell text-detail"
              >
                {{ row.scores[subj.id] ?? "-" }}
              </td>
              <td
                class="text-center font-weight-black total-cell text-detail text-primary"
              >
                {{ row.total }}
              </td>
              <td class="text-center rank-cell">
                <v-chip
                  size="x-small"
                  :color="rankColor(index)"
                  variant="flat"
                  class="font-weight-black"
                >
                  {{ index + 1 }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-card>
  </v-container>
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
};

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
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
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
.intelligence-card {
  background: white;
  border: 1px solid #f1f5f9;
}
.table-wrapper {
  overflow-x: auto;
  border: 1px solid #f1f5f9;
}
.score-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}
.score-table th {
  padding: 12px;
  border: 1px solid #f1f5f9;
  background-color: #f8fafc;
  color: #64748b;
  height: 48px;
}
.score-table td {
  padding: 10px;
  border: 1px solid #f1f5f9;
  height: 56px;
}
.table-row:hover {
  background-color: #f8fafc !important;
}
.total-cell {
  background: #f1f5f9;
}
.col-no {
  width: 64px;
}
.col-score {
  width: 180px;
}
.col-total,
.col-rank {
  width: 80px;
}
</style>
