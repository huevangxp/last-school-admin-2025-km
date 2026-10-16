<template>
  <div class="page page--narrow">
    <PageHeader
      :title="`${$t('add')} ${$t('ethnic_group')}`"
      :subtitle="$t('define-new-classification')"
      icon="mdi-account-group-outline"
      :breadcrumbs="breadcrumbs"
      back="/ethnic-group"
    />

    <v-card elevation="0" class="panel fade-in">
      <v-form ref="formRef" v-model="valid" @submit.prevent="submit">
        <div class="form-section">
          <v-icon size="16">mdi-text-box-outline</v-icon>
          {{ $t("ethnic_group") }}
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <label class="field-label">{{ $t("classification-name") }}</label>
            <v-text-field
              v-model="form.title"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              color="primary"
              :placeholder="$t('name')"
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>

        <div class="form-actions">
          <v-btn
            variant="flat"
            class="modern-action-btn secondary"
            to="/ethnic-group"
          >
            {{ $t("cancel") }}
          </v-btn>

          <v-btn
            variant="flat"
            class="modern-action-btn primary"
            type="submit"
            :loading="loading"
          >
            {{ $t("save") }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
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
/* All styling comes from the global design system (global.css). */
</style>
