<template>
  <v-container fluid class="pa-6 min-h-screen">
    <Breadcrumbs :breadcrumbs="breadcrumbs" />

    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6"
    >
      <div>
        <h1 class="text-h5 font-weight-bold text-grey-darken-4 mb-2">
          <span>{{ $t("management") }} {{ $t("scores") }}</span>
        </h1>
      </div>

      <div class="d-flex gap-3 align-center flex-wrap">
        <v-btn
          variant="outlined"
          color="success"
          class="text-none"
          height="40"
          rounded="lg"
          prepend-icon="mdi-file-excel"
        >
          Excel
        </v-btn>

        <v-btn
          variant="outlined"
          color="error"
          class="text-none"
          height="40"
          rounded="lg"
          prepend-icon="mdi-file-pdf-box"
        >
          PDF
        </v-btn>

        <v-btn
          color="primary"
          class="text-none px-6"
          height="40"
          rounded="lg"
          elevation="0"
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
          class="rounded-xl pa-4"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">
                <span>total students</span>
              </p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">
                {{ students.length }}
              </h2>
            </div>
            <v-avatar color="blue-lighten-5" size="56">
              <v-icon color="blue" size="28">mdi-account-group</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="rounded-xl pa-4"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">
                <span>ຄະແນນສະເລ່ຍ</span>
              </p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">83.2</h2>
            </div>
            <v-avatar color="green-lighten-5" size="56">
              <v-icon color="green" size="28">mdi-chart-line</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="rounded-xl pa-4"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">
                <span>ອັດຕາຜ່ານ</span>
              </p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">92%</h2>
            </div>
            <v-avatar color="purple-lighten-5" size="56">
              <v-icon color="purple" size="28">mdi-trophy</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card
          class="rounded-xl pa-4"
          elevation="0"
          style="border: 1px solid #e0e0e0"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">
                <span>ຍັງບໍ່ປ້ອນຄະແນນ</span>
              </p>
              <h2 class="text-h5 font-weight-bold text-grey-darken-4">3</h2>
            </div>
            <v-avatar color="orange-lighten-5" size="56">
              <v-icon color="orange" size="28">mdi-clock-outline</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <div>
      <v-card class="rounded-xl">
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
.min-h-screen {
  min-height: 100vh;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}

/* Table Wrapper */
.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Score Table Styling */
.score-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 14px;
}

.score-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.score-table th {
  padding: 16px 12px;
  border: 1px solid rgba(167, 167, 167, 0.2);
  font-weight: 700;
  text-align: center;
  vertical-align: middle;
  position: relative;
}

.score-table th.col-no {
  width: 60px;
}

.score-table th.col-name {
  min-width: 220px;
  text-align: left;
  padding-left: 20px;
}

.score-table th.col-score {
  width: 65px;
  height: 140px;
  padding: 8px 4px;
}

.score-table th.col-total,
.score-table th.col-rank {
  width: 90px;
}

/* Rotated Header Text */
.rotate-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  white-space: nowrap;
  font-size: 13px;
  padding: 8px 0;
  font-weight: 600;
}

/* Table Body */
.score-table tbody tr {
  transition: all 0.3s ease;
}

.table-row:hover {
  background: linear-gradient(
    to right,
    rgba(102, 126, 234, 0.1),
    rgba(118, 75, 162, 0.1)
  ) !important;
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.score-table tbody tr.row-even {
  background-color: #f8f9fa;
}

.score-table tbody tr.row-odd {
  background-color: white;
}

.score-table td {
  padding: 14px 10px;
  border: 1px solid #e9ecef;
  vertical-align: middle;
  transition: all 0.2s ease;
}

.row-number {
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 28px;
  border-radius: 50%;
  font-weight: 600;
  font-size: 12px;
}

.student-name {
  font-weight: 600;
  color: #2c3e50;
}

.score-cell {
  font-weight: 600;
  color: #495057;
}

.empty-score {
  color: #adb5bd;
  font-weight: 400;
}

.total-cell {
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  font-size: 16px;
}

.total-score {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 8px;
  font-weight: 700;
}

.rank-cell {
  background: linear-gradient(to left, #f8f9fa, #ffffff);
}

/* Signature Section */
.signature-section {
  background: linear-gradient(to top, #f8f9fa, #ffffff);
  border-top: 2px solid #e9ecef;
}

.signature-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 40px;
}

.signature-box {
  text-align: center;
  min-width: 250px;
}

.signature-title {
  font-weight: 700;
  color: #495057;
  font-size: 15px;
}

.signature-name {
  font-weight: 700;
  color: #2c3e50;
  font-size: 16px;
  margin-top: 8px;
}

/* Smooth scrollbar */
.table-wrapper::-webkit-scrollbar {
  height: 8px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #ccc;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
</style>
