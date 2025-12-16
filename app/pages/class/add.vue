<template>
  <v-container fluid class="bg-grey-lighten-4 h-100">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />

    <v-card elevation="0" class="rounded-xl border">
      <v-form ref="formRef" @submit.prevent="save">
        <v-card-text class="pa-8">
          <!-- Header -->
          <div class="mb-6">
            <h3 class="text-h6 font-weight-bold mb-4 d-flex align-center text-secondary">
              <v-icon start color="primary" class="mr-2">mdi-google-classroom</v-icon>
              Class Information
            </h3>
            <p class="text-body-2 text-medium-emphasis mb-6">
              Create a new class record.
            </p>

            <v-row>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Class Name</v-label>
                <v-text-field
                  v-model="form.className"
                  placeholder="e.g. Mathematics 101"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details="auto"
                  prepend-inner-icon="mdi-format-title"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Grade Level</v-label>
                <v-select
                  v-model="form.grade"
                  :items="gradeOptions"
                  placeholder="Select grade"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details="auto"
                  prepend-inner-icon="mdi-school-outline"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Teacher</v-label>
                <v-select
                  v-model="form.teacher"
                  :items="teacherOptions"
                  placeholder="Assign a teacher"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details="auto"
                  prepend-inner-icon="mdi-account-tie-outline"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Room</v-label>
                <v-text-field
                  v-model="form.room"
                  placeholder="e.g. Room A-101"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details="auto"
                  prepend-inner-icon="mdi-door"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-label class="mb-2 font-weight-medium">Description</v-label>
                <v-textarea
                  v-model="form.description"
                  placeholder="Enter class description (optional)"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  rows="3"
                  hide-details="auto"
                  prepend-inner-icon="mdi-text"
                ></v-textarea>
              </v-col>
            </v-row>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6 d-flex justify-end bg-grey-lighten-5">
          <v-btn
            variant="outlined"
            color="secondary"
            class="mr-3 text-none px-6"
            height="45"
            @click="$router.back()"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            class="text-none px-8"
            height="45"
            type="submit"
            elevation="2"
            :loading="loading"
          >
            Save Class
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const loading = ref(false)
const formRef = ref()

const form = ref({
  className: '',
  grade: null,
  teacher: null,
  room: '',
  description: ''
})

const gradeOptions = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
]

const teacherOptions = [
  'Sarah Wilson', 'James Miller', 'Emily Davis', 'Robert Brown', 'Michael Chen'
]

const breadcrumbs = [
  { title: t('dashboard'), disabled: false, to: '/' },
  { title: t('classes'), disabled: false, to: '/class' },
  { title: t('addClass'), disabled: true, to: '/class/add' },
]

const rules = {
  required: (v: any) => !!v || 'Field is required'
}

const save = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    console.log('Form submitted:', form.value)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/class')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Add specific styles if needed */
</style>