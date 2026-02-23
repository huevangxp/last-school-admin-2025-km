<template>
  <v-container fluid class="pa-6 min-h-screen dashboard-container">
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
          {{ $t("management") }} {{ $t("scores") }}
        </h1>
        <p class="text-body-2 text-grey-darken-1 font-weight-medium">
          Manage student grades and performance.
        </p>
      </div>

      <div class="d-flex gap-3 align-center flex-wrap mt-4 mt-md-0">
        <v-btn
          variant="outlined"
          color="success"
          class="text-none font-weight-bold"
          height="44"
          rounded="xl"
          prepend-icon="mdi-file-excel"
          border
        >
          Excel
        </v-btn>

        <v-btn
          variant="outlined"
          color="error"
          class="text-none font-weight-bold"
          height="44"
          rounded="xl"
          prepend-icon="mdi-file-pdf-box"
          border
        >
          PDF
        </v-btn>

        <v-btn
          color="primary"
          class="text-none px-6 font-weight-bold"
          height="44"
          rounded="xl"
          elevation="4"
          prepend-icon="mdi-plus"
        >
          {{ $t("add") }}
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
                total students
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">
                {{ students.length }}
              </h2>
            </div>
            <v-avatar
              color="blue-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="blue-darken-2" size="26">mdi-account-group</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

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
                ຄະແນນສະເລ່ຍ
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">83.2</h2>
            </div>
            <v-avatar
              color="green-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="green-darken-2" size="26">mdi-chart-line</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

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
                ອັດຕາຜ່ານ
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">92%</h2>
            </div>
            <v-avatar
              color="purple-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="purple-darken-2" size="26">mdi-trophy</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

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
                ຍັງບໍ່ປ້ອນຄະແນນ
              </p>
              <h2 class="text-h4 font-weight-bold text-secondary">3</h2>
            </div>
            <v-avatar
              color="orange-lighten-5"
              rounded="lg"
              size="52"
              class="icon-box"
            >
              <v-icon color="orange-darken-2" size="26"
                >mdi-clock-time-four-outline</v-icon
              >
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <div>
      <v-card class="rounded-xl bean-card" elevation="0">
        <!-- Filter Section -->
        <div class="pa-6 pb-0">
          <div
            class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-4 gap-4"
          >
            <!-- Search Field -->
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              :placeholder="$t('search')"
              variant="outlined"
              density="comfortable"
              hide-details
              style="max-width: 300px"
              bg-color="white"
              color="primary"
              rounded="lg"
              class="cream-input"
            ></v-text-field>

            <!-- Filter Dropdowns -->
            <div class="d-flex gap-3 align-center flex-wrap">
              <!-- Academic Year Filter -->
              <v-select
                v-model="selectedYear"
                :items="academicYears"
                placeholder="ປີຮຽນ"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                style="min-width: 140px"
                class="cream-select"
                color="primary"
              ></v-select>

              <!-- Semester Filter -->
              <v-select
                v-model="selectedSemester"
                :items="semesters"
                placeholder="ພາກຮຽນ"
                prepend-inner-icon="mdi-school"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                style="min-width: 140px"
                class="cream-select"
                color="primary"
              ></v-select>

              <!-- Class Filter -->
              <v-select
                v-model="selectedClass"
                :items="classes"
                placeholder="ຫ້ອງຮຽນ"
                prepend-inner-icon="mdi-google-classroom"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                style="min-width: 140px"
                class="cream-select"
                color="primary"
              ></v-select>

              <!-- Subject Filter -->
              <v-select
                v-model="selectedSubject"
                :items="subjects"
                placeholder="ວິຊາ"
                prepend-inner-icon="mdi-book-open-variant"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
                style="min-width: 140px"
                class="cream-select"
                color="primary"
              ></v-select>
            </div>
          </div>
        </div>

        <!-- Score Table -->
        <div class="pa-6">
          <div class="table-wrapper">
            <table class="score-table">
              <thead>
                <tr>
                  <th class="col-no">ລ/ດ</th>
                  <th class="col-name">ຊື່ ແລະ ນາມສະກຸນ</th>
                  <th class="col-score">
                    <div class="rotate-text">ຄະນິດສາດ</div>
                  </th>
                  <th class="col-score">
                    <div class="rotate-text">ຟີຊິກສາດ</div>
                  </th>
                  <th class="col-score">
                    <div class="rotate-text">ເຄມີສາດ</div>
                  </th>
                  <th class="col-score">
                    <div class="rotate-text">ຊີວະວິທະຍາ</div>
                  </th>
                  <th class="col-score">
                    <div class="rotate-text">ພາສາລາວ</div>
                  </th>
                  <th class="col-score">
                    <div class="rotate-text">ພາສາອັງກິດ</div>
                  </th>
                  <th class="col-score">
                    <div class="rotate-text">ປະຫວັດສາດ</div>
                  </th>
                  <th class="col-score">
                    <div class="rotate-text">ພູມສາດ</div>
                  </th>
                  <th class="col-score">
                    <div class="rotate-text">ສັງຄົມສຶກສາ</div>
                  </th>
                  <th class="col-score">
                    <div class="rotate-text">ພະລະ</div>
                  </th>
                  <th class="col-score">
                    <div class="rotate-text">ຄອມພິວເຕີ</div>
                  </th>
                  <th class="col-total">ລວມ</th>
                  <th class="col-rank">ຈັດລຳດັບ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(student, index) in students"
                  :key="index"
                  :class="index % 2 === 0 ? 'row-even' : 'row-odd'"
                  class="table-row"
                >
                  <td class="text-center">
                    <span class="row-number">{{ index + 1 }}</span>
                  </td>
                  <td class="text-left px-4">
                    <span class="student-name">{{ student.name }}</span>
                  </td>
                  <td class="text-center score-cell">{{ student.lao }}</td>
                  <td class="text-center score-cell">{{ student.eng }}</td>
                  <td class="text-center score-cell">{{ student.math }}</td>
                  <td class="text-center score-cell">{{ student.science }}</td>
                  <td class="text-center score-cell empty-score">-</td>
                  <td class="text-center score-cell empty-score">-</td>
                  <td class="text-center score-cell empty-score">-</td>
                  <td class="text-center score-cell empty-score">-</td>
                  <td class="text-center score-cell empty-score">-</td>
                  <td class="text-center score-cell empty-score">-</td>
                  <td class="text-center score-cell empty-score">-</td>
                  <td class="text-center font-weight-bold total-cell">
                    <span class="total-score">{{ student.total }}</span>
                  </td>
                  <td class="text-center rank-cell">
                    <v-chip
                      size="small"
                      :color="getRankColor(index)"
                      variant="flat"
                    >
                      {{ index + 1 }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Enhanced Footer Signatures -->
        <div class="signature-section pa-8">
          <div class="signature-container">
            <div class="signature-box">
              <div class="signature-title mb-6">ອາຈານປະຈຳວິຊາ</div>
              <div class="signature-name">ປຕ ບຸນຕາ ແຄນສິງວິ</div>
            </div>
            <div class="signature-box">
              <div class="signature-title mb-6">ລາຍເຊັ່ນ ອາຈານປະຈຳວິຊາ</div>
              <div class="signature-name"></div>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
// Search and Filter State
const search = ref("");
const selectedYear = ref("");
const selectedSemester = ref("");
const selectedClass = ref("");
const selectedSubject = ref("");

// Filter Options
const academicYears = ["2023-2024", "2024-2025", "2025-2026"];
const semesters = ["ພາກຮຽນ 1", "ພາກຮຽນ 2"];
const classes = ["ມ1/1", "ມ1/2", "ມ2/1", "ມ2/2", "ມ3/1", "ມ3/2"];
const subjects = [
  "ຄະນິດສາດ",
  "ພາສາລາວ",
  "ພາສາອັງກິດ",
  "ຟິຊິກສາດ",
  "ເຄມີສາດ",
  "ຊີວະວິທະຍາ",
];

// Breadcrumbs
const breadcrumbs = [
  { title: $t("dashboard"), disabled: false, to: "/" },
  { title: $t("scores"), disabled: true, to: "/scores" },
];

// Student Score Data
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

// Get rank color based on position
const getRankColor = (index: number) => {
  if (index === 0) return "amber-darken-2";
  if (index === 1) return "grey";
  if (index === 2) return "brown";
  return "blue-grey";
};
</script>

<style scoped>
/* Cream UI Variables */
.dashboard-container {
  /* --cream-bg: #fafaf5; */
}
.min-h-screen {
  min-height: 100vh;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
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

/* Input/Select Customization */
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

.cream-select :deep(.v-field__outline__start),
.cream-select :deep(.v-field__outline__end),
.cream-select :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

/* Table Wrapper */
.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

/* Score Table Styling */
.score-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 14px;
}

.score-table th {
  padding: 16px 12px;
  border: 1px solid #e2e8f0;
  font-weight: 700;
  text-align: center;
  vertical-align: middle;
  position: relative;
  background-color: #f8fafc;
  color: #4a4036; /* Primary text color match */
}

/* Table Rows */
.score-table tbody tr {
  transition: all 0.2s ease;
}

.table-row:hover {
  background-color: #f8fafc !important;
}

.score-table tbody tr.row-even {
  background-color: #fafaf5; /* Soft cream/grey */
}

.score-table tbody tr.row-odd {
  background-color: white;
}

.score-table td {
  padding: 14px 10px;
  border: 1px solid #e2e8f0;
  vertical-align: middle;
}

.student-name,
.score-cell {
  color: #4a4036;
}

.total-cell {
  background: #f8fafc;
}

/* Signature Section */
.signature-section {
  background-color: #fafaf5;
  border-top: 1px solid #e2e8f0;
}

.signature-title {
  font-weight: 700;
  color: #64748b;
  font-size: 15px;
}

.signature-name {
  font-weight: 700;
  color: #4a4036;
  font-size: 16px;
  margin-top: 8px;
}

/* Typography & Utils */
.tracking-wide {
  letter-spacing: 0.05em;
}
</style>
