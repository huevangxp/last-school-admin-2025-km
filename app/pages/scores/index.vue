<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <div class="text-title mb-1">
          {{ $t("management") }} {{ $t("scores") }}
        </div>
        <div class="text-detail">
          ອາຈານເລືອກຫ້ອງ ແລະ ວິຊາ ແລ້ວປ້ອນຄະແນນນັກຮຽນ · Enter student scores.
        </div>
      </div>

      <v-btn
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
            rounded="lg"
            hide-details
            color="primary"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <label class="text-detail-tiny mb-1 d-block">{{ t("subject") }}</label>
          <v-select
            v-model="selectedSubjectId"
            :items="subjectOptions"
            item-title="label"
            item-value="id"
            variant="outlined"
            density="compact"
            rounded="lg"
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
            rounded="lg"
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
            rounded="lg"
            hide-details
            color="primary"
          ></v-select>
        </v-col>
        <v-col v-if="isAdmin" cols="12" sm="4" md="2">
          <label class="text-detail-tiny mb-1 d-block">{{ t("teacher") }}</label>
          <v-select
            v-model="selectedTeacherId"
            :items="teacherOptions"
            item-title="label"
            item-value="id"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
            color="primary"
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <v-alert
      v-if="saveMsg"
      :type="saveMsgType"
      variant="tonal"
      density="compact"
      class="mb-4"
      >{{ saveMsg }}</v-alert
    >

    <!-- Score entry grid -->
    <v-card elevation="0" class="intelligence-card pa-4">
      <div v-if="!ready" class="text-detail text-center py-10">
        ເລືອກຫ້ອງ, ວິຊາ ແລະ ອາຈານ · Select class, subject and teacher to begin.
      </div>

      <div v-else-if="enrollmentStore.loading" class="py-10 text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <div v-else-if="!rows.length" class="text-detail text-center py-10">
        ບໍ່ມີນັກຮຽນໃນຫ້ອງນີ້ · No students enrolled in this class/year.
      </div>

      <div v-else class="table-wrapper">
        <table class="score-table">
          <thead>
            <tr>
              <th class="col-no text-detail-tiny">NO.</th>
              <th class="col-name text-detail-tiny text-left">
                {{ t("students") }}
              </th>
              <th class="col-score text-detail-tiny">
                {{ t("scores") }} (0–100)
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
                  v-model.number="row.score"
                  type="number"
                  min="0"
                  max="100"
                  variant="outlined"
                  density="compact"
                  hide-details
                  rounded="lg"
                  style="max-width: 120px; margin: 0 auto"
                ></v-text-field>
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

// Logged-in user: admins may pick any teacher; teachers are locked to self and
// only see the classes they homeroom (enforced again on the server).
const roleCookie = useCookie<string>("role");
const idCookie = useCookie<string>("id");
const isAdmin = computed(
  () => (roleCookie.value || "").toLowerCase() === "admin"
);

const selectedClassId = ref("");
const selectedSubjectId = ref("");
const selectedSemester = ref("1");
const selectedMonth = ref("ເດືອນ 1");
const selectedTeacherId = ref("");

const semesterOptions = ["1", "2"];
const monthOptions = Array.from({ length: 12 }, (_, i) => `ເດືອນ ${i + 1}`);

onMounted(async () => {
  await Promise.all([
    classroomStore.fetchAcademicYears(),
    subjectStore.fetchSubjects(),
    // Admins pick from every class + teacher; teachers pick only from the
    // (class, subject) pairs they are assigned to teach.
    isAdmin.value
      ? classroomStore.fetchMyClassrooms()
      : teachingStore.fetchMyTeaching(),
    ...(isAdmin.value ? [teacherStore.fetchTeachers(200, 1)] : []),
  ]);

  // Teachers always enter scores under their own account.
  if (!isAdmin.value && idCookie.value) selectedTeacherId.value = idCookie.value;
});

const yearId = computed(() => classroomStore.latestAcademicYearId || "");

// A teacher's assignments for the current year.
const myTeachingForYear = computed(() =>
  teachingStore.myTeaching.filter((a: any) => a.academic_year_id === yearId.value)
);

const classOptions = computed(() => {
  if (isAdmin.value) {
    return classroomStore.myClassrooms.map((c: any) => ({
      id: c.id,
      label: c.classroom_name,
    }));
  }
  // Distinct classes the teacher teaches in.
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
});

const selectedClass = computed(() => {
  if (isAdmin.value) {
    return classroomStore.myClassrooms.find(
      (c: any) => c.id === selectedClassId.value
    );
  }
  return myTeachingForYear.value.find(
    (a: any) => a.classroom_id === selectedClassId.value
  )?.tb_classroom;
});

const subjectOptions = computed(() => {
  // Teacher: only the subjects they teach in the chosen class.
  if (!isAdmin.value) {
    const seen = new Map<string, any>();
    myTeachingForYear.value
      .filter((a: any) => a.classroom_id === selectedClassId.value && a.tb_subject)
      .forEach((a: any) =>
        seen.set(a.subject_id, { id: a.subject_id, label: a.tb_subject.subject_name })
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
  if (hr) selectedTeacherId.value = hr;
  // Reset subject if it no longer belongs to the new class's grade.
  if (
    selectedSubjectId.value &&
    !subjectOptions.value.some((s) => s.id === selectedSubjectId.value)
  ) {
    selectedSubjectId.value = "";
  }
});

const ready = computed(
  () =>
    !!selectedClassId.value &&
    !!selectedSubjectId.value &&
    !!selectedTeacherId.value &&
    !!yearId.value
);

const rows = ref<any[]>([]);

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

  rows.value = enrollmentStore.enrollments
    .filter((e: any) => e.tb_student)
    .map((e: any) => {
      const s = e.tb_student;
      const existing = scoreByStudent[s.id];
      return {
        enrollment_id: e.id,
        student_id: s.id,
        name: `${s.first_name} ${s.last_name}`,
        score: existing ? Number(existing.score) : 0,
      };
    });
};

watch(
  [ready, selectedClassId, selectedSubjectId, selectedSemester, selectedMonth],
  buildRows
);

const canSave = computed(() => ready.value && rows.value.length > 0);

const saveMsg = ref("");
const saveMsgType = ref<"success" | "error">("success");

const saveAll = async () => {
  saveMsg.value = "";
  try {
    const payload = rows.value.map((r) => ({
      enrollment_id: r.enrollment_id,
      student_id: r.student_id,
      academic_year_id: yearId.value,
      teacher_id: selectedTeacherId.value,
      subject_id: selectedSubjectId.value,
      semester: selectedSemester.value,
      month: selectedMonth.value,
      score: Number(r.score) || 0,
    }));
    const res = await scoreStore.bulkUpsertScores(payload);
    saveMsgType.value = "success";
    saveMsg.value = res?.message || "Scores saved successfully.";
  } catch (error: any) {
    saveMsgType.value = "error";
    saveMsg.value = error.response?.data?.message || "Failed to save scores.";
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
.intelligence-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
}
.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
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
.col-no {
  width: 64px;
}
.col-score {
  width: 180px;
}
</style>
