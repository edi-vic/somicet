<template>
  <div
    class="registration-container"
    :class="{ 'registration-container--loading': status.loading }"
  >
    <Loader v-if="status.loading" />
    <EmailStep
      v-if="!status.loading && step === REGISTRATION_STEPS[0]"
      @success="handleNextStep"
    />
    <OtpStep
      v-if="!status.loading && step === REGISTRATION_STEPS[1]"
      @restart="handleRestart"
      @success="handleNextStep"
    />
    <NameStep 
      v-if="!status.loading && step === REGISTRATION_STEPS[2]"
      :profile="profile"
      :getUserId="getUserId"
      @success="handleNextStep"
    />
    <RegistrationStep
      v-if="!status.loading && step === REGISTRATION_STEPS[3]"
      :profile="profile"
      :getUserId="getUserId"
      @success="handleNextStep"
    />
    <ValidationStep
      v-if="!status.loading && step === REGISTRATION_STEPS[4]"
      :profile="profile"
      :registration="registration"
    />
    <BillStep
      v-if="!status.loading && step === REGISTRATION_STEPS[4]"
      :registration="registration"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Loader from '@components/core/Loader.vue'
import EmailStep from '@components/registration/00EmailStep.vue'
import OtpStep from '@components/registration/01OtpStep.vue'
import NameStep from '@components/registration/02NameStep.vue'
import RegistrationStep from '@components/registration/03RegistrationStep.vue'
import ValidationStep from '@components/registration/04ValidationStep.vue'
import BillStep from '@components/registration/05BillStep.vue'
import { REGISTRATION_STEPS } from '@helpers/constants'
import { supabase } from '@helpers/supabase'
import { session, getUserId } from '@stores/session'

/*  vue  state  */
const step = ref(null)
const profile = ref({})
const registration = ref({})

const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  lifecycle  */
onMounted(async () => {
  await getUserProfile()
})

/*  vue  methods  */
const getUserProfile = async () => {
  const userId = getUserId()
  if (!userId) {
    step.value = REGISTRATION_STEPS[0]
    return
  }

  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error in getUserProfile: ', error)
    step.value = REGISTRATION_STEPS[0]
  } else {
    const { id, email, first_name, last_name } = data
    session.set({ 
      user_id: id,
      user_email: email,
    })
    if (!first_name || !last_name) {
      step.value = REGISTRATION_STEPS[2]
      profile.value = {
        email
      }
    } else {
      profile.value = {
        firstName: first_name,
        lastName: last_name,
        email
      }
      getRegistration()
    }
    status.success = true
  }

  status.loading = false
}

const handleNextStep = (val) => {
  if (
    val === REGISTRATION_STEPS[2] || 
    val === REGISTRATION_STEPS[3] ||
    val === REGISTRATION_STEPS[4]
  ) {
    getUserProfile()
  } else {
    step.value = val
  }
}

const handleRestart = () => {
  session.set({ 
    user_id: "",
    user_email: "",
  })
  step.value = REGISTRATION_STEPS[0]
}

const getRegistration = async () => {
  const userId = getUserId()

  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from('registrations')
    .select()
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.log('here', error, error.message)
    step.value = REGISTRATION_STEPS[3]
  } else {
    console.log('there', data)
    registration.value = data
    step.value = REGISTRATION_STEPS[4]
  }
  status.loading = false
}

</script>

<style scoped lang="scss">
.registration-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &--loading {
    height: 300px;
  }
}
</style>