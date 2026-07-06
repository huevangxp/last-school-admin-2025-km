<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div class="d-flex align-center">
        <v-avatar color="teal-lighten-5" size="44" class="mr-3 rounded-lg">
          <v-icon color="teal-darken-1" size="22">mdi-sitemap-outline</v-icon>
        </v-avatar>
        <div>
          <div class="text-title">Organization Chart</div>
          <div class="text-detail">Faculty hierarchy & reporting structure</div>
        </div>
      </div>

      <div class="d-flex gap-2 align-center mt-4 mt-md-0">
        <v-btn
          variant="flat"
          color="white"
          class="modern-action-btn secondary border"
          height="36"
          to="/teachers"
        >
          <v-icon icon="mdi-arrow-left" start size="18"></v-icon>
          {{ t("teachers") }}
        </v-btn>
        <v-btn
          variant="flat"
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="36"
          to="/teachers/add"
        >
          <v-icon icon="mdi-plus" start size="18"></v-icon>
          {{ t("add") }}
        </v-btn>
      </div>
    </div>

    <v-alert
      v-if="teacherStore.error"
      type="error"
      variant="tonal"
      density="compact"
      class="mb-4"
      >{{ teacherStore.error }}</v-alert
    >

    <v-card elevation="0" class="intelligence-card pa-4">
      <div v-if="teacherStore.loading" class="py-10 text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>

      <div v-else class="org-scroll pt-2">
        <div v-if="teachers.length" class="tree">
          <ul class="org-tree-root">
            <OrgNode :node="orgRoot" />
          </ul>
        </div>

        <div v-else class="text-detail py-10 text-center">
          No faculty members to display yet.
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useTeacherStore } from "~/stores/apiTeacher";

const { t } = useI18n();
const teacherStore = useTeacherStore();

onMounted(() => {
  teacherStore.fetchTeachers(100, 1);
});

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("teachers"), disabled: false, to: "/teachers" },
  { title: "Organization", disabled: true, to: "/teachers/organization" },
];

// Normalized faculty list.
const teachers = computed(() =>
  teacherStore.teachers.map((tc) => ({
    uuid: tc.id,
    username: tc.full_name || tc.username,
    image: tc.avatar,
    role: tc.role,
    status: capitalize(tc.status),
    position: tc.position || "",
    department: tc.department || "",
    managerId: tc.manager_id || null,
  }))
);

// Build a real reporting tree from manager_id, under a synthetic school root.
const orgRoot = computed(() => {
  const byId: Record<string, any> = {};
  teachers.value.forEach((tc) => {
    byId[tc.uuid] = {
      uuid: tc.uuid,
      name: tc.username,
      image: tc.image,
      title:
        tc.position ||
        (tc.role?.toLowerCase() === "admin" ? "Admin" : "Teacher"),
      department: tc.department,
      status: tc.status,
      children: [],
    };
  });

  const roots: any[] = [];
  teachers.value.forEach((tc) => {
    const node = byId[tc.uuid];
    const manager = tc.managerId ? byId[tc.managerId] : null;
    // Guard against a node being its own manager / broken references.
    if (manager && manager !== node) manager.children.push(node);
    else roots.push(node);
  });

  return {
    uuid: "__school__",
    isRoot: true,
    name: t("schoolmanagement"),
    title: t("management"),
    children: roots,
  };
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
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
  padding: 0 16px !important;
}

.modern-action-btn.primary {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
}

.gap-2 {
  gap: 8px;
}

/* Org chart wrapper (node styles live in OrgNode.vue) */
.org-scroll {
  overflow-x: auto;
  overflow-y: hidden;
}

.org-scroll::-webkit-scrollbar {
  height: 6px;
}
.org-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.tree {
  display: inline-block;
  min-width: 100%;
  padding: 0 8px;
}

.org-tree-root {
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
