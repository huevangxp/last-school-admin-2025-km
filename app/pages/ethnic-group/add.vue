<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-card elevation="0" class="intelligence-card pa-6">
      <div class="d-flex align-center mb-6">
        <v-avatar color="blue-lighten-5" size="40" class="mr-3 rounded-lg">
          <v-icon color="blue-darken-2" size="20"
            >mdi-account-group-outline</v-icon
          >
        </v-avatar>
        <div>
          <h2 class="text-title">{{ $t("add") }} {{ $t("ethnic_group") }}</h2>
          <p class="text-detail">
            Define new classification for ethnic demographics
          </p>
        </div>
      </div>

      <v-form ref="formRef" v-model="valid" @submit.prevent="submit">
        <v-row class="ga-y-2">
          <v-col cols="12">
            <label class="text-detail-tiny mb-2 d-block"
              >CLASSIFICATION NAME</label
            >
            <v-text-field
              v-model="form.title"
              :rules="[rules.required]"
              variant="outlined"
              density="compact"
              color="primary"
              rounded="lg"
              class="premium-input"
              :placeholder="$t('name')"
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>

        <div class="d-flex justify-end ga-3 pt-8">
          <v-btn
            variant="flat"
            color="grey-lighten-4"
            class="modern-action-btn secondary border text-slate-700"
            height="40"
            to="/ethnic-group"
          >
            {{ $t("cancel") }}
          </v-btn>

          <v-btn
            variant="flat"
            color="primary"
            class="modern-action-btn primary elevation-4"
            height="40"
            type="submit"
            :loading="loading"
          >
            {{ $t("save") }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useEthnicGroupStore } from "@/stores/apiEthnicGroup";
const { t } = useI18n();
const router = useRouter();
const ethnicGroupStore = useEthnicGroupStore();

const valid = ref(false);
const loading = ref(false);
const form = reactive({
  title: "",
});

const rules = {
  required: (v: any) => !!v || t("required"),
};

const breadcrumbs = [
  { title: t("dashboard"), disabled: false, to: "/" },
  { title: t("ethnic_group"), disabled: false, to: "/ethnic-group" },
  { title: t("add"), disabled: true, to: "" },
];

const submit = async () => {
  loading.value = true;
  try {
    await ethnicGroupStore.createEthnicGroup(form);
    router.push("/ethnic-group");
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 600px;
  margin: 0 auto;
}

.intelligence-card {
  border-radius: 16px !important;
  background: white;
  border: 1px solid #f1f5f9;
}

.modern-action-btn {
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 13px !important;
  padding: 0 16px !important;
}

.modern-action-btn.primary {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
}

.premium-input :deep(.v-field__outline__start),
.premium-input :deep(.v-field__outline__end),
.premium-input :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important;
}

.premium-input :deep(.v-field--focused .v-field__outline__start),
.premium-input :deep(.v-field--focused .v-field__outline__end),
.premium-input :deep(.v-field--focused .v-field__outline__notch) {
  border-color: rgb(var(--v-theme-primary)) !important;
  border-width: 1.5px !important;
}

.text-slate-700 {
  color: #334155 !important;
}
</style>
