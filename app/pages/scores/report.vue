<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <div class="text-title mb-1">{{ $t("score_report") }}</div>
        <div class="text-detail">
          {{ $t("full-class-results") }}
        </div>
      </div>
      <!-- Score entry is off-limits to the read-only student role. -->
      <v-btn
        v-if="!isStudent"
        variant="flat"
        color="white"
        class="modern-action-btn secondary border"
        height="36"
        to="/scores"
      >
        <v-icon icon="mdi-pencil-outline" start size="18"></v-icon>
        {{ t("scores") }}
      </v-btn>
    </div>

    <!-- Filters -->
    <v-card elevation="0" class="intelligence-card pa-4 mb-6">
      <v-row dense>
        <v-col cols="12" sm="6" md="4">
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
          ></v-select>
        </v-col>
        <v-col cols="6" sm="3" md="2">
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
        <v-col cols="6" sm="3" md="2">
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
      </v-row>
    </v-card>

    <v-card elevation="0" class="intelligence-card pa-4">
      <div v-if="!selectedClassId" class="text-detail text-center py-10">
        {{ $t("select-a-class") }}
      </div>
      <div v-else-if="scoreStore.loading" class="py-10 text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else-if="scoreStore.error" class="text-detail text-center py-10 text-error">
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
            <tr v-for="(row, index) in students" :key="row.student_id" class="table-row">
              <td class="text-center text-detail-tiny">{{ index + 1 }}</td>
              <td class="text-left px-4 text-detail font-weight-black">{{ row.name }}</td>
              <td
                v-for="subj in subjects"
                :key="subj.id"
                class="text-center score-cell text-detail"
              >
                {{ row.scores[subj.id] ?? "-" }}
              </td>
              <td class="text-center font-weight-black total-cell text-detail text-primary">
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
import { useScoreStore } from "~/stores/apiScore";

const { t } = useI18n();
const classroomStore = useClassroomStore();
const scoreStore = useScoreStore();

// Students view the report read-only — hide the link into score entry.
const roleCookie = useCookie<string>("role");
const isStudent = computed(
  () => (roleCookie.value || "").toLowerCase() === "student"
);
const isAdmin = computed(() =>
  ["admin", "administrator"].includes((roleCookie.value || "").toLowerCase())
);

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("scores"), disabled: false, to: "/scores" },
  { title: t("score_report"), disabled: true, to: "/scores/report" },
];

const selectedClassId = ref("");
const selectedSemester = ref("1");
// Default to the current calendar month (e.g. ເດືອນ 7 in July).
const selectedMonth = ref(`ເດືອນ ${new Date().getMonth() + 1}`);

const semesterOptions = ["1", "2"];
const monthOptions = Array.from({ length: 12 }, (_, i) => `ເດືອນ ${i + 1}`);

// Homeroom teachers see their own classes; admins see all (via /my-classrooms).
onMounted(async () => {
  await Promise.all([
    classroomStore.fetchMyClassrooms(),
    classroomStore.fetchAcademicYears(),
  ]);
});

const yearId = computed(() => classroomStore.latestAcademicYearId || "");

const classOptions = computed(() =>
  classroomStore.myClassrooms.map((c: any) => ({
    id: c.id,
    label: c.classroom_name,
  }))
);

const subjects = ref<any[]>([]);
const students = ref<any[]>([]);

const load = async () => {
  if (!selectedClassId.value || !yearId.value) {
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

watch([selectedClassId, selectedSemester, selectedMonth, yearId], load);

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
  height: 52px;
}
.table-row:hover {
  background-color: #f8fafc !important;
}
.total-cell {
  background: #f1f5f9;
}
.col-no {
  width: 56px;
}
.col-total,
.col-rank {
  width: 80px;
}
</style>
