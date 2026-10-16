<template>
  <div class="page">
    <PageHeader
      :title="t('contact_messages')"
      :subtitle="t('contact-inbox-subtitle')"
      icon="mdi-email-outline"
      :breadcrumbs="breadcrumbs"
    />

    <!-- KPIs -->
    <v-row class="mb-2 fade-in">
      <v-col cols="6" lg="3">
        <StatCard
          icon="mdi-email-multiple-outline"
          :label="t('total-messages')"
          :value="contactStore.contacts.length"
        />
      </v-col>
      <v-col cols="6" lg="3">
        <StatCard
          icon="mdi-email-alert-outline"
          :label="t('unread')"
          :value="unreadCount"
          color="#F59E0B"
          tint="#FFFBEB"
          :badge="unreadCount ? t('unread') : ''"
          :pulse="unreadCount > 0"
        />
      </v-col>
    </v-row>

    <!-- Inbox -->
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
          <span class="panel-chip panel-chip--amber">
            {{ unreadCount }} {{ t("unread") }}
          </span>
        </div>
      </div>

      <div class="table-wrap">
        <v-data-table
          :headers="headers"
          :items="contactStore.contacts"
          :search="search"
          :loading="contactStore.loading"
          class="premium-table inbox-table"
          hover
          @click:row="onRowClick"
        >
          <template v-slot:no-data>
            <div class="pa-4">
              <EmptyState
                icon="mdi-email-open-outline"
                :title="t('no-contact-messages')"
              />
            </div>
          </template>

          <template v-slot:item.name="{ item }">
            <div class="d-flex align-center ga-3 py-2">
              <v-badge
                :model-value="item.status === 'unread'"
                color="warning"
                dot
                offset-x="2"
                offset-y="2"
              >
                <div class="avatar-chip">{{ (item.name || "?").charAt(0) }}</div>
              </v-badge>
              <div class="min-w-0">
                <div
                  class="cell-title text-truncate"
                  :class="{ 'font-weight-black': item.status === 'unread' }"
                >
                  {{ item.name }}
                </div>
                <div class="cell-sub text-truncate">{{ item.email }}</div>
              </div>
            </div>
          </template>

          <template v-slot:item.subject="{ item }">
            <div class="subject-cell text-truncate">
              {{ item.subject || "—" }}
            </div>
          </template>

          <template v-slot:item.created_at="{ item }">
            <span class="cell-sub">{{ formatDate(item.created_at) }}</span>
          </template>

          <template v-slot:item.status="{ item }">
            <span
              class="status-pill"
              :class="item.status === 'unread' ? 'status-pill--amber' : 'status-pill--grey'"
            >
              <span class="status-dot"></span>
              {{ item.status === "unread" ? t("unread") : t("read") }}
            </span>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="row-actions">
              <v-btn
                icon="mdi-eye-outline"
                variant="text"
                size="small"
                color="primary"
                @click.stop="openDetail(item)"
              ></v-btn>
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                size="small"
                color="error"
                @click.stop="removeItem(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <!-- Detail dialog -->
    <v-dialog v-model="dialog" width="560">
      <v-card v-if="selected" class="pa-5 pa-md-6">
        <div class="d-flex align-start justify-space-between ga-3 mb-4">
          <div class="min-w-0">
            <div class="panel-title text-truncate">
              {{ selected.subject || t("message") }}
            </div>
            <div class="panel-sub">{{ formatDate(selected.created_at) }}</div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            class="flex-shrink-0"
            @click="dialog = false"
          ></v-btn>
        </div>

        <div class="info-row">
          <div class="info-row-icon">
            <v-icon size="18">mdi-account-outline</v-icon>
          </div>
          <div class="min-w-0">
            <div class="info-row-label">{{ t("sender") }}</div>
            <div class="info-row-value">{{ selected.name }}</div>
          </div>
        </div>
        <div class="info-row">
          <div class="info-row-icon">
            <v-icon size="18">mdi-email-outline</v-icon>
          </div>
          <div class="min-w-0">
            <div class="info-row-label">{{ t("email") }}</div>
            <div class="info-row-value">{{ selected.email }}</div>
          </div>
        </div>
        <div v-if="selected.phone" class="info-row">
          <div class="info-row-icon">
            <v-icon size="18">mdi-phone-outline</v-icon>
          </div>
          <div class="min-w-0">
            <div class="info-row-label">{{ t("phone") }}</div>
            <div class="info-row-value">{{ selected.phone }}</div>
          </div>
        </div>

        <div class="message-body mt-4">{{ selected.message }}</div>

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn danger"
            @click="removeItem(selected)"
          >
            {{ t("delete") }}
          </v-btn>
          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            @click="toggleRead(selected)"
          >
            {{ selected.status === "read" ? t("mark_as_unread") : t("mark_as_read") }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useContactStore } from "~/stores/apiContact";
import { useUiStore } from "~/stores/ui";
import { formatDate } from "@/utils/formatDate";

const { t } = useI18n();
const contactStore = useContactStore();
const ui = useUiStore();

const search = ref("");

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("contact_messages"), disabled: true, to: "/contact" },
];

const headers = [
  { title: t("sender"), key: "name", align: "start" as const, sortable: true },
  { title: t("contact_subject"), key: "subject", align: "start" as const, sortable: false },
  { title: t("start_date"), key: "created_at", align: "start" as const, sortable: true },
  { title: t("status"), key: "status", align: "start" as const, sortable: true },
  { title: "", key: "actions", align: "end" as const, sortable: false },
].map((h) => ({ ...h, class: "text-detail-tiny pb-2" }));

const unreadCount = computed(
  () => contactStore.contacts.filter((c: any) => c.status === "unread").length
);

// ---- Detail ----
const dialog = ref(false);
const selected = ref<any>(null);

const openDetail = async (item: any) => {
  selected.value = item;
  dialog.value = true;
  // Opening an unread message marks it read.
  if (item.status === "unread") {
    try {
      await contactStore.markRead(item.id, "read");
      item.status = "read";
    } catch {
      /* non-fatal — the list just stays unread */
    }
  }
};

const onRowClick = (_event: any, row: any) => openDetail(row.item);

const toggleRead = async (item: any) => {
  const next = item.status === "read" ? "unread" : "read";
  try {
    await contactStore.markRead(item.id, next);
    item.status = next;
  } catch {
    ui.notify(t("failed-to-save"), "error");
  }
};

const removeItem = async (item: any) => {
  const ok = await ui.confirm({
    message: t("are_you_sure_delete"),
    confirmText: t("delete"),
    icon: "mdi-delete-outline",
  });
  if (!ok) return;
  try {
    await contactStore.deleteContact(item.id);
    dialog.value = false;
    await contactStore.fetchContacts();
    ui.notify(t("deleted_successfully"), "success");
  } catch (error) {
    ui.notify(t("failed-to-delete"), "error");
  }
};

onMounted(() => {
  contactStore.fetchContacts();
});
</script>

<style scoped>
/* Rows open the message, so hint that they are clickable. */
.inbox-table :deep(tbody tr) {
  cursor: pointer;
}
.subject-cell {
  max-width: 320px;
  font-size: 13.5px;
  color: #334155;
}
.message-body {
  white-space: pre-line;
  line-height: 1.6;
  font-size: 14px;
  color: #334155;
  background: #f8fafc;
  border-radius: 12px;
  padding: 14px 16px;
}
</style>
