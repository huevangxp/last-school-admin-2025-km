<template>
  <v-container fluid class="pa-6">
    <Breadcrumbs :breadcrumbs="breadcrumbs" />

    <v-card flat class="rounded-xl pa-6" color="white" elevation="0">
      <div class="d-flex align-center justify-space-between mb-6">
        <h1 class="text-h5 font-weight-bold text-grey-darken-4">
          {{ $t("add") }} {{ $t("ethnic_group") }}
        </h1>
      </div>

      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-row>
          <v-col cols="12">
            <label
              class="text-body-2 text-grey-darken-1 font-weight-medium mb-2 d-block"
            >
              {{ $t("name") }} <span class="text-error">*</span>
            </label>
            <v-text-field
              v-model="form.title"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              color="primary"
              rounded="lg"
              :placeholder="$t('name')"
            ></v-text-field>
          </v-col>
        </v-row>

        <div class="d-flex gap-3 mt-6 justify-end">
          <v-btn
            variant="outlined"
            color="red"
            class="text-red px-6"
            height="44"
            rounded="lg"
            to="/ethnic-group"
            style="border-color: #ff0000"
          >
            <v-icon icon="mdi-close" class="mr-2"></v-icon> {{ $t("cancel") }}
          </v-btn>

          <v-btn
            color="primary"
            class="text-none px-8"
            height="44"
            rounded="lg"
            elevation="0"
            type="submit"
            :loading="loading"
          >
            <v-icon icon="mdi-content-save" class="mr-2"></v-icon>
            {{ $t("save") }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useEthnicGroupStore } from "@/stores/apiEthnicGroup";
import { useI18n } from "vue-i18n";

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
  if (!valid.value) return;

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
.gap-3 {
  gap: 12px;
}
</style>
