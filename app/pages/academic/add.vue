<template>
  <v-container fluid class="h-100">
    <!-- Breadcrumbs -->
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <v-card elevation="0" class="rounded-xl">
      <v-form ref="formRef" @submit.prevent="save">
        <v-card-text class="px-6 pb-0 pt-6">
          <!-- Header -->
          <div class="mb-6">
            <h3
              class="text-h6 font-weight-bold mb-4 d-flex align-center text-secondary"
            >
              <v-icon start color="primary" class="mr-2"
                >mdi-school-outline</v-icon
              >
              <span>{{ $t("academic") }}</span>
            </h3>
            <p class="text-body-2 text-medium-emphasis mb-6">
              <!-- <span>{{ $t('create') }} {{ $t('academic') }} {{ $t('year') }} {{ $t('records') }}.</span> -->
            </p>

            <v-row>
              <!-- Title -->
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">{{
                  $t("title")
                }}</v-label>
                <v-text-field
                  v-model="form.title"
                  placeholder="e.g. 2023-2024"
                  variant="outlined"
                  color="primary"
                  rounded="lg"
                  density="comfortable"
                  hide-details="auto"
                  prepend-inner-icon="mdi-format-title"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>

              <!-- Status -->
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">{{
                  $t("status")
                }}</v-label>
                <v-select
                  v-model="form.status"
                  :items="statusOptions"
                  density="comfortable"
                  placeholder="Select status"
                  variant="outlined"
                  rounded="lg"
                  color="primary"
                  hide-details="auto"
                  prepend-inner-icon="mdi-list-status"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>

              <!-- Start Date -->
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">{{
                  $t("start_date")
                }}</v-label>
                <DialogDate
                  v-model="showStartDatePicker"
                  :date="form.startDate"
                  @update:date="form.startDate = $event"
                />
                <v-text-field
                  v-model="form.startDate"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Select start date"
                  rounded="lg"
                  color="primary"
                  hide-details="auto"
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-calendar-blank-outline"
                  readonly
                  @click="showStartDatePicker = true"
                  @click:prepend-inner="showStartDatePicker = true"
                ></v-text-field>
              </v-col>

              <!-- End Date -->
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">{{
                  $t("end_date")
                }}</v-label>
                <DialogDate
                  v-model="showEndDatePicker"
                  :date="form.endDate"
                  @update:date="form.endDate = $event"
                />
                <v-text-field
                  v-model="form.endDate"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Select end date"
                  rounded="lg"
                  color="primary"
                  hide-details="auto"
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-calendar-blank-outline"
                  readonly
                  @click="showEndDatePicker = true"
                  @click:prepend-inner="showEndDatePicker = true"
                ></v-text-field>
              </v-col>

              <!-- Description -->
              <v-col cols="12">
                <v-label class="mb-2 font-weight-medium">{{
                  $t("description")
                }}</v-label>
                <v-textarea
                  v-model="form.description"
                  :placeholder="$t('description')"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  color="primary"
                  rows="3"
                  hide-details="auto"
                  prepend-inner-icon="mdi-text"
                ></v-textarea>
              </v-col>
            </v-row>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 d-flex justify-end">
          <v-btn
            variant="outlined"
            color="red"
            class="mr-3 text-none px-6"
            height="45"
            @click="$router.back()"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            rounded="lg"
            class="text-none px-8"
            height="45"
            type="submit"
            elevation="2"
            :loading="loading"
          >
            {{ $t("save") }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n();
const router = useRouter();

const loading = ref(false);
const formRef = ref();

const form = ref({
  title: "",
  status: "active",
  startDate: "",
  endDate: "",
  description: "",
});

const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);

const statusOptions = [
  { title: "Active", value: "active" },
  { title: "Inactive", value: "inactive" },
  { title: "Archived", value: "archived" },
];

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("academic"), disabled: false, to: "/academic" },
  { title: t("add"), disabled: true, to: "/academic/add" },
];

const rules = {
  required: (v: any) => !!v || $t("required"),
};

const save = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    // TODO: Implement API call
    console.log("Form submitted:", form.value);

    const { $axios } = useNuxtApp();
    const response = await $axios.post("/add-academic-year", form.value);
    console.log("API response:", response.data);

    // // Simulate API delay
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // router.push("/academic");
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
