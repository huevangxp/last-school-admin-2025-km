<template>
  <v-container fluid class="pa-4 pa-md-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div class="d-flex align-center">
        <v-avatar color="indigo-lighten-5" size="44" class="mr-3 rounded-0">
          <v-icon color="indigo-darken-2" size="22">{{ headerIcon }}</v-icon>
        </v-avatar>
        <div>
          <div class="text-title">{{ headerTitle }}</div>
          <div class="text-detail">
            {{ t("timetable-subtitle") }}
          </div>
        </div>
      </div>
      <div class="d-flex align-center ga-2 mt-3 mt-md-0">
        <!-- Only students are read-only; teachers can edit their own subjects. -->
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

        <!-- Export / print the current timetable -->
        <v-menu v-if="ready">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="tonal"
              color="indigo-darken-2"
              rounded="0"
              size="small"
              :loading="exporting"
            >
              <v-icon start size="18">mdi-tray-arrow-down</v-icon>
              {{ t("export") }}
              <v-icon end size="16">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list density="compact" min-width="200">
            <v-list-item rounded="0" @click="exportExcel">
              <template v-slot:prepend>
                <v-icon size="18" color="green-darken-2">
                  mdi-file-excel-outline
                </v-icon>
              </template>
              <v-list-item-title class="text-detail">
                {{ t("download_excel") }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item rounded="0" @click="exportImage">
              <template v-slot:prepend>
                <v-icon size="18" color="blue-darken-2">
                  mdi-file-image-outline
                </v-icon>
              </template>
              <v-list-item-title class="text-detail">
                {{ t("download_image") }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item rounded="0" @click="exportPdf">
              <template v-slot:prepend>
                <v-icon size="18" color="red-darken-2">
                  mdi-file-pdf-box
                </v-icon>
              </template>
              <v-list-item-title class="text-detail">
                {{ t("download_pdf") }}
              </v-list-item-title>
            </v-list-item>
            <v-divider class="my-1"></v-divider>
            <v-list-item rounded="0" @click="printTimetable">
              <template v-slot:prepend>
                <v-icon size="18" color="grey-darken-2">mdi-printer</v-icon>
              </template>
              <v-list-item-title class="text-detail">
                {{ t("print") }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <!-- Filters -->
    <v-card elevation="0" class="intelligence-card pa-4 mb-6">
      <div class="d-flex flex-column flex-md-row gap-3">
        <!-- Study page: class picker. Students are locked to their own class. -->
        <v-select
          v-if="!isTeachingTab"
          v-model="studyClassId"
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

        <!-- Teaching page: teacher picker (admins only — a teacher only ever
             sees their own schedule). -->
        <v-select
          v-if="isTeachingTab && isAdmin"
          v-model="teacherId"
          :items="teacherOptions"
          item-title="label"
          item-value="id"
          :label="t('teacher')"
          variant="outlined"
          density="compact"
          class="mb-4 mb-md-0"
          hide-details
          rounded="0"
          style="max-width: 260px"
          color="primary"
          prepend-inner-icon="mdi-account-tie"
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

    <!-- Prompt to choose a class / teacher -->
    <v-card
      v-if="!ready"
      elevation="0"
      class="intelligence-card pa-10 text-center text-detail"
    >
      {{ isTeachingTab ? t("pick-teacher-and-year") : t("pick-class-and-year") }}
    </v-card>

    <template v-else>
      <!-- Editors need teaching assignments to fill cells -->
      <v-alert
        v-if="canEdit && !assignmentOptions.length"
        type="info"
        variant="tonal"
        density="compact"
        rounded="0"
        class="mb-4"
      >
        {{
          isTeachingTab
            ? t("no-assignments-for-teacher")
            : t("no-assignments-for-class")
        }}
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
                  <!-- Admin teaching board: click opens the add/change dialog
                       so a subject + class can be created inline. -->
                  <div
                    v-if="canInlineCreate"
                    class="cell-inner"
                    :class="{ filled: cellFor(p.id, d.key) }"
                    @click="openAdd(p.id, d.key)"
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

                  <!-- Teacher / admin study board: pick from existing assignments -->
                  <v-menu
                    v-else-if="canEdit"
                    :close-on-content-click="true"
                  >
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
                        {{ t("subject") }} —
                        {{ isTeachingTab ? t("class") : t("teacher") }}
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

                  <!-- Student: read-only -->
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

            <!-- Admin teaching board: tap opens the add/change dialog -->
            <div
              v-if="canInlineCreate"
              class="mobile-slot"
              :class="{ filled: cellFor(p.id, currentDayKey) }"
              @click="openAdd(p.id, currentDayKey)"
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

            <!-- Teacher / admin study board: pick from existing assignments -->
            <v-menu v-else-if="canEdit" :close-on-content-click="true">
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
                  {{ t("subject") }} —
                  {{ isTeachingTab ? t("class") : t("teacher") }}
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

            <!-- Student: read-only -->
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

    <!-- Inline add/change teaching time (admin, teaching board) -->
    <v-dialog v-model="addDialog" max-width="440">
      <v-card rounded="0" class="pa-2">
        <v-card-title class="d-flex align-center text-title-small">
          <v-icon start size="20" color="indigo-darken-2">
            mdi-clock-plus-outline
          </v-icon>
          {{ addDialogCell ? t("change_teaching_time") : t("add_teaching_time") }}
        </v-card-title>
        <v-card-subtitle class="text-detail-tiny">
          {{ currentTeacherLabel }}<template v-if="addSlotLabel"> · {{ addSlotLabel }}</template>
        </v-card-subtitle>
        <v-card-text class="pt-4">
          <v-select
            v-model="addClassId"
            :items="classOptions"
            item-title="label"
            item-value="id"
            :label="t('class')"
            variant="outlined"
            density="compact"
            rounded="0"
            hide-details
            class="mb-3"
            prepend-inner-icon="mdi-google-classroom"
          ></v-select>
          <v-select
            v-model="addSubjectId"
            :items="subjectOptions"
            item-title="label"
            item-value="id"
            :label="t('subject')"
            variant="outlined"
            density="compact"
            rounded="0"
            hide-details
            prepend-inner-icon="mdi-book-open-variant"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="addDialogCell"
            color="error"
            variant="text"
            rounded="0"
            @click="clearFromDialog"
          >
            {{ t("clear") }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="text" rounded="0" @click="addDialog = false">
            {{ t("cancel") }}
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            rounded="0"
            :disabled="!addClassId || !addSubjectId"
            :loading="adding"
            @click="addTeachingTime"
          >
            {{ t("save") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useClassroomStore } from "~/stores/apiClassroom";
import { useTeachingStore } from "~/stores/apiTeaching";
import { useScheduleStore } from "~/stores/apiSchedule";
import { useTeacherStore } from "~/stores/apiTeacher";
import { useSubjectStore } from "~/stores/apiSubject";
import { useUiStore } from "~/stores/ui";

// Which "page" this board is: the class-centric study schedule or the
// teacher-centric teaching schedule. Fixed by the route (two menu items), so
// there's no in-page tab switcher.
const props = defineProps<{ mode: "study" | "teaching" }>();

const { t } = useI18n();
const classroomStore = useClassroomStore();
const teachingStore = useTeachingStore();
const scheduleStore = useScheduleStore();
const teacherStore = useTeacherStore();
const subjectStore = useSubjectStore();
const ui = useUiStore();

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
// Teachers set the timetable for the classes they teach (scoped to their own
// subjects on the server).
const isTeacher = computed(
  () => (roleCookie.value || "").toLowerCase() === "teacher"
);
// Admins and teachers may edit cells; students are read-only.
const canEdit = computed(() => isAdmin.value || isTeacher.value);

// Which board this is, driven purely by the route. Teachers get both: the
// student/study table on /timetable and their own teaching table on
// /timetable/teaching (edits are scoped to their own subjects on the server).
const isTeachingTab = computed(() => props.mode === "teaching");

// On the teaching board an admin can add a slot for the chosen teacher by
// picking a subject + class inline — creating the teaching assignment on the fly
// if it doesn't exist yet. (Creating assignments is admin-only on the server, so
// teachers keep the pick-from-existing flow.)
const canInlineCreate = computed(() => isAdmin.value && isTeachingTab.value);

const headerIcon = computed(() =>
  isTeachingTab.value ? "mdi-human-male-board" : "mdi-timetable"
);
const headerTitle = computed(() =>
  isTeachingTab.value ? t("teaching_schedule") : t("study_schedule")
);

const breadcrumbs = computed(() => [
  { title: t("dashboard"), disabled: false, to: "/" },
  {
    title: headerTitle.value,
    disabled: true,
    to: isTeachingTab.value ? "/timetable/teaching" : "/timetable",
  },
]);

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

// Study board picks a class; Teaching board picks a teacher (admins) or is
// locked to the logged-in teacher.
const studyClassId = ref<string | null>(null);
const teacherId = ref<string | null>(null);
const yearId = ref<string | null>(null);

// Inline "add teaching time" dialog (admin, teaching board).
const addDialog = ref(false);
const adding = ref(false);
const addPeriodId = ref<string | null>(null);
const addDay = ref<string | null>(null);
const addClassId = ref<string | null>(null);
const addSubjectId = ref<string | null>(null);

// Class picker options (admins / students only). Students see just their class.
const classOptions = computed(() => {
  const source = isStudent.value
    ? classroomStore.myClassrooms
    : classroomStore.classrooms;
  return source.map((c: any) => ({ id: c.id, label: c.classroom_name }));
});

// Teacher picker options (admins only).
const teacherOptions = computed(() =>
  teacherStore.teachers.map((tc: any) => ({
    id: tc.id,
    label: tc.full_name || tc.username,
  }))
);

// Subject options for the inline-add dialog.
const subjectOptions = computed(() =>
  subjectStore.subjects.map((s: any) => ({
    id: s.id,
    label: s.subject_name || s.subject_code,
  }))
);

// Name of the teacher the teaching board is currently showing (dialog title).
const currentTeacherLabel = computed(
  () => teacherOptions.value.find((o) => o.id === teacherId.value)?.label || ""
);
// The cell the dialog is currently editing (null when adding to an empty slot).
const addDialogCell = computed(() =>
  addPeriodId.value && addDay.value
    ? cellFor(addPeriodId.value, addDay.value)
    : null
);
// Human label for the slot being edited, e.g. "P1 · Monday".
const addSlotLabel = computed(() => {
  const p = scheduleStore.periods.find((x: any) => x.id === addPeriodId.value);
  const dayTitle = addDay.value ? t(addDay.value) : "";
  return [p?.period_name, dayTitle].filter(Boolean).join(" · ");
});

// Options to fill a cell.
//  • Teaching board: every assignment of the chosen teacher (across all
//    classes), labelled "subject · class".
//  • Study board: every assignment in the selected class, labelled
//    "subject · teacher".
const assignmentOptions = computed(() => {
  if (isTeachingTab.value) {
    // Teachers read their own assignments from /my-teaching; admins fetch the
    // chosen teacher's assignments into `assignments`.
    const source = isTeacher.value
      ? teachingStore.myTeaching
      : teachingStore.assignments;
    return source
      .filter((a: any) => a.academic_year_id === yearId.value)
      .map((a: any) => ({
        id: a.id,
        classroom_id: a.classroom_id,
        subject: a.tb_subject?.subject_name || "—",
        secondary: a.tb_classroom?.classroom_name || "—",
      }));
  }
  // Study board. Admins list every assignment in the class (from the admin-only
  // endpoint); teachers list just their own (from /my-teaching) for this class,
  // which is also all they're allowed to schedule.
  const studySource = isTeacher.value
    ? teachingStore.myTeaching.filter(
        (a: any) =>
          a.academic_year_id === yearId.value &&
          a.classroom_id === studyClassId.value
      )
    : teachingStore.assignments;
  return studySource.map((a: any) => ({
    id: a.id,
    classroom_id: studyClassId.value,
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
// The classroom of a cell (teaching schedule spans classes → carries tb_classroom).
const classroomOf = (cell: any) => cell?.tb_classroom?.classroom_name || "—";
// Second line of a cell: Teaching board shows the class; Study board shows the
// teacher.
const secondaryOf = (cell: any) =>
  isTeachingTab.value
    ? classroomOf(cell)
    : cell?.assignment?.tb_teacher?.full_name ||
      cell?.assignment?.tb_teacher?.username ||
      "—";

// Teaching board needs a teacher + year; Study board needs a class + year.
const ready = computed(() =>
  isTeachingTab.value
    ? !!teacherId.value && !!yearId.value
    : !!studyClassId.value && !!yearId.value
);

const loadGrid = async () => {
  if (!yearId.value) return;
  // Teaching board: one cross-class table of the chosen teacher's schedule + the
  // assignments that fill it.
  if (isTeachingTab.value) {
    if (!teacherId.value) return;
    await Promise.all([
      scheduleStore.fetchTeacherSchedule(teacherId.value, yearId.value),
      isTeacher.value
        ? teachingStore.fetchMyTeaching(yearId.value)
        : teachingStore.fetchAssignments({
            teacher_id: teacherId.value,
            academic_year_id: yearId.value,
          }),
    ]);
    return;
  }
  // Study board: the selected class's schedule + the assignments that fill it.
  // Admins pull every assignment in the class (admin-only endpoint); teachers
  // pull their own via /my-teaching. Students don't edit, so fetch nothing.
  if (!studyClassId.value) return;
  await scheduleStore.fetchSchedule(studyClassId.value, yearId.value);
  if (isAdmin.value) {
    await teachingStore.fetchAssignments({
      classroom_id: studyClassId.value,
      academic_year_id: yearId.value,
    });
  } else if (isTeacher.value) {
    await teachingStore.fetchMyTeaching(yearId.value);
  }
};

onMounted(async () => {
  const tasks: Promise<any>[] = [
    classroomStore.fetchAcademicYears(),
    scheduleStore.fetchPeriods(),
  ];
  if (isStudent.value) {
    tasks.push(classroomStore.fetchMyClassrooms());
  } else if (isTeachingTab.value) {
    // Teaching board: admins choose from all teachers; a teacher uses their own
    // id, so no list is needed. Admins also need classes + subjects to add a
    // teaching slot inline.
    if (isAdmin.value) {
      tasks.push(
        teacherStore.fetchTeachers(500, 1),
        classroomStore.fetchClassrooms(200),
        subjectStore.fetchSubjects()
      );
    }
  } else {
    // Study board: admins and teachers both pick from the class list.
    tasks.push(classroomStore.fetchClassrooms(200));
  }
  await Promise.all(tasks);

  yearId.value = classroomStore.latestAcademicYearId || null;
  if (isTeachingTab.value) {
    // Teacher is locked to their own schedule; admin defaults to the first teacher.
    teacherId.value = isTeacher.value
      ? idCookie.value || null
      : teacherOptions.value[0]?.id || null;
  } else {
    studyClassId.value = classOptions.value[0]?.id || null;
  }
  await loadGrid();
});

watch([studyClassId, teacherId, yearId], loadGrid);

// Reload cells for this board after any change.
const reloadCells = async () => {
  if (isTeachingTab.value && teacherId.value) {
    await scheduleStore.fetchTeacherSchedule(teacherId.value, yearId.value!);
  } else if (studyClassId.value) {
    await scheduleStore.fetchSchedule(studyClassId.value, yearId.value!);
  }
};

// Show a clear message for a teacher double-booking (409), else the raw error.
const notifyError = (error: any) => {
  const data = error?.response?.data;
  if (data?.code === "TEACHER_CONFLICT") {
    ui.notify(t("teacher-time-conflict", { class: data.classroom || "" }), "error");
  } else {
    ui.notify(data?.message || t("failed-to-save"), "error");
  }
};

const assignCell = async (
  periodId: string,
  day: string,
  assignmentId: string
) => {
  // The target class comes from the chosen assignment (Teaching board) or the
  // picked class (Study board).
  const opt = assignmentOptions.value.find((o) => o.id === assignmentId);
  const classroomId = opt?.classroom_id || studyClassId.value;
  if (!classroomId) return;
  try {
    // On the Teaching board a teacher can't be in two rooms at once: if this
    // slot already holds a different class, clear it first before assigning.
    if (isTeachingTab.value) {
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
    notifyError(error);
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

// --- Inline "add teaching time" (admin, teaching board) ---
// Open the dialog for a slot, pre-filling from an existing cell if there is one.
const openAdd = (periodId: string, day: string) => {
  addPeriodId.value = periodId;
  addDay.value = day;
  const existing = cellFor(periodId, day);
  addClassId.value = existing?.classroom_id || null;
  addSubjectId.value = existing?.assignment?.subject_id || null;
  addDialog.value = true;
};

// Create the teaching assignment (teacher + subject + class + year) if needed,
// then schedule it in the chosen slot.
const addTeachingTime = async () => {
  if (
    !teacherId.value ||
    !addClassId.value ||
    !addSubjectId.value ||
    !addPeriodId.value ||
    !addDay.value ||
    !yearId.value
  )
    return;
  adding.value = true;
  try {
    // create-teaching-assignment is idempotent per (subject, class, year): it
    // reuses the row if it exists, so this never creates duplicates.
    const res = await teachingStore.createAssignment({
      teacher_id: teacherId.value,
      subject_id: addSubjectId.value,
      classroom_id: addClassId.value,
      academic_year_id: yearId.value,
    });
    const assignmentId = res?.data?.id;
    if (!assignmentId) throw new Error("no assignment id");

    // A teacher can't be in two rooms at once: clear a different class already
    // holding this slot before assigning the new one.
    const existing = cellFor(addPeriodId.value, addDay.value);
    if (existing && existing.classroom_id !== addClassId.value) {
      await scheduleStore.deleteCell(existing.id);
    }
    await scheduleStore.saveCell({
      classroom_id: addClassId.value,
      academic_year_id: yearId.value,
      period_id: addPeriodId.value,
      day_of_week: addDay.value,
      teaching_assignment_id: assignmentId,
    });
    // Refresh the teacher's assignments (so the new one is known) and the grid.
    await teachingStore.fetchAssignments({
      teacher_id: teacherId.value,
      academic_year_id: yearId.value,
    });
    await reloadCells();
    addDialog.value = false;
  } catch (error: any) {
    notifyError(error);
  } finally {
    adding.value = false;
  }
};

// Clear the slot the dialog is editing.
const clearFromDialog = async () => {
  if (!addPeriodId.value || !addDay.value) return;
  const existing = cellFor(addPeriodId.value, addDay.value);
  if (existing) await clearCell(existing);
  addDialog.value = false;
};

// ---- Export / print the current timetable ----
const exporting = ref(false);

// Labels used in filenames and document titles.
const scopeLabel = computed(() =>
  isTeachingTab.value
    ? currentTeacherLabel.value
    : classOptions.value.find((c) => c.id === studyClassId.value)?.label || ""
);
const yearLabel = computed(
  () =>
    (classroomStore.academicYears.find((y: any) => y.id === yearId.value) || {})
      .title || ""
);
const docTitle = computed(() =>
  [headerTitle.value, scopeLabel.value, yearLabel.value]
    .filter(Boolean)
    .join(" · ")
);
const fileBase = () =>
  [headerTitle.value, scopeLabel.value, yearLabel.value]
    .filter(Boolean)
    .join("_")
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "_") || "timetable";

// The grid as plain data: one row per period, one entry per day.
const gridData = () =>
  scheduleStore.periods.map((p: any) => ({
    period: p.period_name || p.period_code || "",
    cells: days.map((d) => {
      const c = cellFor(p.id, d.key);
      return c
        ? { subject: subjectOf(c), secondary: secondaryOf(c) }
        : { subject: "", secondary: "" };
    }),
  }));

const esc = (s: any) =>
  String(s ?? "").replace(
    /[&<>]/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[ch] || ch
  );

// Self-contained HTML for the timetable (styles inlined) — used for print and
// for the off-screen node the image/PDF are rasterised from.
const TT_CSS = `
  .tt-wrap{font-family:'Noto Sans Lao','Phetsarath OT',system-ui,-apple-system,sans-serif;color:#0f172a;background:#fff;padding:16px}
  .tt-wrap h2{font-size:16px;margin:0 0 12px}
  table.tt{border-collapse:collapse;width:100%;min-width:680px;table-layout:fixed}
  table.tt th,table.tt td{border:1px solid #cbd5e1;padding:6px 8px;text-align:center;vertical-align:middle;font-size:12px}
  table.tt th{background:#eef2ff;color:#3730a3;font-weight:800;text-transform:uppercase;letter-spacing:.03em}
  table.tt td.pcol{background:#f8fafc;font-weight:700;width:92px}
  table.tt .s{font-weight:800;color:#0f766e;line-height:1.15}
  table.tt .t{font-size:10.5px;color:#64748b;line-height:1.1}
  @media print{@page{size:landscape;margin:12mm}}
`;

const buildTableHtml = () => {
  const header = `<tr><th class="pcol">${esc(t("period"))}</th>${days
    .map((d) => `<th>${esc(t(d.key))}</th>`)
    .join("")}</tr>`;
  const body = gridData()
    .map(
      (r) =>
        `<tr><td class="pcol">${esc(r.period)}</td>${r.cells
          .map((c) =>
            c.subject
              ? `<td><div class="s">${esc(c.subject)}</div>${
                  c.secondary ? `<div class="t">${esc(c.secondary)}</div>` : ""
                }</td>`
              : `<td>—</td>`
          )
          .join("")}</tr>`
    )
    .join("");
  return `<div class="tt-wrap"><h2>${esc(
    docTitle.value
  )}</h2><table class="tt"><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
};

// Build an off-screen node with the timetable, hand it to `fn`, then remove it.
const withOffscreen = async (fn: (node: HTMLElement) => Promise<void>) => {
  const style = document.createElement("style");
  style.textContent = TT_CSS;
  const holder = document.createElement("div");
  holder.style.position = "fixed";
  holder.style.left = "-10000px";
  holder.style.top = "0";
  holder.style.width = "1024px";
  holder.appendChild(style);
  const content = document.createElement("div");
  content.innerHTML = buildTableHtml();
  holder.appendChild(content);
  document.body.appendChild(holder);
  try {
    await fn(content);
  } finally {
    document.body.removeChild(holder);
  }
};

const exportExcel = async () => {
  exporting.value = true;
  try {
    const XLSX = await import("xlsx");
    const header = [t("period"), ...days.map((d) => t(d.key))];
    const rows = gridData().map((r) => [
      r.period,
      ...r.cells.map((c) =>
        c.subject
          ? c.secondary
            ? `${c.subject}\n${c.secondary}`
            : c.subject
          : ""
      ),
    ]);
    const ws = XLSX.utils.aoa_to_sheet([[docTitle.value], [], header, ...rows]);
    ws["!cols"] = header.map((_, i) => ({ wch: i === 0 ? 14 : 22 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timetable");
    XLSX.writeFile(wb, `${fileBase()}.xlsx`);
  } catch (e: any) {
    ui.notify(e?.message || t("failed-to-save"), "error");
  } finally {
    exporting.value = false;
  }
};

const exportImage = async () => {
  exporting.value = true;
  try {
    const html2canvas = (await import("html2canvas")).default;
    await withOffscreen(async (node) => {
      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `${fileBase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  } catch (e: any) {
    ui.notify(e?.message || t("failed-to-save"), "error");
  } finally {
    exporting.value = false;
  }
};

const exportPdf = async () => {
  exporting.value = true;
  try {
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    await withOffscreen(async (node) => {
      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const margin = 24;
      const pw = pdf.internal.pageSize.getWidth() - margin * 2;
      const ph = pdf.internal.pageSize.getHeight() - margin * 2;
      let iw = pw;
      let ih = (canvas.height / canvas.width) * iw;
      if (ih > ph) {
        ih = ph;
        iw = (canvas.width / canvas.height) * ih;
      }
      pdf.addImage(img, "PNG", margin, margin, iw, ih);
      pdf.save(`${fileBase()}.pdf`);
    });
  } catch (e: any) {
    ui.notify(e?.message || t("failed-to-save"), "error");
  } finally {
    exporting.value = false;
  }
};

const printTimetable = () => {
  const w = window.open("", "_blank", "width=1000,height=700");
  if (!w) return;
  w.document.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>${esc(
      docTitle.value
    )}</title><style>${TT_CSS}</style></head><body>${buildTableHtml()}</body></html>`
  );
  w.document.close();
  w.focus();
  // Give the new window a tick to lay out (and load fonts) before printing.
  setTimeout(() => {
    w.print();
  }, 350);
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
