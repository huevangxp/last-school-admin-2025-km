<template>
  <div class="page">
    <PageHeader
      :title="t('promotion')"
      :subtitle="t('promotion-subtitle')"
      icon="mdi-arrow-up-bold-box-outline"
      :breadcrumbs="breadcrumbs"
    />

    <v-row>
      <!-- Steps: source -> target -->
      <v-col cols="12" md="5" lg="4">
        <!-- Step 1: source -->
        <v-card elevation="0" class="panel fade-in mb-4">
          <div class="step-head">
            <span class="step-badge">1</span>
            <div class="min-w-0">
              <div class="panel-title">{{ t("from") }}</div>
              <div class="panel-sub">{{ t("source-class") }}</div>
            </div>
            <v-icon class="ml-auto" color="primary" size="20">
              mdi-account-group-outline
            </v-icon>
          </div>

          <label class="field-label">{{ t("source-academic-year") }}</label>
          <v-select
            v-model="sourceYearId"
            :items="classroomStore.academicYears"
            item-title="title"
            item-value="id"
            variant="outlined"
            density="comfortable"
            hide-details
            color="primary"
            class="mb-4"
            prepend-inner-icon="mdi-calendar-arrow-left"
          ></v-select>

          <label class="field-label">{{ t("source-class") }}</label>
          <v-select
            v-model="sourceClassId"
            :items="sourceClassOptions"
            :item-title="classLabel"
            item-value="id"
            :placeholder="t('select-current-class')"
            variant="outlined"
            density="comfortable"
            hide-details
            color="primary"
            prepend-inner-icon="mdi-google-classroom"
          ></v-select>
        </v-card>

        <!-- Step 2: target -->
        <v-card elevation="0" class="panel fade-in">
          <div class="step-head">
            <span class="step-badge step-badge--teal">2</span>
            <div class="min-w-0">
              <div class="panel-title">{{ t("to") }}</div>
              <div class="panel-sub">{{ t("target-class") }}</div>
            </div>
            <v-icon class="ml-auto" color="primary" size="20">
              mdi-arrow-up-bold-box-outline
            </v-icon>
          </div>

          <label class="field-label">{{ t("target-academic-year") }}</label>
          <v-select
            v-model="targetYearId"
            :items="classroomStore.academicYears"
            item-title="title"
            item-value="id"
            variant="outlined"
            density="comfortable"
            hide-details
            color="primary"
            class="mb-4"
            prepend-inner-icon="mdi-calendar-check"
          ></v-select>

          <label class="field-label">{{ t("target-class") }}</label>
          <v-select
            v-model="targetClassId"
            :items="targetClassOptions"
            :item-title="classLabel"
            item-value="id"
            :placeholder="
              sourceClassId ? t('select-next-class') : t('select-source-first')
            "
            :disabled="!sourceClassId"
            variant="outlined"
            density="comfortable"
            hide-details
            color="primary"
            prepend-inner-icon="mdi-google-classroom"
          ></v-select>
          <div class="field-hint d-flex align-center mt-2">
            <v-icon size="14" class="mr-1">mdi-information-outline</v-icon>
            {{ t("higher-grade-only") }}
          </div>

          <v-alert
            v-if="message"
            :type="messageType"
            variant="tonal"
            density="compact"
            rounded="lg"
            class="mt-4"
          >
            {{ message }}
          </v-alert>

          <v-btn
            block
            variant="flat"
            class="modern-action-btn primary mt-5"
            :loading="promoting"
            :disabled="!canPromote"
            @click="promote"
          >
            <v-icon icon="mdi-arrow-up-bold" start size="18"></v-icon>
            {{ t("promote") }} ({{ selected.length }})
          </v-btn>
        </v-card>
      </v-col>

      <!-- Students in source class -->
      <v-col cols="12" md="7" lg="8">
        <v-card elevation="0" class="panel panel--flush fade-in h-100">
          <div class="panel-head">
            <div class="min-w-0">
              <div class="panel-title">{{ t("students") }}</div>
              <div class="panel-sub">{{ t("select-all-passed") }}</div>
            </div>
            <div class="d-flex align-center ga-2 flex-wrap justify-end">
              <span class="panel-chip panel-chip--teal">
                {{ selected.length }} / {{ sourceStudents.length }}
              </span>
              <v-btn
                v-if="sourceStudents.length"
                variant="text"
                size="small"
                color="primary"
                class="font-weight-bold"
                @click="toggleAll"
              >
                {{
                  selected.length === sourceStudents.length
                    ? t("clear-all")
                    : t("select-all-passed")
                }}
              </v-btn>
            </div>
          </div>

          <div class="pa-4 pa-md-5">
            <EmptyState
              v-if="!sourceClassId"
              icon="mdi-google-classroom"
              :title="t('select-source-class-hint')"
            />
            <div v-else-if="enrollmentStore.loading" class="empty-state">
              <v-progress-circular
                indeterminate
                size="24"
                width="2"
                color="primary"
              ></v-progress-circular>
              <span>{{ t("loading") }}</span>
            </div>
            <EmptyState
              v-else-if="!sourceStudents.length"
              icon="mdi-account-off-outline"
              :title="t('no-students-in-class')"
            />

            <div v-else class="student-list">
              <div
                v-for="s in sourceStudents"
                :key="s.id"
                class="student-row"
                :class="{ 'student-row--selected': selected.includes(s.id) }"
                role="button"
                tabindex="0"
                @click="toggle(s.id)"
                @keydown.enter.prevent="toggle(s.id)"
                @keydown.space.prevent="toggle(s.id)"
              >
                <v-checkbox-btn
                  :model-value="selected.includes(s.id)"
                  color="primary"
                  density="compact"
                  class="flex-grow-0"
                  @click.stop="toggle(s.id)"
                ></v-checkbox-btn>
                <div class="avatar-chip">
                  <v-img v-if="s.avatar" :src="s.avatar" cover alt=""></v-img>
                  <template v-else>
                    {{ (s.first_name || "?").charAt(0) }}
                  </template>
                </div>
                <div class="flex-grow-1 min-w-0">
                  <div class="cell-title text-truncate">
                    {{ s.first_name }} {{ s.last_name }}
                  </div>
                  <div class="cell-sub">{{ s.student_id }}</div>
                </div>
                <v-icon
                  v-if="selected.includes(s.id)"
                  size="18"
                  color="primary"
                  class="flex-shrink-0"
                >
                  mdi-check-circle
                </v-icon>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useClassroomStore } from "~/stores/apiClassroom";
import { useEnrollmentStore } from "~/stores/apiEnrollment";

const { t } = useI18n();
const { mediaUrl } = useMedia();
const classroomStore = useClassroomStore();
const enrollmentStore = useEnrollmentStore();

const sourceYearId = ref<string | null>(null);
const sourceClassId = ref<string | null>(null);
const targetYearId = ref<string | null>(null);
const targetClassId = ref<string | null>(null);
const selected = ref<string[]>([]);
const promoting = ref(false);
const message = ref("");
const messageType = ref<"success" | "error">("success");

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("promotion"), disabled: true, to: "/promotion" },
];

onMounted(async () => {
  await Promise.all([
    classroomStore.fetchClassrooms(300),
    classroomStore.fetchAcademicYears(),
    classroomStore.fetchGradeLevels(),
  ]);
  // Target defaults to the latest (current) year; source to the previous one.
  targetYearId.value = classroomStore.latestAcademicYearId;
  sourceYearId.value = previousYearId.value;
});

const classLabel = (c: any) =>
  `${c.classroom_name}${
    c.gradeLevel?.grade_level_name ? " · " + c.gradeLevel.grade_level_name : ""
  }`;

// Grade ordering comes from the grade-level list order (ປ.1 … ມ.7), so a higher
// index = a higher grade. Used to enforce "promote only to a higher grade".
const gradeOrder = computed<Record<string, number>>(() => {
  const map: Record<string, number> = {};
  classroomStore.gradeLevels.forEach((g: any, i: number) => (map[g.id] = i));
  return map;
});
const gradeIndexOf = (classId: string | null) => {
  const c = classroomStore.classrooms.find((x: any) => x.id === classId);
  return c ? gradeOrder.value[c.grade_level_id] ?? -1 : -1;
};

// Years sorted newest-first, so we can offer the previous year as the source.
const sortedYears = computed(() =>
  [...classroomStore.academicYears].sort(
    (a: any, b: any) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  )
);
const previousYearId = computed(() => {
  const latest = classroomStore.latestAcademicYearId;
  const others = sortedYears.value.filter((y: any) => y.id !== latest);
  return others[0]?.id || latest;
});

// Classrooms belonging to a given academic year.
const classroomsInYear = (yearId: string | null) =>
  classroomStore.classrooms.filter((c: any) => c.academic_year_id === yearId);

const sourceClassOptions = computed(() => classroomsInYear(sourceYearId.value));

// Target classes: those in the target year whose grade is strictly higher than
// the source class's grade (ມ3 → only ມ4 and up).
const targetClassOptions = computed(() => {
  const all = classroomsInYear(targetYearId.value);
  const srcIdx = gradeIndexOf(sourceClassId.value);
  if (srcIdx < 0) return all;
  return all.filter(
    (c: any) => (gradeOrder.value[c.grade_level_id] ?? -1) > srcIdx
  );
});

interface DisplayStudent {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

// Students enrolled in the chosen source class for the source year — this is
// the class roster as it was that year (from the enrollment history), not the
// students' current class.
const sourceStudents = computed<DisplayStudent[]>(() =>
  enrollmentStore.enrollments
    .map((e: any) => e.tb_student)
    .filter(Boolean)
    .map((s: any) => {
      const id = String(s.id ?? "");
      return {
        id,
        student_id: String(s.student_id ?? ""),
        first_name: String(s.first_name ?? ""),
        last_name: String(s.last_name ?? ""),
        avatar: s.avatar ? mediaUrl(s.avatar as string) : "",
      };
    })
);

const canPromote = computed(
  () =>
    selected.value.length > 0 &&
    !!targetClassId.value &&
    !!targetYearId.value &&
    targetYearId.value !== sourceYearId.value // must promote into a new year
);

// Load the source class roster for the chosen (class, year).
const reloadSource = async () => {
  selected.value = [];
  message.value = "";
  enrollmentStore.enrollments = [];
  if (!sourceClassId.value || !sourceYearId.value) return;
  await enrollmentStore.fetchEnrollments({
    class_id: sourceClassId.value,
    academic_year_id: sourceYearId.value,
    status: "active",
  });
};

watch([sourceClassId, sourceYearId], reloadSource);

// Changing the source year invalidates the picked source class.
watch(sourceYearId, () => {
  sourceClassId.value = null;
});

// If the current target class is no longer a valid (higher-grade) option, drop it.
watch([sourceClassId, targetYearId, targetClassOptions], () => {
  if (
    targetClassId.value &&
    !targetClassOptions.value.some((c: any) => c.id === targetClassId.value)
  ) {
    targetClassId.value = null;
  }
});

const toggle = (id: string) => {
  const i = selected.value.indexOf(id);
  if (i === -1) selected.value.push(id);
  else selected.value.splice(i, 1);
};

const toggleAll = () => {
  selected.value =
    selected.value.length === sourceStudents.value.length
      ? []
      : sourceStudents.value.map((s) => s.id);
};

const promote = async () => {
  message.value = "";
  promoting.value = true;
  try {
    const res = await enrollmentStore.promote({
      student_ids: selected.value,
      to_class_id: targetClassId.value as string,
      academic_year_id: targetYearId.value as string,
    });
    messageType.value = "success";
    message.value = res?.message || t("promoted-successfully");
    selected.value = [];
    // The source-year roster is unchanged (kept as history); nothing to refetch.
  } catch (error: any) {
    messageType.value = "error";
    message.value =
      error.response?.data?.message || t("failed-to-promote-students");
  } finally {
    promoting.value = false;
  }
};
</script>

<style scoped>
/* Step header: numbered badge + title */
.step-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.step-badge {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, var(--ds-navy) 0%, var(--ds-navy-2) 100%);
}
.step-badge--teal {
  color: var(--ds-navy);
  background: var(--ds-teal);
}

/* Selectable roster rows */
.student-list {
  display: grid;
  gap: 8px;
}
.student-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px 8px 6px;
  border: 1px solid var(--ds-border);
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.student-row:hover {
  background: #f8fafc;
  border-color: #c7d0db;
}
.student-row:focus-visible {
  outline: 2px solid var(--ds-teal);
  outline-offset: 1px;
}
.student-row--selected {
  background: #f0fdfa;
  border-color: var(--ds-teal);
}
@media (min-width: 960px) {
  .student-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
