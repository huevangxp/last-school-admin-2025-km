<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <div class="text-title mb-1">
          {{ $t("management") }} {{ $t("subject") }}
        </div>
        <div class="text-detail">Oversee curriculum and course management.</div>
      </div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="flat"
          color="white"
          class="modern-action-btn secondary border"
          height="36"
        >
          <v-icon icon="mdi-file-download-outline" start size="18"></v-icon>
          {{ t("export") }}
        </v-btn>

        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="36"
          to="/subjects/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ $t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in subjectStats" :key="i">
        <v-card
          class="metric-card pa-4 d-flex flex-column justify-space-between h-100"
          elevation="0"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p class="text-detail-tiny mb-1">
                {{ stat.label }}
              </p>
              <h2 class="text-title">{{ stat.value }}</h2>
            </div>
            <v-avatar
              :color="`${stat.color}-lighten-5`"
              rounded="lg"
              size="40"
              class="metric-icon-box"
            >
              <v-icon :color="`${stat.color}-darken-2`" size="18">{{
                stat.icon
              }}</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card elevation="0" class="intelligence-card pa-4">
      <!-- Search and Filter Section -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-3"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :placeholder="t('search')"
          variant="outlined"
          density="compact"
          hide-details
          class="cream-input"
          style="max-width: 320px"
          bg-color="white"
          color="primary"
          base-color="grey-lighten-1"
          rounded="lg"
        ></v-text-field>

        <div class="d-flex gap-2 align-center flex-wrap">
          <v-btn-toggle
            v-model="viewMode"
            mandatory
            density="compact"
            color="primary"
            variant="outlined"
            divided
            rounded="lg"
            class="view-toggle"
          >
            <v-btn value="all" size="small" class="text-none">
              <v-icon start size="16">mdi-format-list-bulleted</v-icon>
              ທັງໝົດ
            </v-btn>
            <v-btn value="grouped" size="small" class="text-none">
              <v-icon start size="16">mdi-book-multiple-outline</v-icon>
              ຕາມວິຊາ
            </v-btn>
          </v-btn-toggle>
        </div>
      </div>

      <!-- Data Table -->
      <v-data-table
        :headers="displayHeaders"
        :items="displayItems"
        :search="search"
        :loading="subjectStore.loading"
        v-model:items-per-page="itemsPerPage"
        :items-per-page-options="itemsPerPageOptions"
        class="premium-table"
        hover
      >
        <template v-slot:no-data>
          <div class="text-detail py-8 text-center">No subjects yet.</div>
        </template>
        <!-- Subject Name Slot -->
        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="teal-lighten-5"
              size="32"
              class="mr-3 elevation-1 border-white"
            >
              <v-icon
                icon="mdi-book-open-page-variant-outline"
                size="16"
                color="teal-darken-2"
              ></v-icon>
            </v-avatar>
            <div>
              <div class="text-title-small">
                {{ item.title }}
              </div>
              <div class="text-detail-tiny">
                {{ item.id }}
              </div>
            </div>
          </div>
        </template>

        <!-- Grade Slot -->
        <template v-slot:item.grade="{ item }">
          <div class="text-title-small">{{ item.grade }}</div>
        </template>

        <!-- Classes Slot (grouped view: all grades this subject covers) -->
        <template v-slot:item.classes="{ item }">
          <div class="d-flex flex-wrap ga-1 py-2">
            <v-chip
              v-for="g in item.grades"
              :key="g.id"
              size="x-small"
              color="teal-lighten-5"
              class="text-teal-darken-2 font-weight-bold"
              variant="flat"
            >
              {{ g.name }}
            </v-chip>
            <span v-if="!item.grades?.length" class="text-detail-tiny">—</span>
          </div>
        </template>

        <!-- Coefficient Slot -->
        <template v-slot:item.coefficient="{ item }">
          <v-chip
            size="x-small"
            color="indigo-lighten-5"
            class="text-indigo-darken-2 font-weight-black"
            variant="flat"
          >
            × {{ item.coefficient }}
          </v-chip>
        </template>

        <!-- Actions Slot -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end ga-1">
            <v-btn
              icon="mdi-pencil-outline"
              variant="text"
              size="x-small"
              color="primary"
              @click="openEdit(item)"
            ></v-btn>
            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              size="x-small"
              color="error"
              @click="removeSubject(item)"
            ></v-btn>
          </div>
        </template>

        <!-- Status Slot -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.status === 'Active' ? 'success' : 'grey'"
            size="x-small"
            variant="flat"
            class="font-weight-black text-uppercase px-2"
          >
            {{ item.status }}
          </v-chip>
        </template>

      </v-data-table>
    </v-card>

    <!-- Edit Subject Dialog -->
    <v-dialog v-model="editDialog" width="480">
      <v-card rounded="xl" class="pa-6">
        <div class="text-title mb-4">{{ t("edit") }} {{ t("subject") }}</div>
        <label class="text-detail-tiny mb-1 d-block">{{ t("name") }}</label>
        <v-text-field
          v-model="editForm.subject_name"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          class="mb-3"
        ></v-text-field>
        <v-row>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">CODE</label>
            <v-text-field
              v-model="editForm.subject_code"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <label class="text-detail-tiny mb-1 d-block">COEFFICIENT</label>
            <v-text-field
              v-model="editForm.coefficient"
              type="number"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <label class="text-detail-tiny mb-1 mt-3 d-block">{{ t("grade") }}</label>
        <v-select
          v-model="editForm.grade_id"
          :items="classroomStore.gradeLevels"
          item-title="grade_level_name"
          item-value="id"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          class="mb-3"
        ></v-select>
        <label class="text-detail-tiny mb-1 d-block">{{ t("status") }}</label>
        <v-select
          v-model="editForm.subject_status"
          :items="['active', 'inactive']"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
        ></v-select>

        <v-alert
          v-if="editError"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-4"
          >{{ editError }}</v-alert
        >

        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" @click="editDialog = false">{{
            t("cancel")
          }}</v-btn>
          <v-btn
            color="primary"
            class="modern-action-btn primary"
            :loading="saving"
            @click="saveEdit"
            >{{ t("save") }}</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSubjectStore } from "~/stores/apiSubject";
import { useClassroomStore } from "~/stores/apiClassroom";

const { t } = useI18n();

const search = ref("");
const subjectStore = useSubjectStore();
const classroomStore = useClassroomStore();

onMounted(() => {
  subjectStore.fetchSubjects();
  classroomStore.fetchGradeLevels();
});

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("subject"), disabled: true, to: "/subjects" },
];

const gradeName = (id: string) =>
  classroomStore.gradeLevels.find((g) => g.id === id)?.grade_level_name || "—";

const subjectStats = computed(() => [
  {
    label: "Total Subjects",
    value: String(subjectStore.subjects.length),
    icon: "mdi-book-open-page-variant-outline",
    color: "teal",
  },
  {
    label: "Active",
    value: String(
      subjectStore.subjects.filter((s) => s.subject_status === "active").length
    ),
    icon: "mdi-check-circle-outline",
    color: "green",
  },
  {
    label: "Grade Levels",
    value: String(
      new Set(subjectStore.subjects.map((s) => s.grade_id)).size
    ),
    icon: "mdi-stairs",
    color: "purple",
  },
  {
    label: "Inactive",
    value: String(
      subjectStore.subjects.filter((s) => s.subject_status !== "active").length
    ),
    icon: "mdi-close-circle-outline",
    color: "orange",
  },
]);

// ---- View mode + pagination ----
const viewMode = ref<"all" | "grouped">("all");
const itemsPerPage = ref(10);
const itemsPerPageOptions = [
  { value: 10, title: "10" },
  { value: 25, title: "25" },
  { value: 50, title: "50" },
  { value: 100, title: "100" },
  { value: -1, title: "ທັງໝົດ (All)" },
];

const withHeaderClass = (arr: any[]) =>
  arr.map((h) => ({ ...h, class: "text-detail-tiny pb-2" }));

const allHeaders = withHeaderClass([
  { title: t("subject"), key: "title", align: "start" as const, sortable: true },
  { title: t("grade"), key: "grade", align: "start" as const, sortable: true },
  { title: "COEFFICIENT", key: "coefficient", align: "start" as const, sortable: true },
  { title: t("status"), key: "status", align: "start" as const, sortable: true },
  { title: "", key: "actions", align: "end" as const, sortable: false },
]);

const groupedHeaders = withHeaderClass([
  { title: t("subject"), key: "title", align: "start" as const, sortable: true },
  { title: "ຫ້ອງຮຽນ / CLASSES", key: "classes", align: "start" as const, sortable: false },
  { title: "COEFFICIENT", key: "coefficient", align: "start" as const, sortable: true },
]);

const displayHeaders = computed(() =>
  viewMode.value === "grouped" ? groupedHeaders : allHeaders
);

// Flat rows: one per subject-grade record.
const subjects = computed(() =>
  subjectStore.subjects.map((s) => ({
    uuid: s.id,
    id: s.subject_code,
    title: s.subject_name,
    grade: gradeName(s.grade_id),
    coefficient: s.coefficient,
    status: s.subject_status === "active" ? "Active" : "Inactive",
    subjectStatusRaw: s.subject_status,
    subjectName: s.subject_name,
    subjectCode: s.subject_code,
    coefficientRaw: s.coefficient,
    gradeId: s.grade_id,
  }))
);

// Order grades by their position in the grade-level list (ປ.1 … ມ.7).
const gradeOrder = computed<Record<string, number>>(() => {
  const map: Record<string, number> = {};
  classroomStore.gradeLevels.forEach((g: any, i: number) => (map[g.id] = i));
  return map;
});

// Grouped rows: one per subject title, listing every grade it covers.
const groupedSubjects = computed(() => {
  const map = new Map<string, any>();
  for (const s of subjectStore.subjects) {
    const key = s.subject_name;
    if (!map.has(key)) {
      map.set(key, {
        title: s.subject_name,
        id: s.subject_code,
        coefficient: s.coefficient,
        grades: [] as { id: string; name: string }[],
      });
    }
    map.get(key).grades.push({ id: s.grade_id, name: gradeName(s.grade_id) });
  }
  const rows = Array.from(map.values());
  rows.forEach((r) =>
    r.grades.sort(
      (a: any, b: any) =>
        (gradeOrder.value[a.id] ?? 999) - (gradeOrder.value[b.id] ?? 999)
    )
  );
  return rows;
});

const displayItems = computed(() =>
  viewMode.value === "grouped" ? groupedSubjects.value : subjects.value
);

// ---- Edit / Delete ----
const editDialog = ref(false);
const saving = ref(false);
const editError = ref("");
const editForm = ref({
  uuid: "",
  subject_name: "",
  subject_code: "",
  coefficient: "",
  grade_id: "",
  subject_status: "active",
});

const openEdit = (item: any) => {
  editError.value = "";
  editForm.value = {
    uuid: item.uuid,
    subject_name: item.subjectName,
    subject_code: item.subjectCode,
    coefficient: String(item.coefficientRaw ?? ""),
    grade_id: item.gradeId,
    subject_status: item.subjectStatusRaw || "active",
  };
  editDialog.value = true;
};

const saveEdit = async () => {
  saving.value = true;
  try {
    await subjectStore.updateSubject(editForm.value.uuid, {
      subject_name: editForm.value.subject_name,
      subject_code: editForm.value.subject_code,
      coefficient: Number(editForm.value.coefficient),
      grade_id: editForm.value.grade_id,
      subject_status: editForm.value.subject_status,
    });
    editDialog.value = false;
    await subjectStore.fetchSubjects();
  } catch (error: any) {
    editError.value = error.response?.data?.message || "Failed to update.";
  } finally {
    saving.value = false;
  }
};

const removeSubject = async (item: any) => {
  if (!confirm(t("are_you_sure_delete"))) return;
  try {
    await subjectStore.deleteSubject(item.uuid);
    await subjectStore.fetchSubjects();
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.metric-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
}

.metric-icon-box {
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intelligence-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
}

.premium-table {
  background: transparent !important;
}

:deep(.v-data-table__th) {
  background-color: #f8fafc !important;
  border-bottom: 1px solid #f1f5f9 !important;
  height: 48px !important;
}

:deep(.v-data-table__td) {
  border-bottom: 1px solid #f1f5f9 !important;
  height: 60px !important;
}

.cream-input :deep(.v-field__outline__start),
.cream-input :deep(.v-field__outline__end),
.cream-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.border-white {
  border: 1.5px solid #ffffff;
}

.border-t {
  border-top: 1px solid #f1f5f9;
}
</style>
