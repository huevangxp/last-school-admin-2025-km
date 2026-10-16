<template>
  <div class="page">
    <PageHeader
      :title="`${t('management')} ${t('ethnic_group')}`"
      :subtitle="t('manage-ethnic-group-records')"
      icon="mdi-account-group-outline"
      :breadcrumbs="breadcrumbs"
    >
      <template #actions>
        <v-btn
          variant="flat"
          class="modern-action-btn secondary"
          prepend-icon="mdi-tray-arrow-down"
        >
          {{ t("export") }}
        </v-btn>
        <v-btn
          variant="flat"
          class="modern-action-btn primary"
          prepend-icon="mdi-plus"
          to="/ethnic-group/add"
        >
          {{ t("add") }}
        </v-btn>
      </template>
    </PageHeader>

    <!-- KPIs -->
    <v-row class="mb-2 fade-in">
      <v-col cols="6" lg="3">
        <StatCard
          icon="mdi-account-group-outline"
          :label="t('total')"
          :value="total"
        />
      </v-col>
    </v-row>

    <!-- List -->
    <v-card elevation="0" class="panel panel--flush fade-in">
      <div class="px-4 px-md-6 pt-4 pt-md-6">
        <div class="filter-bar">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            :placeholder="t('search')"
            variant="outlined"
            density="comfortable"
            hide-details
            class="filter-search"
            color="primary"
          ></v-text-field>
          <div class="filter-spacer"></div>
          <span class="panel-chip">{{ total }} {{ t("total") }}</span>
        </div>
      </div>

      <div class="table-wrap">
        <v-data-table
          :headers="headers"
          :items="ethnicGroups"
          :search="search"
          class="premium-table"
          hover
        >
          <template v-slot:no-data>
            <div class="pa-4">
              <EmptyState
                icon="mdi-account-group-outline"
                :title="t('no-data')"
              />
            </div>
          </template>

          <template v-slot:item.id="{ index }">
            <span class="code-chip">{{ offset + index + 1 }}</span>
          </template>

          <template v-slot:item.title="{ item }">
            <div class="d-flex align-center ga-3 py-2">
              <div class="avatar-chip">
                <v-icon icon="mdi-text-box-outline" size="18"></v-icon>
              </div>
              <div class="min-w-0">
                <div class="cell-title">
                  {{ getItemRaw(item).title }}
                </div>
                <div class="cell-sub">
                  ID: {{ hiddenId(String(getItemRaw(item).id)) }}
                </div>
              </div>
            </div>
          </template>

          <template v-slot:item.action="{ item }">
            <div class="row-actions">
              <v-btn
                icon="mdi-pencil-outline"
                size="small"
                variant="text"
                color="primary"
                :to="`/ethnic-group/${getItemRaw(item).id}`"
              ></v-btn>
              <v-btn
                icon="mdi-delete-outline"
                size="small"
                variant="text"
                color="error"
                @click="deleteItem(getItemRaw(item).id)"
              ></v-btn>
            </div>
          </template>

          <template v-slot:bottom>
            <div class="table-footer px-4 px-md-6 pb-4">
              <div class="cell-sub">
                {{
                  t("showing-results", {
                    from: offset + 1,
                    to: Math.min(offset + limit, total),
                    total,
                  })
                }}
              </div>
              <div class="d-flex ga-1 align-center">
                <v-btn
                  icon="mdi-chevron-left"
                  variant="text"
                  size="small"
                  @click="prevPage"
                  :disabled="offset === 0"
                ></v-btn>

                <v-btn
                  color="primary"
                  size="small"
                  variant="flat"
                  class="font-weight-black rounded-lg"
                  min-width="32"
                >
                  {{ Math.floor(offset / limit) + 1 }}
                </v-btn>

                <v-btn
                  icon="mdi-chevron-right"
                  variant="text"
                  size="small"
                  @click="nextPage"
                  :disabled="offset + limit >= total"
                ></v-btn>
              </div>
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </div>
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
  const ok = await ui.confirm({
    message: t("are_you_sure_delete"),
    confirmText: t("delete"),
    icon: "mdi-delete-outline",
  });
  if (!ok) return;
  try {
    await ethnicGroupStore.deleteEthnicGroup(id);
    fetchEthnicGroups(limit.value, offset.value);
    ui.notify(t("deleted_successfully"), "success");
  } catch (error) {
    ui.notify(t("failed-to-delete"), "error");
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
/* All styling comes from the global design system (global.css). */
</style>
