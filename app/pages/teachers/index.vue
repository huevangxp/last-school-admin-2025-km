<template>
  <div class="page">
    <PageHeader
      :title="`${t('management')} ${t('teachers')}`"
      :subtitle="t('manage-faculty-desc')"
      icon="mdi-account-tie-outline"
      :breadcrumbs="breadcrumbs"
    >
      <template #actions>
        <v-btn
          variant="flat"
          class="modern-action-btn secondary"
          to="/teachers/organization"
        >
          <v-icon icon="mdi-sitemap-outline" start size="18"></v-icon>
          {{ t("organization") }}
        </v-btn>
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
          to="/teachers/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ t("add") }}
        </v-btn>
      </template>
    </PageHeader>

    <!-- KPI tiles -->
    <v-row class="mb-2 fade-in">
      <v-col v-for="(stat, i) in teacherStats" :key="i" cols="6" lg="3">
        <StatCard
          :icon="stat.icon"
          :label="stat.label"
          :value="stat.value"
          :color="statPalette[stat.color]?.color"
          :tint="statPalette[stat.color]?.tint"
        />
      </v-col>
    </v-row>

    <!-- Teacher list -->
    <v-card elevation="0" class="panel panel--flush fade-in">
      <div class="list-toolbar">
        <div class="filter-bar mb-0">
          <!-- Searchable teacher-name filter (type to search, pick from the list). -->
          <v-autocomplete
            v-model="selectedName"
            :items="teacherNameOptions"
            prepend-inner-icon="mdi-magnify"
            :placeholder="t('search-teacher-name')"
            :no-data-text="t('no-teachers-found')"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            auto-select-first
            class="filter-search"
            color="primary"
          ></v-autocomplete>

          <v-autocomplete
            v-model="selectedRole"
            :items="roleOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="comfortable"
            hide-details
            prepend-inner-icon="mdi-account-cog-outline"
            color="primary"
          ></v-autocomplete>

          <v-autocomplete
            v-model="selectedStatus"
            :items="statusOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="comfortable"
            hide-details
            prepend-inner-icon="mdi-filter-variant"
            color="primary"
          ></v-autocomplete>
        </div>

        <v-alert
          v-if="teacherStore.error"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-4"
          >{{ teacherStore.error }}</v-alert
        >
      </div>

      <div class="table-wrap">
        <v-data-table
          v-model:page="page"
          :items-per-page="itemsPerPage"
          :headers="headers"
          :items="filteredTeachers"
          :loading="teacherStore.loading"
          class="premium-table"
          hover
        >
          <template #no-data>
            <div class="pa-4">
              <EmptyState
                icon="mdi-account-search-outline"
                :title="t('no-teachers-found')"
              />
            </div>
          </template>

          <!-- Teacher name + avatar -->
          <template #item.name="{ item }">
            <div class="d-flex align-center py-2">
              <v-avatar size="36" rounded="lg" class="mr-3 teacher-avatar">
                <v-img v-if="item.image" :src="item.image" cover alt=""></v-img>
                <v-icon v-else size="18" color="primary">mdi-account</v-icon>
              </v-avatar>
              <div class="min-w-0">
                <div class="cell-title text-truncate">{{ item.username }}</div>
                <div class="cell-sub text-truncate">
                  {{ item.email || t("no-email") }}
                </div>
              </div>
            </div>
          </template>

          <!-- ID number -->
          <template #item.id="{ item }">
            <span class="code-chip">{{ item.id }}</span>
          </template>

          <!-- Subject / department -->
          <template #item.teacherSubject="{ item }">
            <div class="cell-title">{{ item.teacherSubject }}</div>
            <div class="cell-sub">{{ item.grade || "—" }}</div>
          </template>

          <!-- Contact -->
          <template #item.phone="{ item }">
            <span class="cell-title">{{ item.phone || "—" }}</span>
          </template>

          <!-- Status -->
          <template #item.status="{ item }">
            <span
              class="status-pill"
              :class="
                item.status === 'Active'
                  ? 'status-pill--green'
                  : item.status === 'Suspended'
                    ? 'status-pill--red'
                    : 'status-pill--grey'
              "
            >
              <span class="status-dot"></span>
              {{
                item.status === "Active"
                  ? t("open")
                  : item.status === "Suspended"
                    ? t("closed")
                    : t("inactive")
              }}
            </span>
          </template>

          <!-- Row actions -->
          <template #item.actions="{ item }">
            <div class="row-actions">
              <v-btn
                :icon="
                  item.statusRaw === 'active'
                    ? 'mdi-account-cancel-outline'
                    : 'mdi-account-check-outline'
                "
                variant="text"
                size="small"
                :color="item.statusRaw === 'active' ? 'warning' : 'success'"
                :title="item.statusRaw === 'active' ? t('close') : t('open')"
                @click="requestToggle(item)"
              ></v-btn>
              <v-btn
                icon="mdi-pencil-outline"
                variant="text"
                size="small"
                color="primary"
                :title="t('edit')"
                @click="openEdit(item)"
              ></v-btn>
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                size="small"
                color="error"
                :title="t('delete')"
                @click="requestDelete(item)"
              ></v-btn>
            </div>
          </template>

          <!-- Pagination -->
          <template #bottom>
            <div class="table-footer list-footer">
              <div class="cell-sub">
                {{ t("showing") }} {{ rangeStart }}-{{ rangeEnd }} {{ t("of") }}
                {{ filteredTeachers.length }} {{ t("results") }}
              </div>
              <div class="pager">
                <v-btn
                  icon="mdi-chevron-left"
                  variant="text"
                  size="small"
                  :disabled="page <= 1"
                  @click="page--"
                ></v-btn>
                <v-btn
                  v-for="p in pages"
                  :key="p"
                  :color="p === page ? 'primary' : undefined"
                  :variant="p === page ? 'flat' : 'text'"
                  size="small"
                  class="pager-btn"
                  @click="page = p"
                >
                  {{ p }}
                </v-btn>
                <v-btn
                  icon="mdi-chevron-right"
                  variant="text"
                  size="small"
                  :disabled="page >= pageCount"
                  @click="page++"
                ></v-btn>
              </div>
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <!-- Confirm popup for delete / block -->
    <ConfirmDialog
      v-model="confirm.show"
      :title="confirm.title"
      :message="confirm.message"
      :confirm-text="confirm.confirmText"
      :color="confirm.color"
      :icon="confirm.icon"
      :loading="confirm.loading"
      @confirm="runConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTeacherStore } from "~/stores/apiTeacher";
import { useTeachingStore } from "~/stores/apiTeaching";
import { useClassroomStore } from "~/stores/apiClassroom";

// Managing teachers (list / edit / delete) is admin-only; teachers are sent to
// the read-only org chart instead.
definePageMeta({ requiresAdmin: true });

const { t } = useI18n();
const router = useRouter();

const selectedName = ref<string | null>(null);
const selectedRole = ref<string | null>(null);
const selectedStatus = ref<string | null>(null);

const roleOptions = [
  { title: t("all-roles"), value: null },
  { title: t("teacher"), value: "teacher" },
  { title: t("admin"), value: "admin" },
];
const statusOptions = [
  { title: t("all-statuses"), value: null },
  { title: t("active"), value: "active" },
  { title: t("inactive"), value: "inactive" },
  { title: t("block"), value: "block" },
];

const teacherStore = useTeacherStore();
const teachingStore = useTeachingStore();
const classroomStore = useClassroomStore();

onMounted(async () => {
  await Promise.all([
    teacherStore.fetchTeachers(100, 1),
    classroomStore.fetchAcademicYears(),
  ]);
  // The teacher ↔ subject relationship lives in the teaching assignments; load
  // the latest year's so the Subject column can show what each teacher teaches.
  const yearId = classroomStore.latestAcademicYearId;
  if (yearId) await teachingStore.fetchAssignments({ academic_year_id: yearId });
});

// teacher_id → the distinct subjects they teach this year.
const subjectsByTeacher = computed(() => {
  const map = new Map<string, Set<string>>();
  for (const a of teachingStore.assignments as any[]) {
    const name = a.tb_subject?.subject_name;
    if (!a.teacher_id || !name) continue;
    if (!map.has(a.teacher_id)) map.set(a.teacher_id, new Set());
    map.get(a.teacher_id)!.add(name);
  }
  return map;
});

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("teachers"), disabled: true, to: "/teachers" },
];

const teacherStats = computed(() => [
  {
    label: t("total-teachers"),
    value: String(teacherStore.total),
    icon: "mdi-account-group",
    color: "blue",
  },
  {
    label: t("active"),
    value: String(teacherStore.activeCount),
    icon: "mdi-check-circle-outline",
    color: "green",
  },
  {
    label: t("never-logged-in"),
    value: String(
      teacherStore.teachers.filter((tc) => !tc.last_login_at).length
    ),
    icon: "mdi-account-star-outline",
    color: "purple",
  },
  {
    label: t("inactive"),
    value: String(
      teacherStore.teachers.filter(
        (tc) => tc.status?.toLowerCase() !== "active"
      ).length
    ),
    icon: "mdi-clock-time-four-outline",
    color: "orange",
  },
]);

// Presentation only: StatCard takes hex accent/tint values, so map the stat
// colour names above to the design-system palette.
const statPalette: Record<string, { color: string; tint: string }> = {
  blue: { color: "#0A3154", tint: "#E6ECF2" },
  green: { color: "#10b981", tint: "#ecfdf5" },
  purple: { color: "#7c3aed", tint: "#f5f3ff" },
  orange: { color: "#f59e0b", tint: "#fffbeb" },
};

const headers = [
  { title: t("id"), key: "id", align: "start" as const, sortable: true },
  {
    title: t("teachers"),
    key: "name",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("subject"),
    key: "teacherSubject",
    align: "start" as const,
    sortable: true,
  },
  { title: t("phone"), key: "phone", align: "start" as const, sortable: true },
  {
    title: t("status"),
    key: "status",
    align: "start" as const,
    sortable: true,
  },
  { title: "", key: "actions", align: "end" as const, sortable: false },
].map((h) => ({
  ...h,
  class: "text-detail-tiny pb-2",
}));

// Uploaded avatars are stored as a relative path (/uploads/images/x.png) served
// from the API origin; mediaUrl() prepends the domain so they render (seeded
// absolute URLs pass through unchanged).
const { mediaUrl } = useMedia();

// Map live API teachers into the shape this table expects.
const { exportRows } = useExcel();
const exportList = () =>
  exportRows(
    "teachers",
    [
      { label: t("id"), key: "id" },
      { label: t("name"), key: "fullName" },
      { label: t("username"), key: "email" },
      { label: t("role"), key: "role" },
      { label: t("phone"), key: "phone" },
      { label: t("dob"), key: "dob" },
      { label: t("status"), key: "statusRaw" },
      { label: t("position"), key: "position" },
      { label: t("department"), key: "department" },
    ],
    teachers.value
  );

const teachers = computed(() =>
  teacherStore.teachers.map((tc) => {
    // Subjects the teacher actually teaches (from assignments); the subject
    // group (ໝວດວິຊາ / department) is the fallback when none are assigned yet.
    const subs = Array.from(subjectsByTeacher.value.get(tc.id) || []);
    return {
    uuid: tc.id,
    id: tc.teacher_id,
    image: mediaUrl(tc.avatar),
    username: tc.full_name || tc.username,
    fullName: tc.full_name,
    email: tc.username,
    teacherSubject: subs.length ? subs.join(", ") : tc.department || "—",
    role: tc.role,
    // Sub-line: show the subject group when subjects are listed above, else the
    // job position — never a hard-coded placeholder.
    grade: subs.length ? tc.department || "" : tc.position || "",
    genderRaw: tc.gender,
    dob: tc.dob ? String(tc.dob).substring(0, 10) : "",
    phone: tc.phone_number,
    status: capitalize(tc.status),
    statusRaw: tc.status,
    position: tc.position || "",
    department: tc.department || "",
    layer: tc.layer ?? null,
    managerId: tc.manager_id || null,
    };
  })
);

// Distinct teacher names for the searchable name filter.
const teacherNameOptions = computed(() =>
  Array.from(
    new Set(teachers.value.map((tc) => tc.username).filter(Boolean))
  ).sort()
);

// Apply name + role + status filters.
const filteredTeachers = computed(() =>
  teachers.value.filter((tc) => {
    const nameOk = !selectedName.value || tc.username === selectedName.value;
    const roleOk =
      !selectedRole.value ||
      (tc.role || "").toLowerCase() === selectedRole.value;
    const statusOk =
      !selectedStatus.value || tc.statusRaw === selectedStatus.value;
    return nameOk && roleOk && statusOk;
  })
);

// ---- Pagination (client-side, over the filtered rows) ----
const page = ref(1);
const itemsPerPage = ref(10);

const pageCount = computed(() =>
  Math.max(1, Math.ceil(filteredTeachers.value.length / itemsPerPage.value))
);
const pages = computed(() =>
  Array.from({ length: pageCount.value }, (_, i) => i + 1)
);
const rangeStart = computed(() =>
  filteredTeachers.value.length === 0
    ? 0
    : (page.value - 1) * itemsPerPage.value + 1
);
const rangeEnd = computed(() =>
  Math.min(page.value * itemsPerPage.value, filteredTeachers.value.length)
);

// Any filter change resets to the first page (and never leave an empty page).
watch([selectedName, selectedRole, selectedStatus], () => {
  page.value = 1;
});
watch(pageCount, (count) => {
  if (page.value > count) page.value = count;
});

// ---- Confirm popup (shared for delete + block) ----
const confirm = ref({
  show: false,
  title: "",
  message: "",
  confirmText: "",
  color: "error",
  icon: "mdi-alert-circle-outline",
  loading: false,
  action: null as null | (() => Promise<void>),
});

const requestDelete = (item: any) => {
  confirm.value = {
    show: true,
    title: t("delete-teacher-title"),
    message: `"${item.username}" ${t("are_you_sure_delete")}`,
    confirmText: t("delete"),
    color: "error",
    icon: "mdi-delete-outline",
    loading: false,
    action: () => doDelete(item),
  };
};

const requestToggle = (item: any) => {
  const closing = item.statusRaw === "active";
  confirm.value = {
    show: true,
    title: closing ? t("close-account-title") : t("open-account-title"),
    message: closing
      ? t("account-will-close", { name: item.username })
      : t("account-will-open", { name: item.username }),
    confirmText: closing ? t("close") : t("open"),
    color: closing ? "warning" : "success",
    icon: closing ? "mdi-account-cancel-outline" : "mdi-account-check-outline",
    loading: false,
    action: () => doToggle(item),
  };
};

const runConfirm = async () => {
  if (!confirm.value.action) return;
  confirm.value.loading = true;
  try {
    await confirm.value.action();
    confirm.value.show = false;
  } catch (error) {
    console.error(error);
  } finally {
    confirm.value.loading = false;
  }
};

const doToggle = async (item: any) => {
  const next = item.statusRaw === "active" ? "inactive" : "active";
  await teacherStore.updateTeacher(item.uuid, { status: next });
  await teacherStore.fetchTeachers(100, 1);
};

const doDelete = async (item: any) => {
  await teacherStore.deleteTeacher(item.uuid);
  await teacherStore.fetchTeachers(100, 1);
};

// Editing opens a dedicated full page (like create), not a dialog.
const openEdit = (item: any) => {
  router.push(`/teachers/edit/${item.uuid}`);
};

</script>

<style scoped>
/* Filter row sits in a padded strip above the table. */
.list-toolbar {
  padding: 16px;
  border-bottom: 1px solid var(--ds-border-soft);
}

/* Avatar tile in the name column. */
.teacher-avatar {
  flex: 0 0 auto;
  background: var(--ds-navy-tint);
  border: 1px solid var(--ds-border);
}

/* Header cells keep their vertical centring (the shared header class adds a
   bottom padding that would nudge the label up). */
.premium-table :deep(.v-data-table__th) {
  padding-bottom: 0 !important;
}

/* Footer with "showing x-y of z" + page buttons. */
.list-footer {
  padding: 14px 16px 16px;
}
.pager {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}
.pager-btn {
  min-width: 32px !important;
  height: 32px !important;
  padding: 0 6px !important;
  border-radius: 8px !important;
  font-weight: 800;
}

@media (min-width: 960px) {
  .list-toolbar {
    padding: 20px 24px;
  }
  .list-footer {
    padding: 14px 24px 18px;
  }
  .premium-table :deep(.v-data-table__th:first-child),
  .premium-table :deep(.v-data-table__td:first-child) {
    padding-left: 24px;
  }
  .premium-table :deep(.v-data-table__th:last-child),
  .premium-table :deep(.v-data-table__td:last-child) {
    padding-right: 24px;
  }
}
</style>
