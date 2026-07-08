<template>
  <v-container fluid class="pa-4 pa-md-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div class="d-flex align-center">
        <v-avatar color="green-lighten-5" size="44" class="mr-3 rounded-0">
          <v-icon color="green-darken-2" size="22">mdi-cash-multiple</v-icon>
        </v-avatar>
        <div>
          <div class="text-title">{{ t("student_fees") }}</div>
          <div class="text-detail">{{ t("fees-subtitle") }}</div>
        </div>
      </div>
      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="flat"
          color="white"
          class="modern-action-btn secondary border"
          height="36"
          @click="openStructure"
        >
          <v-icon icon="mdi-tune" start size="18"></v-icon>
          {{ t("set_fee_amounts") }}
        </v-btn>
        <v-btn
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="36"
          :loading="generating"
          @click="onGenerate"
        >
          <v-icon icon="mdi-account-multiple-plus-outline" start size="18"></v-icon>
          {{ t("generate_fees") }}
        </v-btn>

        <!-- Export / print the fee list -->
        <v-menu v-if="rows.length">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="flat"
              color="white"
              class="modern-action-btn secondary border"
              height="36"
              :loading="exporting"
            >
              <v-icon icon="mdi-tray-arrow-down" start size="18"></v-icon>
              {{ t("export") }}
              <v-icon icon="mdi-chevron-down" end size="16"></v-icon>
            </v-btn>
          </template>
          <v-list density="compact" min-width="200">
            <v-list-item rounded="0" @click="exportExcel">
              <template v-slot:prepend>
                <v-icon size="18" color="green-darken-2"
                  >mdi-file-excel-outline</v-icon
                >
              </template>
              <v-list-item-title class="text-detail">{{
                t("download_excel")
              }}</v-list-item-title>
            </v-list-item>
            <v-list-item rounded="0" @click="exportImage">
              <template v-slot:prepend>
                <v-icon size="18" color="blue-darken-2"
                  >mdi-file-image-outline</v-icon
                >
              </template>
              <v-list-item-title class="text-detail">{{
                t("download_image")
              }}</v-list-item-title>
            </v-list-item>
            <v-list-item rounded="0" @click="exportPdf">
              <template v-slot:prepend>
                <v-icon size="18" color="red-darken-2">mdi-file-pdf-box</v-icon>
              </template>
              <v-list-item-title class="text-detail">{{
                t("download_pdf")
              }}</v-list-item-title>
            </v-list-item>
            <v-divider class="my-1"></v-divider>
            <v-list-item rounded="0" @click="printTable">
              <template v-slot:prepend>
                <v-icon size="18" color="grey-darken-2">mdi-printer</v-icon>
              </template>
              <v-list-item-title class="text-detail">{{
                t("print")
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <!-- Filters -->
    <v-card elevation="0" class="intelligence-card pa-4 mb-6">
      <div class="d-flex flex-column flex-md-row gap-3">
        <v-select
          v-model="yearId"
          :items="classroomStore.academicYears"
          item-title="title"
          item-value="id"
          :label="t('academic')"
          variant="outlined"
          density="compact"
          hide-details
          rounded="0"
          style="max-width: 220px"
          class="w-100"
          color="primary"
        ></v-select>
        <v-select
          v-model="classId"
          :items="classFilterOptions"
          item-title="label"
          item-value="id"
          :label="t('class')"
          variant="outlined"
          density="compact"
          hide-details
          rounded="0"
          clearable
          style="max-width: 260px"
          class="w-100"
          color="primary"
        ></v-select>
      </div>
    </v-card>

    <!-- Stats -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(s, i) in stats" :key="i">
        <v-card class="metric-card pa-4 h-100" elevation="0">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-detail-tiny mb-1">{{ s.label }}</p>
              <h2 class="text-title">{{ s.value }}</h2>
            </div>
            <v-avatar :color="`${s.color}-lighten-5`" rounded="0" size="40">
              <v-icon :color="`${s.color}-darken-2`" size="18">{{ s.icon }}</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Table -->
    <v-card elevation="0" class="intelligence-card pa-4">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        :placeholder="t('search')"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 320px"
        rounded="0"
        color="primary"
        class="mb-4"
      ></v-text-field>

      <v-data-table
        :headers="headers"
        :items="rows"
        :search="search"
        :loading="feesStore.loading"
        class="premium-table"
        hover
      >
        <template v-slot:no-data>
          <div class="text-detail py-8 text-center">{{ t("no-fees-yet") }}</div>
        </template>

        <template v-slot:item.name="{ item }">
          <div class="text-title-small">{{ item.name }}</div>
          <div class="text-detail-tiny text-grey">{{ item.className }} · {{ item.gradeName }}</div>
        </template>
        <template v-slot:item.amount_due="{ item }">
          ₭{{ money(item.amount_due) }}
        </template>
        <template v-slot:item.amount_paid="{ item }">
          <span class="text-green-darken-2">₭{{ money(item.amount_paid) }}</span>
        </template>
        <template v-slot:item.balance="{ item }">
          <span :class="item.balance > 0 ? 'text-red-darken-2' : 'text-grey'">
            ₭{{ money(item.balance) }}
          </span>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="statusColor(item.status)"
            size="x-small"
            rounded="0"
            variant="flat"
            class="font-weight-black text-uppercase px-2"
          >
            {{ t(item.status) }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            v-if="item.status !== 'paid'"
            size="x-small"
            variant="flat"
            color="primary"
            class="modern-action-btn primary"
            @click="openCollect(item)"
          >
            {{ t("collect") }}
          </v-btn>
          <v-icon v-else color="success" size="20">mdi-check-circle</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Set fee amounts dialog -->
    <v-dialog v-model="structureDialog" width="480">
      <v-card rounded="0" class="pa-6">
        <div class="text-title mb-1">{{ t("set_fee_amounts") }}</div>
        <div class="text-detail-tiny mb-4">{{ t("fee_amount_per_grade") }}</div>

        <div v-for="g in classroomStore.gradeLevels" :key="g.id" class="mb-3">
          <label class="text-detail-tiny mb-1 d-block">
            {{ g.grade_level_name }}
          </label>
          <MoneyInput
            v-model="structureForm[g.id]"
            variant="outlined"
            density="compact"
            rounded="0"
            hide-details
            color="primary"
          ></MoneyInput>
        </div>

        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" @click="structureDialog = false">{{ t("cancel") }}</v-btn>
          <v-btn
            color="primary"
            class="modern-action-btn primary"
            :loading="savingStructure"
            @click="saveStructure"
            >{{ t("save") }}</v-btn
          >
        </div>
      </v-card>
    </v-dialog>

    <!-- Collect payment dialog -->
    <v-dialog v-model="collectDialog" width="440">
      <v-card v-if="collectTarget" rounded="0" class="pa-6">
        <div class="text-title mb-1">{{ t("collect_payment") }}</div>
        <div class="text-detail-tiny mb-4">
          {{ collectTarget.name }} · {{ t("balance") }}: ₭{{ money(collectTarget.balance) }}
        </div>

        <label class="text-detail-tiny mb-1 d-block">{{ t("amount") }}</label>
        <MoneyInput
          v-model="collectForm.amount"
          variant="outlined"
          density="compact"
          rounded="0"
          hide-details
          color="primary"
          class="mb-3"
        ></MoneyInput>

        <label class="text-detail-tiny mb-1 d-block">{{ t("payment-method") }}</label>
        <v-select
          v-model="collectForm.method"
          :items="[
            { title: t('cash'), value: 'Cash' },
            { title: t('bank-transfer'), value: 'Bank Transfer' },
            { title: t('online-payment'), value: 'Online Payment' },
          ]"
          variant="outlined"
          density="compact"
          rounded="0"
          hide-details
          color="primary"
        ></v-select>

        <v-alert
          v-if="collectError"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-4"
          >{{ collectError }}</v-alert
        >

        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" @click="collectDialog = false">{{ t("cancel") }}</v-btn>
          <v-btn
            color="primary"
            class="modern-action-btn primary"
            :loading="collecting"
            @click="doCollect"
            >{{ t("collect") }}</v-btn
          >
        </div>
      </v-card>
    </v-dialog>

    <!-- Payment receipt / bill (shown after a successful collection) -->
    <v-dialog v-model="receiptDialog" width="460">
      <v-card v-if="receipt" rounded="0" class="pa-4">
        <!-- The receipt itself (also what gets printed / saved as image) -->
        <div v-html="receiptHtml"></div>

        <div class="d-flex justify-end ga-2 mt-4">
          <v-btn variant="text" @click="receiptDialog = false">{{
            t("close")
          }}</v-btn>
          <v-btn
            variant="flat"
            color="white"
            class="modern-action-btn secondary border"
            :loading="exporting"
            @click="downloadReceiptImage"
          >
            <v-icon icon="mdi-file-image-outline" start size="18"></v-icon>
            {{ t("download_image") }}
          </v-btn>
          <v-btn
            color="primary"
            class="modern-action-btn primary"
            @click="printReceipt"
          >
            <v-icon icon="mdi-printer" start size="18"></v-icon>
            {{ t("print") }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useClassroomStore } from "~/stores/apiClassroom";
import { useFeesStore } from "~/stores/apiFees";
import { useUiStore } from "~/stores/ui";
import { formatMoney as money } from "@/utils/money";

const { t } = useI18n();
const classroomStore = useClassroomStore();
const feesStore = useFeesStore();
const ui = useUiStore();

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("student_fees"), disabled: true, to: "/fees" },
];

const yearId = ref("");
const classId = ref<string | null>(null);
const search = ref("");

const classFilterOptions = computed(() =>
  classroomStore.classrooms.map((c: any) => ({
    id: c.id,
    label: c.classroom_name,
  }))
);

const rows = computed(() =>
  feesStore.fees.map((f: any) => ({
    id: f.id,
    name: f.tb_student
      ? `${f.tb_student.first_name} ${f.tb_student.last_name}`
      : "—",
    className: f.tb_classroom?.classroom_name || "—",
    gradeName: f.tb_grade_level?.grade_level_name || "—",
    amount_due: Number(f.amount_due),
    amount_paid: Number(f.amount_paid),
    balance: Number(f.amount_due) - Number(f.amount_paid),
    status: f.status,
  }))
);

const stats = computed(() => [
  {
    label: t("students"),
    value: String(feesStore.summary.students),
    icon: "mdi-account-school-outline",
    color: "blue",
  },
  {
    label: t("total_due"),
    value: `₭${money(feesStore.summary.due)}`,
    icon: "mdi-cash",
    color: "indigo",
  },
  {
    label: t("collected"),
    value: `₭${money(feesStore.summary.collected)}`,
    icon: "mdi-cash-check",
    color: "green",
  },
  {
    label: t("outstanding"),
    value: `₭${money(feesStore.summary.outstanding)}`,
    icon: "mdi-cash-clock",
    color: "red",
  },
]);

const headers = [
  { title: t("students"), key: "name", align: "start" as const, sortable: false },
  { title: t("amount_due"), key: "amount_due", align: "start" as const, sortable: true },
  { title: t("amount_paid"), key: "amount_paid", align: "start" as const, sortable: true },
  { title: t("balance"), key: "balance", align: "start" as const, sortable: true },
  { title: t("status"), key: "status", align: "start" as const, sortable: true },
  { title: "", key: "actions", align: "end" as const, sortable: false },
].map((h) => ({ ...h, class: "text-detail-tiny pb-2" }));

const statusColor = (s: string) =>
  s === "paid" ? "success" : s === "partial" ? "orange" : "red";

const reload = async () => {
  if (!yearId.value) return;
  await Promise.all([
    feesStore.fetchStudentFees(yearId.value, classId.value || undefined),
    feesStore.fetchSummary(yearId.value),
  ]);
};

watch([yearId, classId], reload);

onMounted(async () => {
  await Promise.all([
    classroomStore.fetchAcademicYears(),
    classroomStore.fetchClassrooms(200),
    classroomStore.fetchGradeLevels(),
  ]);
  yearId.value = classroomStore.latestAcademicYearId || "";
});

// ---- Fee structure ----
const structureDialog = ref(false);
const savingStructure = ref(false);
const structureForm = ref<Record<string, number | string>>({});

const openStructure = async () => {
  structureForm.value = {};
  try {
    const list = await feesStore.fetchStructures(yearId.value);
    list.forEach((s: any) => {
      structureForm.value[s.grade_level_id] = String(s.amount);
    });
  } catch {
    /* first time — no structures yet */
  }
  structureDialog.value = true;
};

const saveStructure = async () => {
  savingStructure.value = true;
  try {
    const entries = Object.entries(structureForm.value).filter(
      ([, v]) => v !== "" && v != null
    );
    for (const [gradeId, amount] of entries) {
      await feesStore.saveStructure({
        academic_year_id: yearId.value,
        grade_level_id: gradeId,
        amount: Number(amount),
      });
    }
    structureDialog.value = false;
    ui.notify(t("saved"), "success");
  } catch {
    ui.notify(t("failed-to-save"), "error");
  } finally {
    savingStructure.value = false;
  }
};

// ---- Generate ----
const generating = ref(false);
const onGenerate = async () => {
  generating.value = true;
  try {
    const res = await feesStore.generateFees(yearId.value);
    ui.notify(t("fees_generated", { n: res?.created ?? 0 }), "success");
    await reload();
  } catch {
    ui.notify(t("failed-to-save"), "error");
  } finally {
    generating.value = false;
  }
};

// ---- Collect ----
const collectDialog = ref(false);
const collecting = ref(false);
const collectError = ref("");
const collectTarget = ref<any>(null);
const collectForm = ref<{ amount: number | string; method: string }>({
  amount: "",
  method: "Cash",
});

const openCollect = (item: any) => {
  collectTarget.value = item;
  collectForm.value = { amount: String(item.balance), method: "Cash" };
  collectError.value = "";
  collectDialog.value = true;
};

const doCollect = async () => {
  collectError.value = "";
  const amount = Number(collectForm.value.amount);
  if (!amount || amount <= 0 || amount > collectTarget.value.balance) {
    collectError.value = t("required");
    return;
  }
  collecting.value = true;
  try {
    await feesStore.collectPayment(collectTarget.value.id, {
      amount,
      method: collectForm.value.method,
      transaction_date: new Date().toISOString().slice(0, 10),
    });
    collectDialog.value = false;
    await reload();
    ui.notify(t("saved"), "success");
  } catch (error: any) {
    collectError.value = error.response?.data?.message || t("failed-to-save");
  } finally {
    collecting.value = false;
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}
.intelligence-card {
  background: white;
  border: 1px solid #f1f5f9;
}
.metric-card {
  background: white;
  border: 1px solid #f1f5f9;
}
.modern-action-btn {
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 12px !important;
  padding: 0 12px !important;
}
.modern-action-btn.primary {
  background: linear-gradient(135deg, #0A3154 0%, #082741 100%) !important;
  color: white !important;
}
.modern-action-btn.secondary.border {
  border: 1px solid #e2e8f0 !important;
  background: white !important;
  color: #0f172a !important;
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
</style>
