<template>
  <v-container fluid class="bg-grey-lighten-5 h-100 pa-6">
    <!-- Header -->
    <div class="mb-6">
        <Breadcrumbs :breadcrumbs="breadcrumbs" />
    </div>

    <v-form ref="formRef" @submit.prevent="save">
      
      <!-- Personal Information -->
      <v-card class="rounded-xl pa-6 mb-6" elevation="0" >
        <div class="d-flex align-center mb-6">
            <v-avatar color="teal-lighten-5" size="48" class="mr-4 rounded-lg">
                <v-icon color="teal-darken-1" size="24">mdi-account</v-icon>
            </v-avatar>
            <h2 class="text-h6 font-weight-bold text-grey-darken-3"><span>{{ t('information') }}</span></h2>
        </div>

        <v-row>
            <v-col cols="12" md="6">
                <label class="text-subtitle-2 text-grey-darken-1 font-weight-medium mb-2 d-block"><span>{{ t('firstname') }}</span></label>
                <v-text-field 
                    v-model="form.firstName" 
                    placeholder="e.g. John" 
                    variant="solo-filled" 
                    flat 
                    bg-color="grey-lighten-6" 
                    rounded="lg" 
                    hide-details="auto" 
                    density="comfortable"
                    :rules="[rules.required]"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <label class="text-subtitle-2 text-grey-darken-1 font-weight-medium mb-2 d-block"><span>{{ t('lastname') }}</span></label>
                <v-text-field 
                    v-model="form.lastName" 
                    placeholder="e.g. Doe" 
                    variant="solo-filled" 
                    flat 
                    bg-color="grey-lighten-6" 
                    rounded="lg" 
                    hide-details="auto"
                    :rules="[rules.required]"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <label class="text-subtitle-2 text-grey-darken-1 font-weight-medium mb-2 d-block"><span>{{ t('dob') }}</span></label>
                <v-text-field 
                    v-model="form.dob" 
                    type="date" 
                    variant="solo-filled" 
                    flat 
                    bg-color="grey-lighten-6" 
                    rounded="lg" 
                    hide-details="auto"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <label class="text-subtitle-2 text-grey-darken-1 font-weight-medium mb-2 d-block"><span>{{ t('gender') }}</span></label>
                <v-select 
                    v-model="form.gender" 
                    :items="genderOptions" 
                    placeholder="Select Gender" 
                    variant="solo-filled" 
                    flat 
                    bg-color="grey-lighten-6" 
                    rounded="lg" 
                    hide-details="auto"
                ></v-select>
            </v-col>
        </v-row>
      </v-card>

      <!-- Contact Information -->
      <v-card class="rounded-xl pa-6 mb-6" elevation="0" >
        <div class="d-flex align-center mb-6">
            <v-avatar color="teal-lighten-5" size="48" class="mr-4 rounded-lg">
                <v-icon color="teal-darken-1" size="24">mdi-phone</v-icon>
            </v-avatar>
            <h2 class="text-h6 font-weight-bold text-grey-darken-3"><span>{{ t('contact') }}</span></h2>
        </div>

        <v-row>
            <v-col cols="12" md="6">
                <label class="text-subtitle-2 text-grey-darken-1 font-weight-medium mb-2 d-block"><span>{{ t('email') }}</span></label>
                <v-text-field 
                    v-model="form.email" 
                    placeholder="student@example.com" 
                    variant="solo-filled" 
                    flat 
                    bg-color="grey-lighten-6" 
                    rounded="lg" 
                    hide-details="auto"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <label class="text-subtitle-2 text-grey-darken-1 font-weight-medium mb-2 d-block"><span>{{ t('phone') }}</span></label>
                <v-text-field 
                    v-model="form.phone" 
                    placeholder="(555) 000-0000" 
                    variant="solo-filled" 
                    flat 
                    bg-color="grey-lighten-6" 
                    rounded="lg" 
                    hide-details="auto"
                ></v-text-field>
            </v-col>
            <v-col cols="12">
                <label class="text-subtitle-2 text-grey-darken-1 font-weight-medium mb-2 d-block"><span>{{ t('address') }}</span></label>
                <v-text-field 
                    v-model="form.address" 
                    placeholder="Street address, Apt, City, Zip Code" 
                    variant="solo-filled" 
                    flat 
                    bg-color="grey-lighten-6" 
                    rounded="lg" 
                    hide-details="auto"
                ></v-text-field>
            </v-col>
        </v-row>
      </v-card>

      <!-- Academic Information -->
      <v-card class="rounded-xl pa-6 mb-6" elevation="0" >
        <div class="d-flex align-center mb-6">
            <v-avatar color="teal-lighten-5" size="48" class="mr-4 rounded-lg">
                <v-icon color="teal-darken-1" size="24">mdi-school</v-icon>
            </v-avatar>
            <h2 class="text-h6 font-weight-bold text-grey-darken-3"><span>{{ t('academic') }}</span></h2>
        </div>

        <v-row>
            <v-col cols="12" md="4">
                <label class="text-subtitle-2 text-grey-darken-1 font-weight-medium mb-2 d-block"><span>{{ t('class') }}</span></label>
                <v-select 
                    v-model="form.classId" 
                    :items="classOptions" 
                    placeholder="Select Grade" 
                    variant="solo-filled" 
                    flat 
                    bg-color="grey-lighten-6" 
                    rounded="lg" 
                    hide-details="auto"
                    :rules="[rules.required]"
                ></v-select>
            </v-col>
            <v-col cols="12" md="4">
                <label class="text-subtitle-2 text-grey-darken-1 font-weight-medium mb-2 d-block"><span>{{ t('section') }}</span></label>
                <v-select 
                    v-model="form.section" 
                    :items="['A', 'B', 'C']" 
                    placeholder="Select Section" 
                    variant="solo-filled" 
                    flat 
                    bg-color="grey-lighten-6" 
                    rounded="lg" 
                    hide-details="auto"
                ></v-select>
            </v-col>
            <v-col cols="12" md="4">
                <label class="text-subtitle-2 text-grey-darken-1 font-weight-medium mb-2 d-block"><span>{{ t('admissiondate') }}</span></label>
                <v-text-field 
                    v-model="form.admissionDate" 
                    type="date" 
                    variant="solo-filled" 
                    flat 
                    bg-color="grey-lighten-6" 
                    rounded="lg" 
                    hide-details="auto"
                ></v-text-field>
            </v-col>
        </v-row>
      </v-card>

      <!-- Guardian Information -->
      <v-card class="rounded-xl pa-6" elevation="0" >
        <div class="d-flex align-center mb-6">
            <v-avatar color="teal-lighten-5" size="48" class="mr-4 rounded-lg">
                <v-icon color="teal-darken-1" size="24">mdi-human-male-female-child</v-icon>
            </v-avatar>
            <h2 class="text-h6 font-weight-bold text-grey-darken-3">Guardian Information</h2>
        </div>

        <v-row>
            <v-col cols="12" md="6">
                <label class="text-subtitle-2 text-grey-darken-1 font-weight-medium mb-2 d-block"><span>{{ t('fatherName') }}</span></label>
                <v-text-field 
                    v-model="form.fatherName" 
                    placeholder="Full Name" 
                    variant="solo-filled" 
                    flat 
                    bg-color="grey-lighten-6" 
                    rounded="lg" 
                    hide-details="auto"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <label class="text-subtitle-2 text-grey-darken-1 font-weight-medium mb-2 d-block">Mother's Name</label>
                <v-text-field 
                    v-model="form.motherName" 
                    placeholder="Full Name" 
                    variant="solo-filled" 
                    flat 
                    bg-color="grey-lighten-6" 
                    rounded="lg" 
                    hide-details="auto"
                ></v-text-field>
            </v-col>
            <v-col cols="12">
                <label class="text-subtitle-2 text-grey-darken-1 font-weight-medium mb-2 d-block">Emergency Guardian Contact</label>
                <v-text-field 
                    v-model="form.parentPhone" 
                    prepend-inner-icon="mdi-phone"
                    placeholder="(555) 000-0000" 
                    variant="solo-filled" 
                    v-mask="'(###) ###-####'"
                    flat 
                    bg-color="grey-lighten-6" 
                    rounded="lg"
                    hide-details="auto"
                ></v-text-field>
            </v-col>
            <v-col cols="12" class="d-flex justify-end gap-2 pb-6">
                <v-btn variant="outlined" size="large" color="error" rounded="lg" class="px-6" @click="$router.back()">{{ t('cancel') }}</v-btn>
                <v-btn  size="large" color="teal-darken-1" elevation="2" rounded="lg" class="text-white px-6" @click="save" :loading="loading">{{ t('save') }}</v-btn>
            </v-col>
        </v-row>
      </v-card>

      <!-- Actions -->
   

    </v-form>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const loading = ref(false)
const formRef = ref()

const breadcrumbs = [
  { title: t('dashboard'), disabled: false, to: '/' },
  { title: t('students'), disabled: false, to: '/students' },
  { title: t('addStudent'), disabled: true, to: '/students/add' },
]

const form = ref({
  firstName: '',
  lastName: '',
  gender: null,
  dob: '',
  phone: '',
  email: '',
  address: '',
  fatherName: '',
  motherName: '',
  parentPhone: '',
  classId: null,
  section: null,
  admissionDate: new Date().toISOString().substr(0, 10),
})

const genderOptions = [
  { title: 'Male', value: 'male' },
  { title: 'Female', value: 'female' }
]

const classOptions = [
  { title: 'Class 1/A', value: 1 },
  { title: 'Class 1/B', value: 2 },
  { title: 'Class 2/A', value: 3 },
  { title: 'Class 2/B', value: 4 },
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // router.push('/students')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.gap-2 {
    gap: 8px;
}
</style>