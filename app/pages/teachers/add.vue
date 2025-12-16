<template>
  <v-container fluid class="bg-grey-lighten-4 h-100">
    <Breadcrumbs :breadcrumbs="breadcrumbs" class="mb-4" />
    
    <v-card elevation="0" class="rounded-xl border">
      <v-form ref="formRef" @submit.prevent="save">
        <v-card-text class="pa-8">
          <!-- Personal Information & Image -->
          <div class="mb-6">
            <h3 class="text-h6 font-weight-bold mb-4 d-flex align-center text-secondary">
              <v-icon start color="primary" class="mr-2">mdi-account-details</v-icon>
              Personal Information
            </h3>
            <v-row>
              <!-- Image Upload Section -->
              <v-col cols="12" md="4" class="d-flex justify-center align-start">
                <div class="d-flex flex-column align-center">
                  <div class="position-relative">
                    <v-avatar size="200" color="grey-lighten-3" class="border-dashed rounded-lg">
                      <v-img v-if="previewImage" :src="previewImage" cover class="rounded-lg"></v-img>
                      <v-icon v-else size="60" color="grey-darken-1">mdi-camera-plus</v-icon>
                    </v-avatar>
                    <v-btn icon="mdi-pencil" size="small" color="primary" class="position-absolute bottom-0 right-0"
                      style="transform: translate(25%, 25%);" elevation="2" @click="triggerFileInput"></v-btn>
                  </div>
                  <p class="text-caption text-medium-emphasis mt-4 font-weight-medium">Upload Teacher Photo</p>
                  <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleFileChange">
                </div>
              </v-col>

              <!-- Basic Fields -->
              <v-col cols="12" md="8">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-label class="mb-2 font-weight-medium">First Name</v-label>
                    <v-text-field v-model="form.firstName" placeholder="Enter first name" variant="outlined"
                      density="comfortable" color="primary" hide-details="auto"
                      prepend-inner-icon="mdi-account-outline"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="mb-2 font-weight-medium">Last Name</v-label>
                    <v-text-field v-model="form.lastName" placeholder="Enter last name" variant="outlined"
                      density="comfortable" color="primary" hide-details="auto"
                      prepend-inner-icon="mdi-account-outline"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="mb-2 font-weight-medium">Date of Birth</v-label>
                    <v-text-field v-model="form.dob" type="date" variant="outlined" density="comfortable"
                      color="primary" hide-details="auto"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-label class="mb-2 font-weight-medium">Gender</v-label>
                    <v-select v-model="form.gender" :items="genderOptions" placeholder="Select gender"
                      variant="outlined" density="comfortable" color="primary" hide-details="auto"
                      prepend-inner-icon="mdi-gender-male-female"></v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>

          <v-divider class="mb-8"></v-divider>

          <!-- Contact Information -->
          <div class="mb-6">
            <h3 class="text-h6 font-weight-bold mb-4 d-flex align-center text-secondary">
              <v-icon start color="primary" class="mr-2">mdi-card-account-phone</v-icon>
              Contact Information
            </h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Phone Number</v-label>
                <v-text-field v-model="form.phone" placeholder="+856 20 ..." variant="outlined" density="comfortable"
                  color="primary" hide-details="auto" prepend-inner-icon="mdi-phone-outline"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Email Address</v-label>
                <v-text-field v-model="form.email" placeholder="teacher@example.com" variant="outlined"
                  density="comfortable" color="primary" hide-details="auto"
                  prepend-inner-icon="mdi-email-outline"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-label class="mb-2 font-weight-medium">Current Address</v-label>
                <v-textarea v-model="form.address" placeholder="Enter full address" variant="outlined"
                  density="comfortable" color="primary" rows="3" hide-details="auto"
                  prepend-inner-icon="mdi-map-marker-outline"></v-textarea>
              </v-col>
            </v-row>
          </div>

          <!-- Professional Information -->
          <div class="mb-6">
            <h3 class="text-h6 font-weight-bold mb-4 d-flex align-center text-secondary">
              <v-icon start color="primary" class="mr-2">mdi-briefcase-outline</v-icon>
              Professional Information
            </h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Subject</v-label>
                <v-select v-model="form.subject" :items="subjectOptions" placeholder="Select subject" variant="outlined"
                  density="comfortable" color="primary" hide-details="auto"
                  prepend-inner-icon="mdi-book-open-variant"></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Qualification</v-label>
                <v-text-field v-model="form.qualification" placeholder="e.g. Bachelor's Degree" variant="outlined"
                  density="comfortable" color="primary" hide-details="auto"
                  prepend-inner-icon="mdi-certificate-outline"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Experience (Years)</v-label>
                <v-text-field v-model="form.experience" type="number" placeholder="e.g. 5" variant="outlined"
                  density="comfortable" color="primary" hide-details="auto"
                  prepend-inner-icon="mdi-briefcase-clock-outline"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Join Date</v-label>
                <v-text-field v-model="form.joinDate" type="date" variant="outlined" density="comfortable"
                  color="primary" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
          </div>

          <!-- Emergency Contact -->
          <div class="mb-2">
            <h3 class="text-h6 font-weight-bold mb-4 d-flex align-center text-secondary">
              <v-icon start color="primary" class="mr-2">mdi-alert-circle-outline</v-icon>
              Emergency Contact
            </h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Contact Name</v-label>
                <v-text-field v-model="form.emergencyName" placeholder="Enter contact name" variant="outlined"
                  density="comfortable" color="primary" hide-details="auto"
                  prepend-inner-icon="mdi-account-alert-outline"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Relationship</v-label>
                <v-text-field v-model="form.emergencyRelation" placeholder="e.g. Spouse, Parent" variant="outlined"
                  density="comfortable" color="primary" hide-details="auto"
                  prepend-inner-icon="mdi-account-heart-outline"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-label class="mb-2 font-weight-medium">Emergency Phone</v-label>
                <v-text-field v-model="form.emergencyPhone" placeholder="Emergency contact number" variant="outlined"
                  density="comfortable" color="primary" hide-details="auto"
                  prepend-inner-icon="mdi-phone-alert-outline"></v-text-field>
              </v-col>
            </v-row>
          </div>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6 d-flex justify-end bg-grey-lighten-5">
          <v-btn variant="outlined" color="secondary" class="mr-3 text-none px-6" height="45" @click="$router.back()">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="flat" class="text-none px-8" height="45" type="submit" elevation="2">
            Save Teacher
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()

const breadcrumbs = [
  { title: t('dashboard'), disabled: false, to: '/' },
  { title: t('teachers'), disabled: false, to: '/teachers' },
  { title: 'Add Teacher', disabled: true, to: '/teachers/add' },
]

const form = ref({
  firstName: '',
  lastName: '',
  gender: null,
  dob: '',
  phone: '',
  email: '',
  address: '',
  subject: null,
  qualification: '',
  experience: '',
  joinDate: new Date().toISOString().substr(0, 10),
  emergencyName: '',
  emergencyRelation: '',
  emergencyPhone: ''
})

const genderOptions = [
  { title: 'Male', value: 'male' },
  { title: 'Female', value: 'female' }
]

// Mock subject options
const subjectOptions = [
  { title: 'Mathematics', value: 'math' },
  { title: 'Physics', value: 'physics' },
  { title: 'Chemistry', value: 'chemistry' },
  { title: 'Biology', value: 'biology' },
  { title: 'English', value: 'english' },
  { title: 'History', value: 'history' },
  { title: 'Geography', value: 'geography' },
  { title: 'Computer Science', value: 'cs' }
]

// Image Upload Logic
const fileInput = ref<HTMLInputElement | null>(null)
const previewImage = ref<string | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const save = () => {
  // TODO: Implement save logic
  console.log('Form submitted:', form.value)
  // Simulate success
  // router.push('/teachers')
}
</script>

<style scoped>
.border-dashed {
  border: 2px dashed rgba(var(--v-theme-secondary), 0.3) !important;
}
</style>