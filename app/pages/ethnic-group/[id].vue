<template>
  <v-container fluid class="pa-6 dashboard-container">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-6" />

    <v-card elevation="0" class="intelligence-card pa-6">
      <div class="d-flex align-center mb-6">
        <v-avatar color="indigo-lighten-5" size="40" class="mr-3 rounded-0">
          <v-icon color="indigo-darken-2" size="20">mdi-pencil-outline</v-icon>
        </v-avatar>
        <div>
          <h2 class="text-title">{{ $t("edit") }} {{ $t("ethnic_group") }}</h2>
          <p class="text-detail">{{ $t("modify-classification-parameters") }}</p>
        </div>
      </div>

      <v-form ref="formRef" v-model="valid" @submit.prevent="submit">
        <v-row class="ga-y-2">
          <v-col cols="12">
            <label class="text-detail-tiny mb-2 d-block"
              >{{ $t("classification-name") }}</label
            >
            <v-text-field
              v-model="form.title"
              :rules="[rules.required]"
              variant="outlined"
              density="compact"
              color="primary"
              rounded="0"
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
const route = useRoute();
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
  { title: t("edit"), disabled: true, to: "" },
];

const id = route.params.id as string;

onMounted(async () => {
  loading.value = true;
  try {
    const data = await ethnicGroupStore.getEthnicGroupById(Number(id));
    form.title = data?.title ?? "";
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const submit = async () => {
  loading.value = true;
  try {
    await ethnicGroupStore.updateEthnicGroup(Number(id), form);
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
  max-width: 1400px;
  margin: 0 auto;
}

.intelligence-card {
  background: white;
  border: 1px solid #f1f5f9;
}

.modern-action-btn {
  text-transform: none !important;
  font-weight: 800 !important;
  font-size: 13px !important;
  padding: 0 16px !important;
}

.modern-action-btn.primary {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: white !important;
}

.text-slate-700 {
  color: #334155 !important;
}
</style>
