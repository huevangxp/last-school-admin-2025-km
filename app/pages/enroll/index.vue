<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <div class="mb-6">
      <div class="text-title mb-1">{{ t("enroll") }} {{ t("students") }}</div>
      <div class="text-detail">
        Assign students to a class for an academic year.
      </div>
    </div>

    <v-row>
      <!-- Target class + year -->
      <v-col cols="12" md="5">
        <v-card elevation="0" class="intelligence-card pa-6">
          <div class="d-flex align-center mb-4">
            <v-avatar color="teal-lighten-5" size="36" class="mr-3 rounded-lg">
              <v-icon color="teal-darken-2" size="18"
                >mdi-google-classroom</v-icon
              >
            </v-avatar>
            <h3 class="text-title">{{ t("classes") }}</h3>
          </div>

          <label class="text-detail-tiny mb-2 d-block">ACADEMIC YEAR</label>
          <v-select
            v-model="yearId"
            :items="classroomStore.academicYears"
            item-title="title"
            item-value="id"
            placeholder="Select academic year"
            variant="outlined"
            density="compact"
            rounded="lg"
            class="premium-input mb-4"
            hide-details
          ></v-select>

          <label class="text-detail-tiny mb-2 d-block">CLASS</label>
          <v-select
            v-model="classId"
            :items="classroomStore.classrooms"
            :item-title="classLabel"
            item-value="id"
            placeholder="Select class"
            variant="outlined"
            density="compact"
            rounded="lg"
            class="premium-input"
            hide-details
          ></v-select>

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
            :loading="enrolling"
            :disabled="!canEnroll"
            @click="enroll"
          >
            <v-icon icon="mdi-account-plus" start></v-icon>
            {{ t("enroll") }} ({{ selected.length }})
          </v-btn>
        </v-card>
      </v-col>

      <!-- Students -->
      <v-col cols="12" md="7">
        <v-card elevation="0" class="intelligence-card pa-6">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-title">
              {{ t("students") }} ({{ availableStudents.length }})
            </h3>
            <v-btn
              v-if="availableStudents.length"
              variant="text"
              size="small"
              color="primary"
              @click="toggleAll"
            >
              {{
                selected.length === availableStudents.length
                  ? "Clear all"
                  : "Select all"
              }}
            </v-btn>
          </div>

          <div
            v-if="!studentStore.students.length"
            class="text-detail py-8 text-center"
          >
            No students found. Create students first.
          </div>
          <div
            v-else-if="!availableStudents.length"
            class="text-detail py-8 text-center"
          >
            All students are already enrolled for this year.
          </div>

          <v-list v-else class="pa-0">
            <v-list-item
              v-for="s in availableStudents"
              :key="s.id"
              class="px-2 mb-1 rounded-lg source-student"
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

const yearId = ref<string | null>(null);
const classId = ref<string | null>(null);
const selected = ref<string[]>([]);
const enrolling = ref(false);
const message = ref("");
const messageType = ref<"success" | "error">("success");
const enrolledIds = ref<string[]>([]);

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("enroll"), disabled: true, to: "/enroll" },
];

onMounted(() => {
  classroomStore.fetchClassrooms(100);
  classroomStore.fetchAcademicYears();
  studentStore.fetchStudents();
});

const classLabel = (c: any) =>
  `${c.classroom_name}${c.gradeLevel?.grade_level_name ? " · " + c.gradeLevel.grade_level_name : ""}`;

// When the year changes, load who is already enrolled so we can hide them.
const loadEnrolled = async () => {
  enrolledIds.value = [];
  selected.value = [];
  if (!yearId.value) return;
  await enrollmentStore.fetchEnrollments({ academic_year_id: yearId.value });
  enrolledIds.value = enrollmentStore.enrollments.map((e) => e.student_id);
};
watch(yearId, loadEnrolled);

// Students not yet enrolled for the selected year.
const availableStudents = computed(() => {
  if (!yearId.value) return [];
  return studentStore.students
    .filter((s) => !enrolledIds.value.includes(String(s.id)))
    .map((s) => ({
      id: String(s.id ?? ""),
      student_id: String(s.student_id ?? ""),
      first_name: String(s.first_name ?? ""),
      last_name: String(s.last_name ?? ""),
      avatar:
        (s.avatar as string) ||
        `https://i.pravatar.cc/100?u=${encodeURIComponent(
          String(s.student_id ?? s.id)
        )}`,
    }));
});

const canEnroll = computed(
  () => selected.value.length > 0 && !!classId.value && !!yearId.value
);

const toggle = (id: string) => {
  const i = selected.value.indexOf(id);
  if (i === -1) selected.value.push(id);
  else selected.value.splice(i, 1);
};

const toggleAll = () => {
  selected.value =
    selected.value.length === availableStudents.value.length
      ? []
      : availableStudents.value.map((s) => s.id);
};

const enroll = async () => {
  message.value = "";
  enrolling.value = true;
  try {
    const results = await Promise.allSettled(
      selected.value.map((sid) =>
        enrollmentStore.enroll({
          student_id: sid,
          class_id: classId.value as string,
          academic_year_id: yearId.value as string,
        })
      )
    );
    const ok = results.filter((r) => r.status === "fulfilled").length;
    messageType.value = "success";
    message.value = `Enrolled ${ok} student(s) successfully.`;
    selected.value = [];
    await loadEnrolled();
    await studentStore.fetchStudents();
  } catch (error: any) {
    messageType.value = "error";
    message.value = error.response?.data?.message || "Failed to enroll.";
  } finally {
    enrolling.value = false;
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}
.intelligence-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
}
.modern-action-btn {
  border-radius: 8px !important;
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
