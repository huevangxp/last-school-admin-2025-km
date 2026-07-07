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

          <label class="text-detail-tiny mb-2 d-block">{{ t("source-class") }}</label>
          <v-select
            v-model="sourceClassId"
            :items="classroomStore.classrooms"
            :item-title="classLabel"
            item-value="id"
            :placeholder="t('select-current-class')"
            variant="outlined"
            density="compact"
            rounded="0"
            class="premium-input"
            hide-details
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

          <label class="text-detail-tiny mb-2 d-block">{{ t("target-class") }}</label>
          <v-select
            v-model="targetClassId"
            :items="targetClassOptions"
            :item-title="classLabel"
            item-value="id"
            :placeholder="t('select-next-class')"
            variant="outlined"
            density="compact"
            rounded="0"
            class="premium-input mb-4"
            hide-details
          ></v-select>

          <label class="text-detail-tiny mb-2 d-block">{{ t("target-academic-year") }}</label>
          <v-text-field
            :model-value="classroomStore.latestAcademicYear?.title || '—'"
            readonly
            variant="outlined"
            density="compact"
            rounded="0"
            class="premium-input"
            hide-details
            prepend-inner-icon="mdi-calendar-check"
          ></v-text-field>

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
                  ? "Clear all"
                  : "Select all (passed)"
              }}
            </v-btn>
          </div>

          <div v-if="!sourceClassId" class="text-detail py-8 text-center">
            Select a source class to list its students.
          </div>
          <div
            v-else-if="!sourceStudents.length"
            class="text-detail py-8 text-center"
          >
            No students in this class.
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
import { useStudentStore } from "~/stores/apiStudent";
import { useEnrollmentStore } from "~/stores/apiEnrollment";

const { t } = useI18n();
const classroomStore = useClassroomStore();
const studentStore = useStudentStore();
const enrollmentStore = useEnrollmentStore();

const sourceClassId = ref<string | null>(null);
const targetClassId = ref<string | null>(null);
const targetYearId = ref<string | null>(null);
const selected = ref<string[]>([]);
const promoting = ref(false);
const message = ref("");
const messageType = ref<"success" | "error">("success");

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("promotion"), disabled: true, to: "/promotion" },
];

onMounted(async () => {
  classroomStore.fetchClassrooms(100);
  studentStore.fetchStudents();
  // Load academic years and default the target to the latest (current) one.
  await classroomStore.fetchAcademicYears();
  targetYearId.value = classroomStore.latestAcademicYearId;
});

const classLabel = (c: any) =>
  `${c.classroom_name}${c.gradeLevel?.grade_level_name ? " · " + c.gradeLevel.grade_level_name : ""}`;

interface DisplayStudent {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

// Students currently in the selected source class (mapped to a typed shape).
const sourceStudents = computed<DisplayStudent[]>(() => {
  if (!sourceClassId.value) return [];
  return studentStore.students
    .filter((s) => s.class_id === sourceClassId.value)
    .map((s) => {
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
    });
});

// Don't allow promoting into the same class.
const targetClassOptions = computed(() =>
  classroomStore.classrooms.filter((c) => c.id !== sourceClassId.value)
);

const canPromote = computed(
  () =>
    selected.value.length > 0 && !!targetClassId.value && !!targetYearId.value
);

watch(sourceClassId, () => {
  selected.value = [];
  message.value = "";
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
    message.value = res?.message || "Promoted successfully.";
    selected.value = [];
    await studentStore.fetchStudents(); // refresh class assignments
  } catch (error: any) {
    messageType.value = "error";
    message.value =
      error.response?.data?.message || "Failed to promote students.";
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
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
}
.source-student {
  border: 1px solid #f1f5f9;
}
.source-student:hover {
  background-color: #f8fafc;
}
.premium-input :deep(.v-field__outline__start),
.premium-input :deep(.v-field__outline__end),
.premium-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}
</style>
