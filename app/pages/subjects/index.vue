<template>
  <div class="page">
    <PageHeader
      :title="`${t('management')} ${t('subject')}`"
      :subtitle="t('subjects-subtitle')"
      icon="mdi-book-open-page-variant-outline"
      :breadcrumbs="breadcrumbs"
    >
      <template #actions>
        <v-btn
          variant="flat"
          class="modern-action-btn secondary"
          @click="exportList"
        >
          <v-icon icon="mdi-file-download-outline" start size="18"></v-icon>
          {{ t("export") }}
        </v-btn>
        <v-btn
          variant="flat"
          class="modern-action-btn primary"
          to="/subjects/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ t("add") }}
        </v-btn>
      </template>
    </PageHeader>

    <!-- KPI cards -->
    <v-row class="mb-2 fade-in">
      <v-col v-for="(stat, i) in subjectStats" :key="i" cols="6" lg="3">
        <StatCard
          :icon="stat.icon"
          :label="stat.label"
          :value="stat.value"
          :color="statPalette[stat.color]?.color"
          :tint="statPalette[stat.color]?.tint"
        />
      </v-col>
    </v-row>

    <!-- Subjects table -->
    <v-card elevation="0" class="panel panel--flush fade-in">
      <div class="panel-head">
        <div>
          <div class="panel-title">{{ t("subjects") }}</div>
          <div class="panel-sub">{{ t("subjects-subtitle") }}</div>
        </div>
        <span class="panel-chip panel-chip--teal">
          {{ displayItems.length }} {{ t("total") }}
        </span>
      </div>

      <div class="pa-4 pa-md-5 pb-0 pb-md-0">
        <div class="filter-bar">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            :placeholder="t('search')"
            variant="outlined"
            density="compact"
            hide-details
            class="filter-search"
            color="primary"
          ></v-text-field>

          <div class="filter-spacer"></div>

          <v-btn-toggle
            v-model="viewMode"
            mandatory
            density="compact"
            color="primary"
            variant="outlined"
            divided
            class="view-toggle"
          >
            <v-btn value="all" size="small" class="text-none">
              <v-icon start size="16">mdi-format-list-bulleted</v-icon>
              {{ t("all") }}
            </v-btn>
            <v-btn value="grouped" size="small" class="text-none">
              <v-icon start size="16">mdi-book-multiple-outline</v-icon>
              {{ t("by-subject") }}
            </v-btn>
          </v-btn-toggle>
        </div>
      </div>

      <div class="table-wrap">
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
            <div class="pa-4">
              <EmptyState
                icon="mdi-book-off-outline"
                :title="t('no-subjects-yet')"
              />
            </div>
          </template>

          <!-- Subject -->
          <template v-slot:item.title="{ item }">
            <div class="d-flex align-center ga-3 py-2">
              <div class="avatar-chip avatar-chip--teal">
                <v-icon
                  icon="mdi-book-open-page-variant-outline"
                  size="16"
                ></v-icon>
              </div>
              <div class="min-w-0">
                <div class="cell-title">{{ item.title }}</div>
                <div class="cell-sub">{{ item.id }}</div>
              </div>
            </div>
          </template>

          <!-- Grade -->
          <template v-slot:item.grade="{ item }">
            <span class="code-chip">{{ item.grade }}</span>
          </template>

          <!-- Classes (grouped view) -->
          <template v-slot:item.classes="{ item }">
            <div class="chip-list py-2">
              <span v-for="g in item.grades" :key="g.id" class="code-chip">
                {{ g.name }}
              </span>
              <span v-if="!item.grades?.length" class="cell-sub">—</span>
            </div>
          </template>

          <!-- Teachers -->
          <template v-slot:item.teachers="{ item }">
            <div class="chip-list py-2">
              <span
                v-for="tName in item.teachers"
                :key="tName"
                class="status-pill status-pill--indigo"
              >
                <v-icon size="12">mdi-account-tie-outline</v-icon>
                {{ tName }}
              </span>
              <span v-if="!item.teachers?.length" class="cell-sub">
                {{ t("unassigned") }}
              </span>
            </div>
          </template>

          <!-- Coefficient -->
          <template v-slot:item.coefficient="{ item }">
            <span class="code-chip">× {{ item.coefficient }}</span>
          </template>

          <!-- Status -->
          <template v-slot:item.status="{ item }">
            <span
              class="status-pill"
              :class="
                item.status === 'Active'
                  ? 'status-pill--green'
                  : 'status-pill--grey'
              "
            >
              <span class="status-dot"></span>
              {{ item.status === "Active" ? t("open") : t("closed") }}
            </span>
          </template>

          <!-- Actions -->
          <template v-slot:item.actions="{ item }">
            <div class="row-actions">
              <v-btn
                icon="mdi-pencil-outline"
                variant="text"
                size="small"
                color="primary"
                @click="openEdit(item)"
              ></v-btn>
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                size="small"
                color="error"
                @click="removeSubject(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <!-- Edit Subject Dialog -->
    <v-dialog v-model="editDialog" width="520">
      <v-card elevation="0" class="pa-5 pa-md-6">
        <div class="panel-head">
          <div>
            <div class="panel-title">{{ t("edit") }} {{ t("subject") }}</div>
            <div class="panel-sub">{{ editForm.subject_code }}</div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="editDialog = false"
          ></v-btn>
        </div>

        <label class="field-label">{{ t("name") }}</label>
        <v-text-field
          v-model="editForm.subject_name"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
        ></v-text-field>

        <v-row dense>
          <v-col cols="12" sm="6">
            <label class="field-label">{{ t("code") }}</label>
            <v-text-field
              v-model="editForm.subject_code"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <label class="field-label">{{ t("coefficient") }}</label>
            <v-text-field
              v-model="editForm.coefficient"
              type="number"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
            ></v-text-field>
          </v-col>
        </v-row>

        <label class="field-label">{{ t("grade") }}</label>
        <v-select
          v-model="editForm.grade_id"
          :items="classroomStore.gradeLevels"
          item-title="grade_level_name"
          item-value="id"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
        ></v-select>

        <label class="field-label">{{ t("status") }}</label>
        <v-select
          v-model="editForm.subject_status"
          :items="['active', 'inactive']"
          variant="outlined"
          density="comfortable"
          hide-details
        ></v-select>

        <v-alert
          v-if="editError"
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="mt-4"
        >
          {{ editError }}
        </v-alert>

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn secondary"
            @click="editDialog = false"
          >
            {{ t("cancel") }}
          </v-btn>
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            :loading="saving"
            @click="saveEdit"
          >
            {{ t("save") }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSubjectStore } from "~/stores/apiSubject";
import { useClassroomStore } from "~/stores/apiClassroom";
import { useTeachingStore } from "~/stores/apiTeaching";
import { useUiStore } from "~/stores/ui";

const { t } = useI18n();

const search = ref("");
const subjectStore = useSubjectStore();
const classroomStore = useClassroomStore();
const teachingStore = useTeachingStore();
const ui = useUiStore();

onMounted(async () => {
  await Promise.all([
    subjectStore.fetchSubjects(),
    classroomStore.fetchGradeLevels(),
    classroomStore.fetchAcademicYears(),
  ]);
  // Load this year's teaching assignments so each subject can show its teachers.
  const yearId = classroomStore.latestAcademicYearId;
  if (yearId) await teachingStore.fetchAssignments({ academic_year_id: yearId });
});

// subject_id → teachers who teach it; and by subject name for the grouped view.
const teachersBySubjectId = computed(() => {
  const map = new Map<string, Set<string>>();
  for (const a of teachingStore.assignments as any[]) {
    const name = a.tb_teacher?.full_name || a.tb_teacher?.username;
    if (!a.subject_id || !name) continue;
    if (!map.has(a.subject_id)) map.set(a.subject_id, new Set());
    map.get(a.subject_id)!.add(name);
  }
  return map;
});
const teachersBySubjectName = computed(() => {
  const map = new Map<string, Set<string>>();
  for (const a of teachingStore.assignments as any[]) {
    const sname = a.tb_subject?.subject_name;
    const tname = a.tb_teacher?.full_name || a.tb_teacher?.username;
    if (!sname || !tname) continue;
    if (!map.has(sname)) map.set(sname, new Set());
    map.get(sname)!.add(tname);
  }
  return map;
});

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("subject"), disabled: true, to: "/subjects" },
];

const gradeName = (id: string) =>
  classroomStore.gradeLevels.find((g) => g.id === id)?.grade_level_name || "—";

const subjectStats = computed(() => [
  {
    label: t("total-subjects"),
    value: String(subjectStore.subjects.length),
    icon: "mdi-book-open-page-variant-outline",
    color: "teal",
  },
  {
    label: t("active"),
    value: String(
      subjectStore.subjects.filter((s) => s.subject_status === "active").length
    ),
    icon: "mdi-check-circle-outline",
    color: "green",
  },
  {
    label: t("grade-levels"),
    value: String(
      new Set(subjectStore.subjects.map((s) => s.grade_id)).size
    ),
    icon: "mdi-stairs",
    color: "purple",
  },
  {
    label: t("inactive"),
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
  { value: -1, title: t("all") },
];

const withHeaderClass = (arr: any[]) =>
  arr.map((h) => ({ ...h, class: "text-detail-tiny pb-2" }));

const allHeaders = withHeaderClass([
  { title: t("subject"), key: "title", align: "start" as const, sortable: true },
  { title: t("grade"), key: "grade", align: "start" as const, sortable: true },
  { title: t("teachers"), key: "teachers", align: "start" as const, sortable: false },
  { title: t("coefficient"), key: "coefficient", align: "start" as const, sortable: true },
  { title: t("status"), key: "status", align: "start" as const, sortable: true },
  { title: "", key: "actions", align: "end" as const, sortable: false },
]);

const groupedHeaders = withHeaderClass([
  { title: t("subject"), key: "title", align: "start" as const, sortable: true },
  { title: t("classes"), key: "classes", align: "start" as const, sortable: false },
  { title: t("teachers"), key: "teachers", align: "start" as const, sortable: false },
  { title: t("coefficient"), key: "coefficient", align: "start" as const, sortable: true },
]);

const displayHeaders = computed(() =>
  viewMode.value === "grouped" ? groupedHeaders : allHeaders
);

const { exportRows } = useExcel();
const exportList = () =>
  exportRows(
    "subjects",
    [
      { label: t("code"), key: "id" },
      { label: t("subject-name"), key: "title" },
      { label: t("grade"), key: "grade" },
      { label: t("coefficient"), key: "coefficient" },
      { label: t("status"), key: "subjectStatusRaw" },
    ],
    subjects.value
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
    teachers: Array.from(teachersBySubjectId.value.get(s.id) || []),
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
        teachers: Array.from(teachersBySubjectName.value.get(s.subject_name) || []),
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
    editError.value = error.response?.data?.message || t("failed-to-update");
  } finally {
    saving.value = false;
  }
};

const removeSubject = async (item: any) => {
  const ok = await ui.confirm({
    message: t("are_you_sure_delete"),
    confirmText: t("delete"),
    icon: "mdi-delete-outline",
  });
  if (!ok) return;
  try {
    await subjectStore.deleteSubject(item.uuid);
    await subjectStore.fetchSubjects();
    ui.notify(t("deleted_successfully"), "success");
  } catch (error) {
    ui.notify(t("failed-to-delete"), "error");
  }
};

// Presentation-only: map the stat colour names above to hex values for StatCard.
const statPalette: Record<string, { color: string; tint: string }> = {
  teal: { color: "#0d9488", tint: "#f0fdfa" },
  green: { color: "#16a34a", tint: "#f0fdf4" },
  purple: { color: "#7c3aed", tint: "#f5f3ff" },
  orange: { color: "#ea580c", tint: "#fff7ed" },
};
</script>

<style scoped>
/* Page-specific: teal avatar tint for subject rows */
.avatar-chip--teal {
  color: #0f766e;
  background: #f0fdfa;
}

/* Wrapping list of small chips inside a table cell */
.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-width: 140px;
}

/* All / By-subject toggle */
.view-toggle {
  border-radius: 10px !important;
  height: 40px !important;
  border-color: #e8edf3 !important;
}
.view-toggle .v-btn {
  text-transform: none !important;
  font-weight: 700;
  height: 38px !important;
}
@media (max-width: 599px) {
  .view-toggle {
    width: 100%;
  }
  .view-toggle .v-btn {
    flex: 1 1 50%;
  }
}
</style>
