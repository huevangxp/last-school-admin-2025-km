<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-8"
    >
      <div>
        <h1
          class="text-h4 font-weight-bold text-secondary mb-1"
          style="letter-spacing: -0.5px"
        >
          {{ t("management") }} {{ t("ethnic_group") }}
        </h1>
        <p class="text-body-2 text-grey-darken-1 font-weight-medium">
          Manage ethnic group classifications and records.
        </p>
      </div>

      <div class="d-flex gap-3 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          class="text-none font-weight-bold"
          height="44"
          rounded="xl"
          prepend-icon="mdi-tray-arrow-down"
          border
        >
          {{ t("export") }}
        </v-btn>

        <v-btn
          color="primary"
          class="text-none px-6 font-weight-bold"
          height="44"
          rounded="xl"
          elevation="4"
          prepend-icon="mdi-plus"
          to="/ethnic-group/add"
        >
          {{ t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card
          class="bean-card pa-5 d-flex flex-column justify-space-between h-100"
          elevation="0"
          rounded="xl"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p
                class="text-caption font-weight-bold text-grey text-uppercase mb-1 tracking-wide"
              >
                {{ t("total") }}
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">
                {{ total }}
              </h2>
            </div>
            <v-avatar
              color="blue-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="blue-darken-2" size="26"
                >mdi-account-group-outline</v-icon
              >
            </v-avatar>
          </div>
          <div class="d-flex align-center mt-2">
            <span class="text-caption font-weight-medium text-grey-darken-1"
              >Registered groups</span
            >
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card elevation="0" rounded="xl" class="bean-card pa-6">
      <!-- Search and Filter Section -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-8 gap-4"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :placeholder="t('search')"
          variant="outlined"
          density="comfortable"
          hide-details
          class="cream-input"
          style="max-width: 380px"
          bg-color="white"
          color="primary"
          base-color="grey-lighten-1"
          rounded="lg"
        ></v-text-field>
      </div>

      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="ethnicGroups"
        :search="search"
        class="ethnic-table"
        hover
      >
        <!-- ID Slot -->
        <template v-slot:item.id="{ item, index }">
          <span
            class="font-weight-bold text-secondary bg-grey-lighten-4 px-3 py-1 rounded"
            >{{ offset + index + 1 }}</span
          >
        </template>

        <!-- Title Slot -->
        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="grey-lighten-4"
              size="46"
              class="mr-4 rounded-lg border-white shadow-sm"
            >
              <v-icon
                icon="mdi-text-box-outline"
                size="24"
                color="secondary"
              ></v-icon>
            </v-avatar>
            <div>
              <div class="text-secondary text-subtitle-2 font-weight-bold">
                {{ getItemRaw(item).title }}
              </div>
              <div
                class="text-caption text-grey-darken-1 font-weight-medium text-uppercase tracking-wide"
              >
                ID: {{ hiddenId(String(getItemRaw(item).id)) }}
              </div>
            </div>
          </div>
        </template>

        <!-- Action Slot -->
        <template v-slot:item.action="{ item }">
          <div class="d-flex align-center">
            <v-btn
              icon
              size="small"
              variant="text"
              color="grey-darken-1"
              class="mr-1"
              :to="`/ethnic-group/${getItemRaw(item).id}`"
            >
              <v-icon icon="mdi-pencil-outline"></v-icon>
              <v-tooltip activator="parent" location="top">Edit</v-tooltip>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="text"
              color="error"
              @click="deleteItem(getItemRaw(item).id)"
            >
              <v-icon icon="mdi-delete-outline"></v-icon>
              <v-tooltip activator="parent" location="top">Delete</v-tooltip>
            </v-btn>
          </div>
        </template>

        <!-- Bottom Pagination Slot -->
        <template v-slot:bottom>
          <div
            class="d-flex flex-column flex-md-row align-center justify-space-between pt-8 border-t"
          >
            <div
              class="text-caption text-grey-darken-1 font-weight-bold mb-4 mb-md-0"
            >
              {{ t("showing") }}
              <span class="text-secondary"
                >{{ offset + 1 }}-{{ Math.min(offset + limit, total) }}</span
              >
              {{ t("of") }}
              <span class="text-secondary">{{ total }}</span>
              {{ t("results") }}
            </div>

            <div class="d-flex gap-2 align-center">
              <v-btn
                icon
                variant="outlined"
                color="grey-lighten-1"
                size="small"
                rounded="lg"
                @click="prevPage"
                :disabled="offset === 0"
                class="mr-2"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <v-btn
                color="primary"
                size="small"
                elevation="2"
                class="font-weight-bold"
                rounded="lg"
                style="min-width: 36px; height: 36px"
              >
                {{ Math.floor(offset / limit) + 1 }}
              </v-btn>

              <v-btn
                icon
                variant="outlined"
                color="grey-lighten-1"
                size="small"
                rounded="lg"
                @click="nextPage"
                :disabled="offset + limit >= total"
                class="ml-2"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useEthnicGroupStore } from "@/stores/apiEthnicGroup";
import { hiddenId } from "@/utils/formatDate";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const search = ref("");

const limit = ref(10);
const offset = ref(0);

// const ethnicGroups = ref([]);

const ethnicGroupStore = useEthnicGroupStore();
const { fetchEthnicGroups } = ethnicGroupStore;
const { ethnicGroups, total } = storeToRefs(ethnicGroupStore);

const deleteItem = async (id: number) => {
  if (confirm(t("are_you_sure_delete"))) {
    await ethnicGroupStore.deleteEthnicGroup(id);
    fetchEthnicGroups(limit.value, offset.value);
  }
};

const getItemRaw = (item: any) => {
  return item.raw || item;
};

const nextPage = () => {
  if (offset.value + limit.value < total.value) {
    offset.value += limit.value;
    fetchEthnicGroups(limit.value, offset.value);
  }
};

const prevPage = () => {
  if (offset.value > 0) {
    offset.value -= limit.value;
    fetchEthnicGroups(limit.value, offset.value);
  }
};

onMounted(() => {
  fetchEthnicGroups(limit.value, offset.value);
});
const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("ethnic_group"), disabled: true, to: "/ethnic-group" },
];

const headers = [
  {
    title: t("id"),
    key: "id",
    align: "start" as const,
    sortable: true,
  },
  {
    title: t("name"), // Assuming 'name' key exists or using fallback
    key: "title",
    align: "start" as const,
    sortable: true,
  },

  {
    title: t("action"),
    key: "action",
    align: "start" as const,
    sortable: false,
  },
].map((h) => ({
  ...h,
  class:
    "text-caption font-weight-bold text-grey-darken-1 pb-4 text-uppercase tracking-wider",
}));
</script>

<style scoped>
/* Cream UI Variables */
.dashboard-container {
  /* --cream-bg: #fafaf5; */
}

.gap-4 {
  gap: 16px;
}
.gap-3 {
  gap: 12px;
}
.gap-2 {
  gap: 8px;
}

/* Bean Card Styling */
.bean-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0 !important;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
  transition: all 0.3s ease;
}

.bean-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 4px 6px -2px rgba(0, 0, 0, 0.025) !important;
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}

/* Table Styling */
:deep(.v-data-table) {
  background: transparent !important;
}

:deep(.v-data-table__tr:hover .v-data-table__td) {
  background-color: #f8fafc !important; /* Soft Slate Hover */
}

:deep(.v-data-table__th) {
  background-color: transparent !important;
  border-bottom: 1px solid #e2e8f0 !important;
}

:deep(.v-data-table__td) {
  border-bottom: 1px solid #f1f5f9 !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  height: 72px !important;
}

/* Input Customization */
.cream-input :deep(.v-field__outline__start),
.cream-input :deep(.v-field__outline__end),
.cream-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.cream-input :deep(.v-field--focused .v-field__outline__start),
.cream-input :deep(.v-field--focused .v-field__outline__end),
.cream-input :deep(.v-field--focused .v-field__outline__notch) {
  border-color: rgb(var(--v-theme-primary)) !important;
  border-width: 1px !important;
}

/* Typography Tools */
.tracking-wide {
  letter-spacing: 0.05em;
}
.tracking-wider {
  letter-spacing: 0.08em;
}

.border-white {
  border: 2px solid #ffffff;
}
.border-t {
  border-top: 1px solid #e2e8f0;
}
.shadow-sm {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
