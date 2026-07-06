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
              class="text-subtitle-1 font-weight-black text-slate-900 tracking-tight line-height-1"
            >
              {{ t("schoolmanagement") }}
            </div>
            <div class="text-caption text-primary font-weight-bold">
              {{ t("management") }}
            </div>
          </div>
        </div>

        <div class="px-4 py-2 scroll-container">
          <!-- Navigation Sections -->
          <div
            v-for="(section, sIndex) in groupedMenuItems"
            :key="sIndex"
            class="mb-6"
          >
            <div
              class="px-4 mb-2 text-uppercase text-caption font-weight-black text-grey-lighten-1 tracking-widest"
            >
              {{ section.label }}
            </div>

            <v-list nav class="pa-0">
              <template v-for="item in section.items" :key="item.title">
                <!-- Expandable item with children -->
                <v-list-group v-if="item.children" :value="item.title">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      class="mb-1 modern-nav-item"
                      rounded="xl"
                    >
                      <template v-slot:prepend>
                        <v-icon size="20" class="mr-4">{{ item.icon }}</v-icon>
                      </template>
                      <v-list-item-title
                        class="text-subtitle-2 font-weight-bold"
                      >
                        {{ t(item.title) }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>

                  <v-list-item
                    v-for="child in item.children"
                    :key="child.title"
                    :to="child.to"
                    class="mb-1 modern-nav-item modern-nav-child"
                    rounded="xl"
                    active-class="active-item"
                  >
                    <template v-slot:prepend>
                      <v-icon size="18" class="mr-4">{{ child.icon }}</v-icon>
                    </template>
                    <v-list-item-title
                      class="text-subtitle-2 font-weight-bold"
                    >
                      {{ t(child.title) }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list-group>

                <!-- Flat item -->
                <v-list-item
                  v-else
                  :to="item.to"
                  class="mb-1 modern-nav-item"
                  rounded="xl"
                  active-class="active-item"
                  :exact="item.to === '/'"
                >
                  <template v-slot:prepend>
                    <v-icon size="20" class="mr-4">{{ item.icon }}</v-icon>
                  </template>
                  <v-list-item-title class="text-subtitle-2 font-weight-bold">
                    {{ t(item.title) }}
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-list>
          </div>
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

        <div class="d-none d-sm-flex align-center">
          <v-chip
            size="small"
            variant="flat"
            color="primary-lighten-5"
            class="text-primary font-weight-bold px-3"
          >
            v2.4.0
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
          <v-list class="modern-dropdown pa-2" width="180" rounded="xl">
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
          <v-list class="modern-dropdown pa-2" width="240" rounded="xl">
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
      <v-card rounded="xl" class="pa-4 overflow-hidden">
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

const apiAuthStore = useApiAuthStore();
const { logout } = apiAuthStore;

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
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

// Grouped Menu — Academic on top, with the Type group first.
const groupedMenuItems = ref<MenuSection[]>([
  {
    label: "Overview",
    items: [
      { title: "dashboard", icon: "mdi-view-dashboard-outline", to: "/" },
      { title: "reports", icon: "mdi-chart-box-outline", to: "/reports" },
    ],
  },
  {
    label: "Academic",
    items: [
      {
        title: "overview",
        icon: "mdi-chart-box-outline",
        to: "/overview",
      },
      {
        title: "type",
        icon: "mdi-shape-outline",
        children: [
          { title: "financial", icon: "mdi-wallet-outline", to: "/financial" },
          {
            title: "ethnic_group",
            icon: "mdi-account-group-outline",
            to: "/ethnic-group",
          },
          { title: "classes", icon: "mdi-google-classroom", to: "/class" },
        ],
      },
      {
        title: "students",
        icon: "mdi-account-school-outline",
        to: "/students",
      },
      { title: "enroll", icon: "mdi-account-plus-outline", to: "/students/add" },
      { title: "teachers", icon: "mdi-account-tie-outline", to: "/teachers" },
      { title: "subject", icon: "mdi-book-open-variant", to: "/subjects" },
      { title: "scores", icon: "mdi-star-outline", to: "/scores" },
      {
        title: "promotion",
        icon: "mdi-arrow-up-bold-box-outline",
        to: "/promotion",
      },
      { title: "academic", icon: "mdi-calendar-check", to: "/academic" },
    ],
  },
 
  {
    label: "Administration",
    items: [
      { title: "admin", icon: "mdi-shield-account-outline", to: "/admin" },
      { title: "settings", icon: "mdi-cog-outline", to: "/settings" },
    ],
  },
]);

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

/* Sidebar Styling */
.modern-sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.05) !important;
  z-index: 101 !important;
}

.sidebar-brand-wrapper .brand-logo-container {
  width: 44px;
  height: 44px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 8px 16px -6px rgba(15, 23, 42, 0.15);
  padding: 6px;
}

/* Nav Item Styling */
.modern-nav-item {
  color: #64748b !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0 16px !important;
  min-height: 44px !important;
}

.modern-nav-item:hover {
  background-color: #f1f5f9 !important;
  color: #0f172a !important;
}

/* Nested (child) items sit slightly indented under their parent group */
.modern-nav-child {
  padding-left: 28px !important;
}

.active-item {
  background: linear-gradient(
    135deg,
    rgba(20, 184, 166, 0.1) 0%,
    rgba(13, 148, 136, 0.05) 100%
  ) !important;
  color: #0d9488 !important;
  position: relative;
}

.active-item::after {
  content: "";
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 4px;
  background: #14b8a6;
  border-radius: 0 4px 4px 0;
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

/* Sidebar body flows naturally — no nested scroll region. */
.scroll-container {
  height: auto;
  overflow: visible;
}

/* Keep the drawer itself from scrolling; if the menu ever overflows on a very
   short screen it falls back to a thin scrollbar rather than a nested one. */
.modern-sidebar :deep(.v-navigation-drawer__content) {
  overflow-y: auto;
  scrollbar-width: thin;
}

.modern-sidebar :deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  width: 4px;
}

.modern-sidebar :deep(.v-navigation-drawer__content)::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
