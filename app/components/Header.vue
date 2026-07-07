<template>
  <div>
    <ClientOnly>
      <v-navigation-drawer
        v-model="drawer"
        width="280"
        class="modern-sidebar border-0"
        elevation="0"
        floating
        color="primary"
        theme="dark"
      >
        <!-- Sidebar Brand Wrapper -->
        <div class="sidebar-brand-wrapper px-6 py-8 d-flex align-center">
          <div class="brand-logo-container mr-3">
            <v-img
              src="/logo.png"
              alt="Logo"
              width="32"
              height="32"
              contain
            ></v-img>
          </div>
          <div class="brand-text">
            <div
              class="text-subtitle-1 font-weight-black text-white tracking-tight line-height-1"
            >
              {{ t("schoolmanagement") }}
            </div>
            <div class="text-caption brand-subtitle font-weight-bold">
              {{ t("management") }}
            </div>
          </div>
        </div>

        <div class="px-4 py-2 scroll-container">
          <!-- Navigation — each section is a collapsible dropdown -->
          <v-list nav class="pa-0" v-model:opened="openedGroups">
            <v-list-group
              v-for="section in groupedMenuItems"
              :key="section.label"
              :value="section.label"
              class="mb-2 nav-group"
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  class="mb-1 modern-nav-section"
                  rounded="0"
                >
                  <template v-slot:prepend>
                    <v-icon size="20" class="mr-4">{{ section.icon }}</v-icon>
                  </template>
                  <v-list-item-title
                    class="text-subtitle-2 font-weight-black tracking-wide"
                  >
                    {{ t(section.label) }}
                  </v-list-item-title>
                </v-list-item>
              </template>

              <!-- Section items -->
              <v-list-item
                v-for="item in section.items"
                :key="item.title"
                :to="item.to"
                class="mb-1 modern-nav-item modern-nav-child"
                rounded="0"
                active-class="active-item"
                :exact="item.to === '/'"
              >
                <template v-slot:prepend>
                  <v-icon size="18" class="mr-4">{{ item.icon }}</v-icon>
                </template>
                <v-list-item-title class="text-subtitle-2 font-weight-bold">
                  {{ t(item.title) }}
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
          </v-list>
        </div>

      </v-navigation-drawer>
    </ClientOnly>
    <v-app-bar elevation="0" height="72" class="px-6 glass-header">
      <div class="d-flex align-center">
        <v-btn
          icon="mdi-menu-variant"
          variant="text"
          color="slate-700"
          @click="drawer = !drawer"
          class="mr-4"
        ></v-btn>

        <div class="d-none d-sm-flex align-center ga-2">
          <v-chip
            size="small"
            variant="flat"
            color="primary-lighten-5"
            class="text-primary font-weight-bold px-3"
          >
            v2.4.0
          </v-chip>
          <v-chip
            v-if="classroomStore.latestAcademicYear"
            size="small"
            variant="flat"
            color="teal-lighten-5"
            class="text-teal-darken-2 font-weight-bold px-3"
            prepend-icon="mdi-calendar-check"
          >
            {{ classroomStore.latestAcademicYear.title }}
          </v-chip>
        </div>
      </div>

      <v-spacer></v-spacer>

      <!-- Global Search -->
      <div class="header-search d-none d-md-flex mr-8">
        <v-text-field
          :placeholder="t('search')"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          density="compact"
          hide-details
          class="modern-search-input"
          flat
          rounded="lg"
        ></v-text-field>
      </div>

      <!-- Action Icons -->
      <div class="d-flex align-center ga-4">
        <!-- Language Selector -->
        <v-menu location="bottom end" transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="rounded-lg px-2"
              height="44"
            >
              <v-avatar size="24" class="mr-2">
                <v-img :src="langFlag" cover></v-img>
              </v-avatar>
              <v-icon
                icon="mdi-chevron-down"
                size="16"
                color="grey-darken-1"
              ></v-icon>
            </v-btn>
          </template>
          <v-list class="modern-dropdown pa-2" width="180" rounded="lg">
            <v-list-item
              v-for="(item, index) in locales"
              :key="index"
              @click="setLanguage(item)"
              rounded="lg"
              class="mb-1"
              :active="item.name === langName"
              color="primary"
            >
              <template v-slot:prepend>
                <v-avatar size="20" class="mr-2">
                  <v-img :src="getFlag(item)" cover></v-img>
                </v-avatar>
              </template>
              <v-list-item-title class="text-subtitle-2 font-weight-bold">
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          icon="mdi-bell-outline"
          variant="text"
          color="slate-600"
          size="small"
          class="rounded-lg action-btn"
        >
          <v-badge dot color="error" offset-x="2" offset-y="2">
            <v-icon size="22">mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

        <v-divider vertical inset class="mx-2 my-4 opacity-10"></v-divider>

        <!-- Profile Menu -->
        <v-menu location="bottom end" transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <div
              v-bind="props"
              class="d-flex align-center cursor-pointer profile-trigger pa-1 pr-3 rounded-pill"
            >
              <v-avatar
                size="44"
                color="primary-lighten-5"
                class="elevation-2 border-2 border-white mr-3"
              >
                <v-img v-if="userAvatar" :src="userAvatar" cover></v-img>
                <span v-else class="text-primary font-weight-black">{{
                  userInitial
                }}</span>
              </v-avatar>
              <div class="d-none d-lg-block">
                <div
                  class="text-subtitle-2 font-weight-black line-height-1 mb-1 text-capitalize"
                >
                  {{ username }}
                </div>
                <div class="text-caption text-grey-darken-1 text-capitalize">
                  {{ role }}
                </div>
              </div>
              <v-icon
                icon="mdi-chevron-down"
                size="16"
                class="d-none d-lg-block ml-3 opacity-50"
              ></v-icon>
            </div>
          </template>
          <v-list class="modern-dropdown pa-2" width="240" rounded="lg">
            <div class="px-3 py-2">
              <div class="text-subtitle-2 font-weight-black text-capitalize">
                {{ username }}
              </div>
              <div class="text-caption text-grey-darken-1 text-capitalize">
                {{ role }}
              </div>
            </div>
            <v-divider class="mb-2"></v-divider>
            <v-list-item
              rounded="lg"
              class="mb-1"
              prepend-icon="mdi-account-outline"
              to="/admin"
            >
              <v-list-item-title class="text-subtitle-2">{{
                t("information")
              }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              rounded="lg"
              class="mb-1"
              prepend-icon="mdi-cog-outline"
              to="/settings"
            >
              <v-list-item-title class="text-subtitle-2">{{
                t("settings")
              }}</v-list-item-title>
            </v-list-item>
            <v-divider class="my-2"></v-divider>
            <v-list-item
              rounded="lg"
              color="error"
              class="mb-1"
              @click="logoutDialog = true"
            >
              <template v-slot:prepend>
                <v-icon color="error">mdi-logout-variant</v-icon>
              </template>
              <v-list-item-title
                class="text-subtitle-2 font-weight-bold text-error"
              >
                {{ t("logout") }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
    <!-- Logout Confirmation -->
    <v-dialog v-model="logoutDialog" width="400">
      <v-card rounded="lg" class="pa-4 overflow-hidden">
        <div class="text-center py-6">
          <v-avatar color="red-lighten-5" size="72" class="mb-4">
            <v-icon icon="mdi-logout-variant" color="red" size="36"></v-icon>
          </v-avatar>
          <h3 class="text-h6 font-weight-black mb-2">Sign Out?</h3>
          <p class="text-body-2 text-grey-darken-1 px-6">
            Are you sure you want to log out of your admin session?
          </p>
        </div>
        <v-card-actions class="ga-3 px-4 pb-4">
          <v-btn
            block
            variant="flat"
            color="red"
            class="rounded-lg font-weight-bold"
            height="44"
            @click="logoutButton"
            >Yes, Sign Out</v-btn
          >
          <v-btn
            block
            variant="text"
            color="grey-darken-1"
            class="rounded-lg font-weight-bold"
            height="44"
            @click="logoutDialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useApiAuthStore } from "~/stores/apiAuth";
import { useClassroomStore } from "~/stores/apiClassroom";

const apiAuthStore = useApiAuthStore();
const { logout } = apiAuthStore;

// Current academic year shown as a chip in the top bar.
const classroomStore = useClassroomStore();
onMounted(() => {
  if (!classroomStore.academicYears.length) {
    classroomStore.fetchAcademicYears();
  }
});

const langName = useCookie("lang_name", { default: () => "English" });
const langFlag = useCookie("lang_flag", { default: () => "/eng.png" });
const { locales, setLocale, t } = useI18n();

// Logged-in user (set on login in apiAuth store)
const username = useCookie<string>("username", { default: () => "Admin" });
const role = useCookie<string>("role", { default: () => "Administrator" });
const avatarCookie = useCookie<string>("avatar");

const isEmpty = (v?: string | null) =>
  !v || v === "null" || v === "undefined" || v === "";

const userAvatar = computed(() =>
  isEmpty(avatarCookie.value) ? "" : avatarCookie.value
);
const userInitial = computed(() =>
  (username.value || "A").charAt(0).toUpperCase()
);

const logoutDialog = ref(false);
const drawer = ref(true);

const getFlag = (item: any) => item.flag || "/eng.png";

const setLanguage = (data: any) => {
  setLocale(data.code);
  langName.value = data.name;
  langFlag.value = data.flag;
};

interface MenuItem {
  title: string;
  icon: string;
  to?: string;
  children?: MenuItem[];
  adminOnly?: boolean;
}

interface MenuSection {
  label: string;
  icon: string;
  adminOnly?: boolean;
  items: MenuItem[];
}

// Whether the current user is an admin. Teachers get a reduced menu limited to
// the things they can act on (score entry/report + their class organization).
// Falls back to admin for a missing/legacy role cookie so nothing is hidden by
// accident; a real teacher's cookie is set to "teacher" on login.
const isAdmin = computed(() =>
  ["admin", "administrator"].includes((role.value || "").toLowerCase())
);

// Full menu with per-item / per-section admin gating.
const allMenuSections: MenuSection[] = [
  {
    label: "overview",
    icon: "mdi-view-dashboard-outline",
    items: [
      { title: "dashboard", icon: "mdi-view-dashboard-outline", to: "/" },
      { title: "reports", icon: "mdi-chart-box-outline", to: "/reports", adminOnly: true },
      { title: "overview", icon: "mdi-chart-box-outline", to: "/overview", adminOnly: true },
    ],
  },
  {
    label: "classes",
    icon: "mdi-google-classroom",
    items: [
      { title: "classes", icon: "mdi-google-classroom", to: "/class", adminOnly: true },
      { title: "students", icon: "mdi-account-school-outline", to: "/students", adminOnly: true },
      { title: "enroll", icon: "mdi-account-plus-outline", to: "/students/add", adminOnly: true },
      { title: "promotion", icon: "mdi-arrow-up-bold-box-outline", to: "/promotion", adminOnly: true },
      { title: "class_organization", icon: "mdi-account-supervisor-outline", to: "/class/organization" },
    ],
  },
  {
    label: "academic_section",
    icon: "mdi-book-education-outline",
    items: [
      { title: "subject", icon: "mdi-book-open-variant", to: "/subjects", adminOnly: true },
      { title: "teaching_assignments", icon: "mdi-clipboard-account-outline", to: "/teaching", adminOnly: true },
      { title: "scores", icon: "mdi-star-outline", to: "/scores" },
      { title: "score_report", icon: "mdi-table-large", to: "/scores/report" },
      { title: "academic", icon: "mdi-calendar-check", to: "/academic", adminOnly: true },
    ],
  },
  {
    label: "faculty",
    icon: "mdi-account-tie-outline",
    adminOnly: true,
    items: [
      { title: "teachers", icon: "mdi-account-tie-outline", to: "/teachers" },
      { title: "organization", icon: "mdi-sitemap-outline", to: "/teachers/organization" },
    ],
  },
  {
    label: "configuration",
    icon: "mdi-tune-variant",
    adminOnly: true,
    items: [
      { title: "financial", icon: "mdi-wallet-outline", to: "/financial" },
      { title: "ethnic_group", icon: "mdi-account-group-outline", to: "/ethnic-group" },
    ],
  },
  {
    label: "manage_website",
    icon: "mdi-web",
    adminOnly: true,
    items: [
      { title: "news", icon: "mdi-newspaper-variant-outline", to: "/news" },
      { title: "activities", icon: "mdi-calendar-star", to: "/activities" },
      { title: "new_academic_year", icon: "mdi-calendar-plus", to: "/academic/add" },
    ],
  },
  {
    label: "administration",
    icon: "mdi-shield-account-outline",
    items: [
      { title: "admin", icon: "mdi-shield-account-outline", to: "/admin", adminOnly: true },
      { title: "settings", icon: "mdi-cog-outline", to: "/settings" },
    ],
  },
];

// The menu the current user actually sees: drop admin-only sections/items for
// teachers, then drop any section left with no items.
const groupedMenuItems = computed<MenuSection[]>(() =>
  allMenuSections
    .filter((sec) => isAdmin.value || !sec.adminOnly)
    .map((sec) => ({
      ...sec,
      items: sec.items.filter((it) => isAdmin.value || !it.adminOnly),
    }))
    .filter((sec) => sec.items.length > 0)
);

// Which section dropdowns are expanded. Default: all open, initialised once so a
// user's manual collapse isn't clobbered on later reactivity.
const openedGroups = ref<string[]>([]);
let groupsInited = false;
watch(
  groupedMenuItems,
  (secs) => {
    if (!groupsInited && secs.length) {
      openedGroups.value = secs.map((s) => s.label);
      groupsInited = true;
    }
  },
  { immediate: true }
);

const logoutButton = () => {
  logout();
  logoutDialog.value = false;
};
</script>

<style scoped>
/* Glassmorphism Header */
.glass-header {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 100 !important;
}

/* Sidebar Styling — primary (teal) gradient background */
.modern-sidebar {
  background: linear-gradient(180deg, #14b8a5 0%, #0d9488 55%, #0b7d72 100%) !important;
  border-right: 0 !important;
  z-index: 101 !important;
}

.sidebar-brand-wrapper {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.sidebar-brand-wrapper .brand-logo-container {
  width: 44px;
  height: 44px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0 8px 16px -6px rgba(0, 0, 0, 0.25);
  padding: 6px;
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.75) !important;
}

/* Section header labels */
.sidebar-section-label {
  color: rgba(255, 255, 255, 0.55) !important;
}

/* Collapsible section header (dropdown toggle) */
.modern-nav-section {
  color: #ffffff !important;
  padding: 0 16px !important;
  min-height: 48px !important;
  transition: background-color 0.2s ease;
}
.modern-nav-section :deep(.v-icon) {
  color: rgba(255, 255, 255, 0.92) !important;
}
.modern-nav-section :deep(.v-list-item-title) {
  color: rgba(255, 255, 255, 0.95) !important;
  letter-spacing: 0.02em;
}
.modern-nav-section:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
.tracking-wide {
  letter-spacing: 0.02em;
}

/* Nav Item Styling */
.modern-nav-item {
  color: rgba(255, 255, 255, 0.85) !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0 16px !important;
  min-height: 44px !important;
}

.modern-nav-item :deep(.v-icon) {
  color: rgba(255, 255, 255, 0.85) !important;
}

.modern-nav-item:hover {
  background-color: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
}

.modern-nav-item:hover :deep(.v-icon) {
  color: #ffffff !important;
}

/* Expand / collapse chevron on group headers stays legible on teal */
.modern-sidebar :deep(.v-list-group__header .v-list-item__append .v-icon) {
  color: rgba(255, 255, 255, 0.7) !important;
  opacity: 1;
}

/* Nested (child) items sit slightly indented under their parent group */
.modern-nav-child {
  padding-left: 28px !important;
}

/* Faint guide line down the open child group */
.modern-sidebar :deep(.v-list-group__items) {
  position: relative;
}

.modern-sidebar :deep(.v-list-group__items)::before {
  content: "";
  position: absolute;
  left: 26px;
  top: 4px;
  bottom: 4px;
  width: 1px;
  background: rgba(255, 255, 255, 0.15);
}

/* Active item: soft light-teal tint pill with white text */
.active-item {
  background: rgba(255, 255, 255, 0.18) !important;
  color: #ffffff !important;
  position: relative;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
}

.active-item :deep(.v-icon) {
  color: #ffffff !important;
}

.active-item :deep(.v-list-item-title) {
  color: #ffffff !important;
  font-weight: 800 !important;
}

/* Search Input */
.modern-search-input {
  width: 280px;
  transition: width 0.3s ease;
}

.modern-search-input :deep(.v-field) {
  background-color: #f1f5f9 !important;
  border-radius: 12px !important;
}

.modern-search-input :deep(.v-field--focused) {
  width: 320px;
  background-color: white !important;
  box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2) !important;
}

/* Profile Trigger */
.profile-trigger {
  transition: background 0.2s ease;
}

.profile-trigger:hover {
  background-color: #f8fafc;
}

/* Typography & Layout Utils */
.line-height-1 {
  line-height: 1;
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.tracking-widest {
  letter-spacing: 0.1em;
}

.modern-dropdown {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.border-dashed {
  border: 1.5px dashed rgba(20, 184, 166, 0.2) !important;
}

/* Drawer is a flex column: the brand stays fixed and the nav list scrolls, so
   every menu item stays reachable no matter how many dropdowns are open. */
.modern-sidebar :deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.sidebar-brand-wrapper {
  flex: 0 0 auto;
}

.scroll-container {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
}

.scroll-container::-webkit-scrollbar {
  width: 5px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}
</style>
