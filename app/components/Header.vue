<template>
  <div>
    <v-app-bar
      color="white"
      elevation="0"
      height="80"
      class="px-5"
      density="compact"
    >
      <v-icon color="primary">mdi-book</v-icon>
      <v-toolbar-title class="font-weight-bold text-secondary"
        >ມ.ສ ກາງໃໝ່</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            height="40"
            width="140"
            class="ml-4 align-center"
          >
            <div class="mr-2 d-flex align-center justify-center">
              <v-img
                :src="langFlag"
                width="30"
                height="30"
                class="mr-2"
              ></v-img>
              <p class="font-weight-semibold" style="font-size: 16px">
                <span>{{ langName }}</span>
              </p>
            </div>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in locales"
            :key="index"
            @click="setLanguage(item)"
          >
            <div class="mx-auto">
              <v-img :src="getFlag(item)" width="30" height="30"></v-img>
              <p class="font-weight-semibold ma-0" style="font-size: 16px">
                {{ item.name }}
              </p>
            </div>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon color="secondary">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>
    <ClientOnly>
      <v-navigation-drawer
        v-model="drawer"
        width="256"
        class="sidebar"
        persistent
      >
        <v-list class="px-4 py-4" nav>
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :to="item.to"
            class="mb-2 rounded-lg"
            active-class="bg-primary text-white"
            :exact="item.to === '/'"
          >
            <template v-slot:prepend>
              <v-icon>{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title
              class="font-weight-semibold"
              style="font-size: 16px"
            >
              <span> {{ t(item.title) }}</span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="user-profile">
            <div class="d-flex align-center ga-3">
              <v-avatar size="40">
                <v-img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZa1BqD943Cz_nb3fZ0bc9PyOOvdt8sHdy_-M-e-ZFonb_RtKd97pIOeLha6GZ3MtnseeSPtt8TZk8DixN2gs_w1uS3nqYx4EwL-jfX2EYJbBoSDcwVNklTfhlItCwz5c4Qzof1hDBipAxXRa-H4dfRaYiOOF7zFvRcIO85IHhFfLruNJr4tdEo29YPc7EYuB83BQ-_7LR1LR_25q1YNwXSTeoWclOhIFCPoJxGKAkAWhBMel3re2598v4nFU4-QSnrFK01yF9ZW8"
                  alt="Admin user avatar"
                />
              </v-avatar>
              <div>
                <p class="text-body-2 font-weight-semibold mb-0">
                  <span>Huevang</span>
                </p>
                <p class="text-caption text-medium-emphasis mb-0">
                  <span>Admin</span>
                </p>
              </div>
            </div>
          </div>
        </template>
      </v-navigation-drawer>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const langName = useCookie("lang_name", { default: () => "English" });
const langFlag = useCookie("lang_flag", { default: () => "/eng.png" });
const { locales, setLocale, t } = useI18n();

const getFlag = (item: any) => {
  return item.flag || "/eng.png";
};

const setLanguage = (data: any) => {
  setLocale(data.code);
  langName.value = data.name;
  langFlag.value = data.flag;
};

const drawer = ref(true);

const menuItems = ref([
  {
    title: "dashboard",
    icon: "mdi-view-dashboard",
    to: "/",
  },
  {
    title: "academic",
    icon: "mdi-book",
    to: "/academic",
  },
  {
    title: "students",
    icon: "mdi-school",
    to: "/students",
  },
  {
    title: "teachers",
    icon: "mdi-account-group",
    to: "/teachers",
  },
  {
    title: "classes",
    icon: "mdi-google-classroom",
    to: "/class",
  },
  {
    title: "subject",
    icon: "mdi-calendar-month",
    to: "/subjects",
  },
  {
    title: "scores",
    icon: "mdi-calendar-month",
    to: "/scores",
  },
  {
    title: "financial",
    icon: "mdi-currency-usd",
    to: "/financial",
  },
  {
    title: "reports",
    icon: "mdi-file-document-multiple",
    to: "/reports",
  },
  {
    title: "settings",
    icon: "mdi-cog",
    to: "/settings",
  },
]);
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  height: 80px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.12);
}

.user-profile {
  padding: 16px 24px;
  border-top: 1px solid rgb(var(--v-theme-on-surface), 0.12);
}

:deep(.v-list-item--active) {
  background-color: rgb(var(--v-theme-primary), 0.1);
}

:deep(.v-list-item:not(.v-list-item--active):hover) {
  background-color: rgb(var(--v-theme-primary), 0.1);
}
</style>
