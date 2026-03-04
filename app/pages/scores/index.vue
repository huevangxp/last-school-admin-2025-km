<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-title mb-1">
          {{ $t("management") }} {{ $t("scores") }}
        </h1>
        <p class="text-detail">Manage student grades and performance.</p>
      </div>

      <div class="d-flex gap-2 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="outlined"
          color="success"
          class="modern-action-btn secondary border"
          height="32"
          prepend-icon="mdi-file-excel"
        >
          Excel
        </v-btn>

        <v-btn
          variant="outlined"
          color="error"
          class="modern-action-btn secondary border"
          height="32"
          prepend-icon="mdi-file-pdf-box"
        >
          PDF
        </v-btn>

        <v-btn
          color="primary"
          class="modern-action-btn primary elevation-4"
          height="32"
          prepend-icon="mdi-plus"
        >
          {{ $t("add") }}
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, i) in scoreStats" :key="i">
        <v-card
          class="metric-card pa-4 d-flex flex-column justify-space-between h-100"
          elevation="0"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div>
              <p class="text-detail-tiny mb-1">
                {{ stat.label }}
              </p>
              <h2 class="text-title">{{ stat.value }}</h2>
            </div>
            <v-avatar
              :color="`${stat.color}-lighten-5`"
              rounded="lg"
              size="40"
              class="metric-icon-box"
            >
              <v-icon :color="`${stat.color}-darken-2`" size="18">{{
                stat.icon
              }}</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card elevation="0" class="intelligence-card pa-4">
      <!-- Filter Section -->
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-3"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :placeholder="$t('search')"
          variant="outlined"
          density="compact"
          hide-details
          class="cream-input"
          style="max-width: 280px"
          bg-color="white"
          color="primary"
          base-color="grey-lighten-1"
          rounded="lg"
        ></v-text-field>

        <div class="d-flex gap-2 align-center flex-wrap">
          <v-select
            v-model="selectedYear"
            :items="academicYears"
            placeholder="Year"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 110px"
            class="cream-select text-detail"
            color="primary"
            base-color="grey-lighten-1"
          ></v-select>

          <v-select
            v-model="selectedClass"
            :items="classes"
            placeholder="Class"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 110px"
            class="cream-select text-detail"
            color="primary"
            base-color="grey-lighten-1"
          ></v-select>

          <v-btn
            variant="outlined"
            color="grey-darken-1"
            class="modern-action-btn secondary border"
            height="32"
            width="32"
            icon="mdi-dots-horizontal"
          ></v-btn>
        </div>
      </div>

      <!-- Score Table -->
      <div class="table-wrapper">
        <table class="score-table">
          <thead>
            <tr>
              <th class="col-no text-detail-tiny">NO.</th>
              <th class="col-name text-detail-tiny text-left">STUDENT NAME</th>
              <th
                class="col-score text-detail-tiny"
                v-for="subj in subjects"
                :key="subj"
              >
                {{ subj }}
              </th>
              <th class="col-total text-detail-tiny">TOTAL</th>
              <th class="col-rank text-detail-tiny">RANK</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(student, index) in students"
              :key="index"
              class="table-row"
            >
              <td class="text-center text-detail-tiny">
                {{ index + 1 }}
              </td>
              <td class="text-left px-4 text-detail font-weight-black">
                {{ student.name }}
              </td>
              <td
                class="text-center score-cell text-detail"
                v-for="n in 4"
                :key="n"
              >
                {{
                  n === 1
                    ? student.lao
                    : n === 2
                      ? student.eng
                      : n === 3
                        ? student.math
                        : student.science
                }}
              </td>
              <td
                class="text-center score-cell text-detail"
                v-for="n in subjects.length - 4"
                :key="'empty-' + n"
              >
                -
              </td>
              <td
                class="text-center font-weight-black total-cell text-detail text-primary"
              >
                {{ student.total }}
              </td>
              <td class="text-center rank-cell">
                <v-chip
                  size="x-small"
                  :color="getRankColor(index)"
                  variant="flat"
                  class="font-weight-black"
                >
                  {{ index + 1 }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Enhanced Footer Signatures -->
      <div class="signature-section mt-8 pa-4 rounded-lg">
        <div class="d-flex justify-space-between">
          <div class="text-center">
            <div class="text-detail-tiny mb-6 opacity-60">
              COURSE INSTRUCTOR
            </div>
            <div class="text-title-small">ປຕ ບຸນຕາ ແຄນສິງວິ</div>
          </div>
          <div class="text-center">
            <div class="text-detail-tiny mb-6 opacity-60">SIGNATURE</div>
            <div class="signature-line"></div>
          </div>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
const { t } = useI18n();

const search = ref("");
const selectedYear = ref("2024-2025");
const selectedClass = ref("ມ1/1");

const academicYears = ["2023-2024", "2024-2025", "2025-2026"];
const classes = ["ມ1/1", "ມ1/2", "ມ2/1", "ມ2/2", "ມ3/1", "ມ3/2"];
const subjects = ["MATH", "PHYS", "CHEM", "BIO", "LAO", "ENG", "HIST", "GEO"];

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("scores"), disabled: true, to: "/scores" },
];

const scoreStats = [
  {
    label: "Total Students",
    value: "148",
    icon: "mdi-account-group",
    color: "blue",
  },
  {
    label: "Average Score",
    value: "83.2",
    icon: "mdi-chart-line",
    color: "green",
  },
  { label: "Pass Rate", value: "92%", icon: "mdi-trophy", color: "purple" },
  {
    label: "Pending",
    value: "3",
    icon: "mdi-clock-time-four-outline",
    color: "orange",
  },
];

const students = ref([
  {
    name: "ນາງ ຄຳພອນ ແກ້ວມະນີ",
    lao: 10,
    eng: 18,
    math: 13,
    science: 15,
    total: 87,
  },
  {
    name: "ນາງ ສີດາ ເພັດສະຫັວນ",
    lao: 10,
    eng: 18,
    math: 13,
    science: 15,
    total: 89,
  },
  {
    name: "ນາງ ເກດາ ແກ້ວພາວົງ",
    lao: 9,
    eng: 16,
    math: 13,
    science: 15,
    total: 66,
  },
  {
    name: "ນາງ ເມສາ ຈັນທອງສາ",
    lao: 10,
    eng: 18,
    math: 13,
    science: 15,
    total: 87,
  },
  {
    name: "ນາງ ບົວໄຂ ໄຊສົງຄາມ",
    lao: 9,
    eng: 16,
    math: 13,
    science: 15,
    total: 79,
  },
  {
    name: "ນາງ ວັນນະຫົງ ພາລີວົງ",
    lao: 9,
    eng: 16,
    math: 13,
    science: 15,
    total: 82,
  },
  {
    name: "ນາງ ສຸດາວັນ ແກ້ວພູວົງ",
    lao: 10,
    eng: 18,
    math: 13,
    science: 15,
    total: 89,
  },
  {
    name: "ນາງ ລັດສະໝີ ແສງມະນີ",
    lao: 10,
    eng: 18,
    math: 13,
    science: 15,
    total: 91,
  },
  {
    name: "ນາງ ລັດຕະນາ ທິບພະສອນ",
    lao: 8,
    eng: 15,
    math: 13,
    science: 15,
    total: 78,
  },
  {
    name: "ນາງ ແກ່ນຄຳ ສີຫາວົງ",
    lao: 10,
    eng: 18,
    math: 13,
    science: 15,
    total: 84,
  },
]);

const getRankColor = (index: number) => {
  if (index === 0) return "amber-darken-2";
  if (index === 1) return "grey-darken-1";
  if (index === 2) return "brown-darken-1";
  return "blue-grey-lighten-2";
};
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

.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.score-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.score-table th {
  padding: 12px;
  border: 1px solid #f1f5f9;
  background-color: #f8fafc;
  color: #64748b;
  height: 48px;
}

.score-table td {
  padding: 10px;
  border: 1px solid #f1f5f9;
  height: 52px;
}

.table-row:hover {
  background-color: #f8fafc !important;
}

.total-cell {
  background: #f1f5f9;
}

.signature-section {
  background-color: #f8fafc;
  border: 1px dashed #e2e8f0;
}

.signature-line {
  border-bottom: 2px solid #e2e8f0;
  width: 160px;
  margin: 0 auto;
  height: 32px;
}

.cream-input :deep(.v-field__outline__start),
.cream-input :deep(.v-field__outline__end),
.cream-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.border-t {
  border-top: 1px solid #f1f5f9;
}
</style>
