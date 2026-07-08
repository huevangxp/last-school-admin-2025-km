<template>
  <v-container fluid class="pa-4 pa-md-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div class="d-flex align-center">
        <v-avatar color="indigo-lighten-5" size="44" class="mr-3 rounded-0">
          <v-icon color="indigo-darken-2" size="22">mdi-timetable</v-icon>
        </v-avatar>
        <div>
          <div class="text-title">{{ t("study_schedule") }}</div>
          <div class="text-detail">
            {{ t("timetable-subtitle") }}
          </div>
        </div>
      </div>
      <!-- Only students are read-only; teachers can now edit their classes. -->
      <v-chip
        v-if="isStudent"
        size="small"
        rounded="0"
        color="indigo-lighten-5"
        class="text-indigo-darken-2 font-weight-bold"
        variant="flat"
      >
        <v-icon start size="14">mdi-eye-outline</v-icon>
        {{ t("view_only") }}
      </v-chip>
    </div>

    <!-- Filters: class + academic year -->
    <v-card elevation="0" class="intelligence-card pa-4 mb-6">
      <div class="d-flex flex-column flex-md-row gap-3">
        <!-- Class picker — teachers see one cross-class table, so no picker for
             them. Students are locked to their own class. -->
        <v-select
          v-if="!isTeacher"
          v-model="classId"
          :items="classOptions"
          item-title="label"
          item-value="id"
          :label="t('class')"
          variant="outlined"
          density="compact"
          class="mb-4 mb-md-0"
          hide-details
          rounded="0"
          style="max-width: 260px"
          color="primary"
          prepend-inner-icon="mdi-google-classroom"
          :disabled="isStudent"
        ></v-select>
        <v-select
          v-model="yearId"
          :items="classroomStore.academicYears"
          item-title="title"
          item-value="id"
          :label="t('academic')"
          variant="outlined"
          density="compact"
          hide-details
          rounded="0"
          style="max-width: 220px"
          color="primary"
          prepend-inner-icon="mdi-calendar-check"
        ></v-select>
      </div>
    </v-card>

    <!-- Prompt to choose a class -->
    <v-card
      v-if="!ready"
      elevation="0"
      class="intelligence-card pa-10 text-center text-detail"
    >
      {{ t("pick-class-and-year") }}
    </v-card>

    <template v-else>
      <!-- Admin needs teaching assignments to fill cells -->
      <v-alert
        v-if="isAdmin && !assignmentOptions.length"
        type="info"
        variant="tonal"
        density="compact"
        rounded="0"
        class="mb-4"
      >
        {{ t("no-assignments-for-class") }}
        <NuxtLink to="/teaching" class="font-weight-bold text-primary ml-1">
          {{ t("teaching_assignments") }} →
        </NuxtLink>
      </v-alert>

      <!-- Timetable grid — full weekly table on tablet/desktop -->
      <v-card
        elevation="0"
        class="intelligence-card pa-0 overflow-hidden d-none d-md-block"
      >
        <div class="timetable-wrap">
          <table class="timetable">
            <thead>
              <tr>
                <th class="period-col">{{ t("period") }}</th>
                <th v-for="d in days" :key="d.key">{{ t(d.key) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in scheduleStore.periods" :key="p.id">
                <td class="period-col">
                  <div class="text-title-small">{{ p.period_name }}</div>
                  <div class="text-detail-tiny">{{ p.period_code }}</div>
                </td>
                <td
                  v-for="d in days"
                  :key="d.key"
                  class="slot-cell"
                  :class="{ editable: canEdit }"
                >
                  <!-- Admin/teacher: click to assign / change / clear -->
                  <v-menu v-if="canEdit" :close-on-content-click="true">
                    <template v-slot:activator="{ props }">
                      <div
                        v-bind="props"
                        class="cell-inner"
                        :class="{ filled: cellFor(p.id, d.key) }"
                      >
                        <template v-if="cellFor(p.id, d.key)">
                          <div class="subj">
                            {{ subjectOf(cellFor(p.id, d.key)) }}
                          </div>
                          <div class="tchr">
                            {{ secondaryOf(cellFor(p.id, d.key)) }}
                          </div>
                        </template>
                        <v-icon v-else size="18" color="grey-lighten-1">
                          mdi-plus
                        </v-icon>
                      </div>
                    </template>
                    <v-list density="compact" class="pa-1" min-width="220">
                      <v-list-subheader class="text-detail-tiny">
                        {{ t("subject") }} — {{ t("teacher") }}
                      </v-list-subheader>
                      <v-list-item
                        v-for="opt in assignmentOptions"
                        :key="opt.id"
                        rounded="0"
                        @click="assignCell(p.id, d.key, opt.id)"
                      >
                        <v-list-item-title class="text-detail">
                          <span class="font-weight-bold text-teal-darken-2">{{
                            opt.subject
                          }}</span>
                          · {{ opt.secondary }}
                        </v-list-item-title>
                      </v-list-item>
                      <template v-if="cellFor(p.id, d.key)">
                        <v-divider class="my-1"></v-divider>
                        <v-list-item
                          rounded="0"
                          @click="clearCell(cellFor(p.id, d.key))"
                        >
                          <template v-slot:prepend>
                            <v-icon size="16" color="error">
                              mdi-close-circle-outline
                            </v-icon>
                          </template>
                          <v-list-item-title
                            class="text-detail text-error font-weight-bold"
                          >
                            {{ t("clear") }}
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                    </v-list>
                  </v-menu>

                  <!-- Teacher / student: read-only -->
                  <div
                    v-else
                    class="cell-inner"
                    :class="{ filled: cellFor(p.id, d.key) }"
                  >
                    <template v-if="cellFor(p.id, d.key)">
                      <div class="subj">
                        {{ subjectOf(cellFor(p.id, d.key)) }}
                      </div>
                      <div class="tchr">
                        {{ secondaryOf(cellFor(p.id, d.key)) }}
                      </div>
                    </template>
                    <span v-else class="text-detail-tiny text-grey-lighten-1"
                      >—</span
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-card>

      <!-- Mobile: one day at a time — a day selector plus a vertical list of
           periods. Replaces the wide horizontally-scrolling table on phones. -->
      <div class="d-md-none">
        <v-chip-group
          v-model="selectedDayIdx"
          mandatory
          class="day-chips mb-3"
          selected-class="day-chip-on"
        >
          <v-chip
            v-for="(d, i) in days"
            :key="d.key"
            :value="i"
            rounded="0"
            variant="flat"
            size="small"
            class="font-weight-bold"
          >
            {{ t(d.key) }}
          </v-chip>
        </v-chip-group>

        <v-card
          v-for="p in scheduleStore.periods"
          :key="p.id"
          elevation="0"
          class="intelligence-card mb-2 overflow-hidden"
        >
          <div class="mobile-row d-flex align-stretch">
            <div class="mobile-period-badge">
              <div class="text-title-small">{{ p.period_name }}</div>
              <div class="text-detail-tiny">{{ p.period_code }}</div>
            </div>

            <!-- Admin/teacher: tap to assign / change / clear -->
            <v-menu v-if="canEdit" :close-on-content-click="true">
              <template v-slot:activator="{ props }">
                <div
                  v-bind="props"
                  class="mobile-slot"
                  :class="{ filled: cellFor(p.id, currentDayKey) }"
                >
                  <template v-if="cellFor(p.id, currentDayKey)">
                    <div class="subj">
                      {{ subjectOf(cellFor(p.id, currentDayKey)) }}
                    </div>
                    <div class="tchr">
                      {{ secondaryOf(cellFor(p.id, currentDayKey)) }}
                    </div>
                  </template>
                  <span
                    v-else
                    class="text-primary font-weight-bold d-inline-flex align-center"
                  >
                    <v-icon size="16" start>mdi-plus</v-icon>{{ t("add") }}
                  </span>
                </div>
              </template>
              <v-list density="compact" class="pa-1" min-width="220">
                <v-list-subheader class="text-detail-tiny">
                  {{ t("subject") }} — {{ t("teacher") }}
                </v-list-subheader>
                <v-list-item
                  v-for="opt in assignmentOptions"
                  :key="opt.id"
                  rounded="0"
                  @click="assignCell(p.id, currentDayKey, opt.id)"
                >
                  <v-list-item-title class="text-detail">
                    <span class="font-weight-bold text-teal-darken-2">{{
                      opt.subject
                    }}</span>
                    · {{ opt.secondary }}
                  </v-list-item-title>
                </v-list-item>
                <template v-if="cellFor(p.id, currentDayKey)">
                  <v-divider class="my-1"></v-divider>
                  <v-list-item
                    rounded="0"
                    @click="clearCell(cellFor(p.id, currentDayKey))"
                  >
                    <template v-slot:prepend>
                      <v-icon size="16" color="error">
                        mdi-close-circle-outline
                      </v-icon>
                    </template>
                    <v-list-item-title
                      class="text-detail text-error font-weight-bold"
                    >
                      {{ t("clear") }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-list>
            </v-menu>

            <!-- Teacher / student: read-only -->
            <div
              v-else
              class="mobile-slot"
              :class="{ filled: cellFor(p.id, currentDayKey) }"
            >
              <template v-if="cellFor(p.id, currentDayKey)">
                <div class="subj">
                  {{ subjectOf(cellFor(p.id, currentDayKey)) }}
                </div>
                <div class="tchr">
                  {{ secondaryOf(cellFor(p.id, currentDayKey)) }}
                </div>
              </template>
              <span v-else class="text-detail-tiny text-grey-lighten-1">—</span>
            </div>
          </div>
        </v-card>
      </div>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useClassroomStore } from "~/stores/apiClassroom";
import { useTeachingStore } from "~/stores/apiTeaching";
import { useScheduleStore } from "~/stores/apiSchedule";
import { useUiStore } from "~/stores/ui";

const { t } = useI18n();
const classroomStore = useClassroomStore();
const teachingStore = useTeachingStore();
const scheduleStore = useScheduleStore();
const ui = useUiStore();

// Admin edits the timetable; teachers & students only view it.
const roleCookie = useCookie<string>("role");
const idCookie = useCookie<string>("id");
const isAdmin = computed(
  () => (roleCookie.value || "").toLowerCase() === "admin"
);
// Students are scoped to their own class only (via /my-classrooms); everyone
// else picks from the full class list.
const isStudent = computed(
  () => (roleCookie.value || "").toLowerCase() === "student"
);
// Teachers pick from the classes they teach and can set the timetable for those
// classes (scoped to their own subjects on the server).
const isTeacher = computed(
  () => (roleCookie.value || "").toLowerCase() === "teacher"
);
// Admins and teachers may edit cells; students are read-only.
const canEdit = computed(() => isAdmin.value || isTeacher.value);

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("study_schedule"), disabled: true, to: "/timetable" },
];

const days = [
  { key: "monday" },
  { key: "tuesday" },
  { key: "wednesday" },
  { key: "thursday" },
  { key: "friday" },
];

// Mobile layout shows one day at a time. Default to today when it's a weekday,
// otherwise Monday.
const jsDay = new Date().getDay(); // 0 Sun … 6 Sat
const selectedDayIdx = ref(jsDay >= 1 && jsDay <= 5 ? jsDay - 1 : 0);
const currentDayKey = computed(
  () => days[selectedDayIdx.value]?.key || "monday"
);

const classId = ref<string | null>(null);
const yearId = ref<string | null>(null);

// Class picker options (admins / students only — teachers have no picker).
const classOptions = computed(() => {
  const source = isStudent.value
    ? classroomStore.myClassrooms
    : classroomStore.classrooms;
  return source.map((c: any) => ({ id: c.id, label: c.classroom_name }));
});

// Options to fill a cell.
//  • Teachers: every one of their own assignments (across all classes) —
//    labelled "subject · class" — so a slot can be set for any class they teach.
//  • Admins: every assignment in the selected class, labelled "subject · teacher".
const assignmentOptions = computed(() => {
  if (isTeacher.value) {
    return teachingStore.myTeaching
      .filter((a: any) => a.academic_year_id === yearId.value)
      .map((a: any) => ({
        id: a.id,
        classroom_id: a.classroom_id,
        subject: a.tb_subject?.subject_name || "—",
        secondary: a.tb_classroom?.classroom_name || "—",
      }));
  }
  return teachingStore.assignments.map((a: any) => ({
    id: a.id,
    classroom_id: classId.value,
    subject: a.tb_subject?.subject_name || "—",
    secondary: a.tb_teacher?.full_name || a.tb_teacher?.username || t("teacher"),
  }));
});

// Fast lookup of a filled cell by (period, day).
const cellFor = (periodId: string, day: string) =>
  scheduleStore.cells.find(
    (c: any) => c.period_id === periodId && c.day_of_week === day
  );

const subjectOf = (cell: any) =>
  cell?.assignment?.tb_subject?.subject_name || "—";
// The classroom of a cell (teacher's cross-class table carries tb_classroom).
const classroomOf = (cell: any) => cell?.tb_classroom?.classroom_name || "—";
// Second line of a cell: teachers see the class they teach; admins & students
// see the teacher's name.
const secondaryOf = (cell: any) =>
  isTeacher.value
    ? classroomOf(cell)
    : cell?.assignment?.tb_teacher?.full_name ||
      cell?.assignment?.tb_teacher?.username ||
      "—";

// Teachers only need a year (their table spans every class they teach); admins
// and students also need a class.
const ready = computed(() =>
  isTeacher.value ? !!yearId.value : !!classId.value && !!yearId.value
);

const loadGrid = async () => {
  if (!yearId.value) return;
  // Teacher: one cross-class table of their own schedule + their assignments.
  if (isTeacher.value) {
    if (!idCookie.value) return;
    await Promise.all([
      scheduleStore.fetchTeacherSchedule(idCookie.value, yearId.value),
      teachingStore.fetchMyTeaching(yearId.value),
    ]);
    return;
  }
  if (!classId.value) return;
  await scheduleStore.fetchSchedule(classId.value, yearId.value);
  if (isAdmin.value) {
    await teachingStore.fetchAssignments({
      classroom_id: classId.value,
      academic_year_id: yearId.value,
    });
  }
};

onMounted(async () => {
  await Promise.all([
    isStudent.value
      ? classroomStore.fetchMyClassrooms()
      : isTeacher.value
        ? Promise.resolve()
        : classroomStore.fetchClassrooms(200),
    classroomStore.fetchAcademicYears(),
    scheduleStore.fetchPeriods(),
  ]);
  yearId.value = classroomStore.latestAcademicYearId || null;
  if (!isTeacher.value) classId.value = classOptions.value[0]?.id || null;
  await loadGrid();
});

watch([classId, yearId], loadGrid);

// Reload after any change: teachers refetch their cross-class schedule; others
// refetch the selected class's schedule.
const reloadCells = async () => {
  if (isTeacher.value && idCookie.value) {
    await scheduleStore.fetchTeacherSchedule(idCookie.value, yearId.value!);
  } else if (classId.value) {
    await scheduleStore.fetchSchedule(classId.value, yearId.value!);
  }
};

const assignCell = async (
  periodId: string,
  day: string,
  assignmentId: string
) => {
  // The target class comes from the chosen assignment (teachers) or the picked
  // class (admins).
  const opt = assignmentOptions.value.find((o) => o.id === assignmentId);
  const classroomId = opt?.classroom_id || classId.value;
  if (!classroomId) return;
  try {
    // A teacher can't be in two rooms at once: if this slot already holds a
    // different class, clear it first before assigning the new one.
    if (isTeacher.value) {
      const existing = cellFor(periodId, day);
      if (existing && existing.classroom_id !== classroomId) {
        await scheduleStore.deleteCell(existing.id);
      }
    }
    await scheduleStore.saveCell({
      classroom_id: classroomId,
      academic_year_id: yearId.value!,
      period_id: periodId,
      day_of_week: day,
      teaching_assignment_id: assignmentId,
    });
    await reloadCells();
  } catch (error: any) {
    ui.notify(error.response?.data?.message || t("failed-to-save"), "error");
  }
};

const clearCell = async (cell: any) => {
  if (!cell) return;
  try {
    await scheduleStore.deleteCell(cell.id);
    await reloadCells();
  } catch (error) {
    ui.notify(t("failed-to-clear"), "error");
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

.timetable-wrap {
  overflow-x: auto;
}
.timetable {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 720px;
}
.timetable th,
.timetable td {
  border: 1px solid #eef2f6;
  text-align: center;
  vertical-align: middle;
}
.timetable thead th {
  background: #eef2ff;
  color: #3730a3;
  font-size: 12px;
  font-weight: 800;
  padding: 10px 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.period-col {
  width: 92px;
  background: #f8fafc;
  padding: 8px 6px;
}
.slot-cell {
  height: 62px;
  padding: 0;
}
.cell-inner {
  height: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px;
}
.slot-cell.editable .cell-inner {
  cursor: pointer;
  transition: background 0.15s ease;
}
.slot-cell.editable .cell-inner:hover {
  background: #f5f3ff;
}
.cell-inner.filled {
  background: #f0fdfa;
}
.cell-inner .subj {
  font-size: 12px;
  font-weight: 800;
  color: #0f766e;
  line-height: 1.15;
}
.cell-inner .tchr {
  font-size: 10.5px;
  font-weight: 600;
  color: #64748b;
  line-height: 1.1;
}

/* ---- Mobile day view ---- */
.day-chips :deep(.v-chip) {
  color: #3730a3;
  background: #eef2ff;
}
.day-chips :deep(.v-chip.day-chip-on) {
  background: #3730a3;
  color: #fff;
}
.mobile-period-badge {
  flex: 0 0 84px;
  width: 84px;
  background: #f8fafc;
  border-right: 1px solid #eef2f6;
  padding: 10px 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.mobile-slot {
  flex: 1 1 auto;
  min-height: 58px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  text-align: center;
}
.mobile-slot.filled {
  background: #f0fdfa;
}
.mobile-slot .subj {
  font-size: 13px;
  font-weight: 800;
  color: #0f766e;
  line-height: 1.15;
}
.mobile-slot .tchr {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}
</style>
