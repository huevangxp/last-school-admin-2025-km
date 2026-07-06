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

      <template v-else>
        <!-- Zoom controls -->
        <div v-if="teachers.length" class="d-flex justify-end mb-2">
          <div class="zoom-bar d-flex align-center">
            <v-btn
              icon="mdi-minus"
              variant="text"
              size="small"
              :disabled="zoom <= MIN_ZOOM"
              @click="zoomOut"
            ></v-btn>
            <span
              class="zoom-label text-detail-tiny font-weight-black"
              @click="resetZoom"
              title="Reset"
              >{{ Math.round(zoom * 100) }}%</span
            >
            <v-btn
              icon="mdi-plus"
              variant="text"
              size="small"
              :disabled="zoom >= MAX_ZOOM"
              @click="zoomIn"
            ></v-btn>
            <v-divider vertical class="mx-1"></v-divider>
            <v-btn
              icon="mdi-fit-to-screen-outline"
              variant="text"
              size="small"
              title="Reset zoom"
              @click="resetZoom"
            ></v-btn>
          </div>
        </div>

        <div class="org-scroll pt-2" @wheel="onWheel">
          <div v-if="teachers.length" class="tree" :style="treeStyle">
            <ul class="org-tree-root">
              <OrgNode :node="orgRoot" />
            </ul>
          </div>

          <div v-else class="text-detail py-10 text-center">
            No faculty members to display yet.
          </div>
        </div>
      </template>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTeacherStore } from "~/stores/apiTeacher";

const { t } = useI18n();
const teacherStore = useTeacherStore();

onMounted(() => {
  teacherStore.fetchTeachers(100, 1);
});

// ---- Zoom ----
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 1.6;
const ZOOM_STEP = 0.1;
const zoom = ref(1);

const clampZoom = (v: number) =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(v * 100) / 100));
const zoomIn = () => (zoom.value = clampZoom(zoom.value + ZOOM_STEP));
const zoomOut = () => (zoom.value = clampZoom(zoom.value - ZOOM_STEP));
const resetZoom = () => (zoom.value = 1);

// Ctrl/⌘ + wheel zooms; plain wheel scrolls normally.
const onWheel = (e: WheelEvent) => {
  if (!e.ctrlKey && !e.metaKey) return;
  e.preventDefault();
  zoom.value = clampZoom(zoom.value + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
};

// `zoom` (CSS) scales layout so the scroll container tracks the new size.
const treeStyle = computed(() => ({ zoom: zoom.value }));

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
    layer: tc.layer ?? null,
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
      explicitLayer: tc.layer, // admin-assigned Layer 1–5 (may be null)
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

  // Layer per node: use the admin-assigned layer when set, otherwise fall back
  // to the depth in the reporting tree (top-level = 1, each level deeper +1).
  const assignLayers = (nodes: any[], layer: number) => {
    nodes.forEach((n) => {
      n.layer = n.explicitLayer ?? layer;
      if (n.children?.length) assignLayers(n.children, layer + 1);
    });
  };
  assignLayers(roots, 1);

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
