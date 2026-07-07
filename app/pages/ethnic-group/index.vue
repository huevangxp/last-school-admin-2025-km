<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <div class="text-title mb-1">
          {{ t("management") }} {{ t("ethnic_group") }}
        </div>
        <div class="text-detail">
          Manage ethnic group classifications and records.
        </div>
      </div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          class="modern-action-btn secondary border"
          height="32"
          prepend-icon="mdi-tray-arrow-down"
        >
          {{ t("export") }}
        </v-btn>

        <v-btn
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="32"
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
          class="metric-card pa-4 d-flex flex-column justify-space-between h-100"
          elevation="0"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p class="text-detail-tiny mb-1">
                {{ t("total") }}
              </p>
              <h2 class="text-title">{{ total }}</h2>
            </div>
            <v-avatar
              color="blue-lighten-5"
              rounded="lg"
              size="40"
              class="metric-icon-box"
            >
              <v-icon color="blue-darken-2" size="18"
                >mdi-account-group-outline</v-icon
              >
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card elevation="0" class="intelligence-card pa-4">
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
      </div>

      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="ethnicGroups"
        :search="search"
        class="premium-table"
        hover
      >
        <template v-slot:item.id="{ index }">
          <span class="text-detail-tiny bg-grey-lighten-4 px-2 py-1 rounded">
            {{ offset + index + 1 }}
          </span>
        </template>

        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="grey-lighten-4"
              size="32"
              class="mr-3 elevation-1 border-white"
            >
              <v-icon
                icon="mdi-text-box-outline"
                size="16"
                color="secondary"
              ></v-icon>
            </v-avatar>
            <div>
              <div class="text-title-small">
                {{ getItemRaw(item).title }}
              </div>
              <div class="text-detail-tiny">
                ID: {{ hiddenId(String(getItemRaw(item).id)) }}
              </div>
            </div>
          </div>
        </template>

        <template v-slot:item.action="{ item }">
          <v-btn
            icon="mdi-pencil-outline"
            size="x-small"
            variant="text"
            color="primary"
            class="mr-1"
            :to="`/ethnic-group/${getItemRaw(item).id}`"
          ></v-btn>
          <v-btn
            icon="mdi-delete-outline"
            size="x-small"
            variant="text"
            color="error"
            @click="deleteItem(getItemRaw(item).id)"
          ></v-btn>
        </template>

        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pt-4 border-t">
            <div class="text-detail-tiny">
              Showing {{ offset + 1 }}-{{ Math.min(offset + limit, total) }} of
              {{ total }} results
            </div>
            <div class="d-flex gap-1 align-center">
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                color="grey-darken-1"
                size="x-small"
                @click="prevPage"
                :disabled="offset === 0"
              ></v-btn>

              <v-btn
                color="primary"
                size="x-small"
                variant="flat"
                class="font-weight-black rounded-md"
                style="min-width: 24px; height: 24px"
              >
                {{ Math.floor(offset / limit) + 1 }}
              </v-btn>

              <v-btn
                icon="mdi-chevron-right"
                variant="text"
                color="grey-darken-1"
                size="x-small"
                @click="nextPage"
                :disabled="offset + limit >= total"
              ></v-btn>
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
import { useUiStore } from "~/stores/ui";
import { hiddenId } from "@/utils/formatDate";
const { t } = useI18n();
const ui = useUiStore();

const search = ref("");
const limit = ref(10);
const offset = ref(0);

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
  { title: t("id"), key: "id", align: "start" as const, sortable: true },
  { title: t("name"), key: "title", align: "start" as const, sortable: true },
  { title: "", key: "action", align: "end" as const, sortable: false },
].map((h) => ({
  ...h,
  class: "text-detail-tiny pb-2",
}));
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.modern-action-btn {
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 12px !important;
  padding: 0 12px !important;
}

.modern-action-btn.primary {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
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
