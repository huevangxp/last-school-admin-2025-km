<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <div class="mb-6">
      <div class="text-title mb-1">{{ t("promotion") }}</div>
      <div class="text-detail">
        {{ t("promotion-subtitle") }}
      </div>
    </div>

    <v-row>
      <!-- Source -->
      <v-col cols="12" md="5">
        <v-card elevation="0" class="intelligence-card pa-6 mb-4">
          <div class="d-flex align-center mb-4">
            <v-avatar color="blue-lighten-5" size="36" class="mr-3 rounded-0">
              <v-icon color="blue-darken-2" size="18"
                >mdi-account-group-outline</v-icon
              >
            </v-avatar>
            <h3 class="text-title">1. {{ t("from") }}</h3>
          </div>

          <label class="text-detail-tiny mb-2 d-block">{{
            t("source-academic-year")
          }}</label>
          <v-select
            v-model="sourceYearId"
            :items="classroomStore.academicYears"
            item-title="title"
            item-value="id"
            variant="outlined"
            density="compact"
            rounded="0"
            hide-details
            class="mb-4"
            prepend-inner-icon="mdi-calendar-arrow-left"
          ></v-select>

          <label class="text-detail-tiny mb-2 d-block">{{
            t("source-class")
          }}</label>
          <v-select
            v-model="sourceClassId"
            :items="sourceClassOptions"
            :item-title="classLabel"
            item-value="id"
            :placeholder="t('select-current-class')"
            variant="outlined"
            density="compact"
            rounded="0"
            hide-details
            prepend-inner-icon="mdi-google-classroom"
          ></v-select>
        </v-card>

        <!-- Target -->
        <v-card elevation="0" class="intelligence-card pa-6">
          <div class="d-flex align-center mb-4">
            <v-avatar color="teal-lighten-5" size="36" class="mr-3 rounded-0">
              <v-icon color="teal-darken-2" size="18"
                >mdi-arrow-up-bold-box-outline</v-icon
              >
            </v-avatar>
            <h3 class="text-title">2. {{ t("to") }}</h3>
          </div>

          <label class="text-detail-tiny mb-2 d-block">{{
            t("target-academic-year")
          }}</label>
          <v-select
            v-model="targetYearId"
            :items="classroomStore.academicYears"
            item-title="title"
            item-value="id"
            variant="outlined"
            density="compact"
            rounded="0"
            hide-details
            class="mb-4"
            prepend-inner-icon="mdi-calendar-check"
          ></v-select>

          <label class="text-detail-tiny mb-2 d-block">{{
            t("target-class")
          }}</label>
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
            density="compact"
            rounded="0"
            hide-details
            prepend-inner-icon="mdi-google-classroom"
          ></v-select>
          <div class="text-detail-tiny text-grey mt-2">
            <v-icon size="13" class="mr-1">mdi-information-outline</v-icon>
            {{ t("higher-grade-only") }}
          </div>

          <v-alert
            v-if="message"
            :type="messageType"
            variant="tonal"
            density="compact"
            class="mt-4"
            >{{ message }}</v-alert
          >

          <v-btn
            block
            color="primary"
            class="modern-action-btn primary elevation-4 mt-5"
            height="44"
            :loading="promoting"
            :disabled="!canPromote"
            @click="promote"
          >
            <v-icon icon="mdi-arrow-up-bold" start></v-icon>
            {{ t("promote") }} ({{ selected.length }})
          </v-btn>
        </v-card>
      </v-col>

      <!-- Students in source class -->
      <v-col cols="12" md="7">
        <v-card elevation="0" class="intelligence-card pa-6">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-title">
              {{ t("students") }} ({{ sourceStudents.length }})
            </h3>
            <v-btn
              variant="text"
              size="small"
              color="primary"
              @click="toggleAll"
              v-if="sourceStudents.length"
            >
              {{
                selected.length === sourceStudents.length
                  ? t("clear-all")
                  : t("select-all-passed")
              }}
            </v-btn>
          </div>

          <div v-if="!sourceClassId" class="text-detail py-8 text-center">
            {{ t("select-source-class-hint") }}
          </div>
          <div
            v-else-if="enrollmentStore.loading"
            class="py-8 text-center"
          >
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <div
            v-else-if="!sourceStudents.length"
            class="text-detail py-8 text-center"
          >
            {{ t("no-students-in-class") }}
          </div>

          <v-list v-else class="pa-0">
            <v-list-item
              v-for="s in sourceStudents"
              :key="s.id"
              class="px-2 mb-1 rounded-0 source-student"
              @click="toggle(s.id)"
            >
              <template v-slot:prepend>
                <v-checkbox-btn
                  :model-value="selected.includes(s.id)"
                  color="primary"
                  @click.stop="toggle(s.id)"
                ></v-checkbox-btn>
                <v-avatar size="34" class="mr-3">
                  <v-img :src="s.avatar" cover></v-img>
                </v-avatar>
              </template>
              <v-list-item-title class="text-title-small">
                {{ s.first_name }} {{ s.last_name }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-detail-tiny">
                {{ s.student_id }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useClassroomStore } from "~/stores/apiClassroom";
import { useEnrollmentStore } from "~/stores/apiEnrollment";

const { t } = useI18n();
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
        avatar:
          (s.avatar as string) ||
          `https://i.pravatar.cc/100?u=${encodeURIComponent(
            String(s.student_id ?? id)
          )}`,
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
  font-size: 13px !important;
}
.modern-action-btn.primary {
  background: linear-gradient(135deg, #0a3154 0%, #082741 100%) !important;
  color: white !important;
}
.source-student {
  border: 1px solid #f1f5f9;
}
.source-student:hover {
  background-color: #f8fafc;
}
</style>
