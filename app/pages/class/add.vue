<template>
  <div class="page page--narrow">
    <PageHeader
      :title="t('register-section')"
      :subtitle="t('configure-class-desc')"
      icon="mdi-google-classroom"
      :breadcrumbs="breadcrumbs"
      back="/class"
    />

    <v-card elevation="0" class="panel fade-in">
      <v-form ref="formRef" @submit.prevent="save">
        <!-- Class information -->
        <div class="form-section">
          <v-icon size="16">mdi-google-classroom</v-icon>
          {{ t("class") }} {{ t("information") }}
        </div>

        <v-row dense>
          <!-- Class Name -->
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("class-name") }} *</label>
            <v-text-field
              v-model="form.className"
              placeholder="e.g. M1/A"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <!-- Class Code -->
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("class-code") }} *</label>
            <v-text-field
              v-model="form.code"
              placeholder="e.g. M1A-2025"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <!-- Grade Level -->
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("grade-level") }} *</label>
            <v-select
              v-model="form.gradeLevelId"
              :items="classroomStore.gradeLevels"
              item-title="grade_level_name"
              item-value="id"
              :placeholder="t('select-grade-level')"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <!-- Academic Year (auto: latest / current) -->
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("academic-year") }} *</label>
            <v-text-field
              :model-value="classroomStore.latestAcademicYear?.title || '—'"
              readonly
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              prepend-inner-icon="mdi-calendar-check"
              class="readonly-field"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Homeroom & room details -->
        <div class="form-section mt-6">
          <v-icon size="16">mdi-account-tie</v-icon>
          {{ t("details") }}
        </div>

        <v-row dense>
          <!-- Homeroom Teacher (required) -->
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("homeroom_teacher") }} *</label>
            <v-select
              v-model="form.homeroomTeacherId"
              :items="teacherStore.teachers"
              item-title="full_name"
              item-value="id"
              :placeholder="t('select-homeroom-teacher')"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              prepend-inner-icon="mdi-account-outline"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <!-- Room -->
          <v-col cols="6" md="3">
            <label class="field-label">{{ t("room_number") }}</label>
            <v-text-field
              v-model="form.room"
              placeholder="e.g. 101"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              prepend-inner-icon="mdi-door-open"
            ></v-text-field>
          </v-col>

          <!-- Max students -->
          <v-col cols="6" md="3">
            <label class="field-label">{{ t("max_students") }}</label>
            <v-text-field
              v-model="form.maxStudent"
              type="number"
              placeholder="e.g. 40"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              prepend-inner-icon="mdi-account-group-outline"
            ></v-text-field>
          </v-col>

          <v-col v-if="errorMessage" cols="12">
            <v-alert type="error" variant="tonal" density="compact" rounded="lg">
              {{ errorMessage }}
            </v-alert>
          </v-col>
        </v-row>

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn secondary"
            @click="$router.push('/class')"
          >
            {{ t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            type="submit"
            prepend-icon="mdi-check"
            :loading="loading"
          >
            {{ t("register-class") }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useClassroomStore } from "~/stores/apiClassroom";
import { useTeacherStore } from "~/stores/apiTeacher";

const { t } = useI18n();
const router = useRouter();
const classroomStore = useClassroomStore();
const teacherStore = useTeacherStore();
const loading = ref(false);
const errorMessage = ref("");
const formRef = ref();

const form = ref<{
  className: string;
  code: string;
  gradeLevelId: string | null;
  academicYearId: string | null;
  homeroomTeacherId: string | null;
  room: string;
  maxStudent: string;
}>({
  className: "",
  code: "",
  gradeLevelId: null,
  academicYearId: null,
  homeroomTeacherId: null,
  room: "",
  maxStudent: "",
});

onMounted(async () => {
  classroomStore.fetchGradeLevels();
  teacherStore.fetchTeachers(100, 1);
  // Load academic years and default to the latest (current) one.
  await classroomStore.fetchAcademicYears();
  form.value.academicYearId = classroomStore.latestAcademicYearId;
});

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("classes"), disabled: false, to: "/class" },
  { title: t("addClass"), disabled: true, to: "/class/add" },
];

const rules = {
  required: (v: any) => !!v || t("required"),
};

const save = async () => {
  errorMessage.value = "";
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await classroomStore.createClassroom({
      classroom_name: form.value.className,
      classroom_code: form.value.code,
      grade_level_id: form.value.gradeLevelId,
      academic_year_id: form.value.academicYearId,
      homeroom_teacher_id: form.value.homeroomTeacherId,
      room_number: form.value.room,
      max_student: form.value.maxStudent ? Number(form.value.maxStudent) : null,
    });
    router.push("/class");
  } catch (error: any) {
    console.error(error);
    errorMessage.value =
      error.response?.data?.message || t("failed-create-classroom");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Columns in the dense rows need a little breathing room below each field */
.v-row--dense > .v-col {
  padding-bottom: 10px;
}

/* Read-only academic year looks muted so it reads as "auto-filled" */
.readonly-field :deep(.v-field) {
  background: #f8fafc;
}
.readonly-field :deep(input) {
  color: var(--ds-muted);
  font-weight: 600;
}
</style>
