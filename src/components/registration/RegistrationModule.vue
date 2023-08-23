<template>
  <EmailStep
    v-if="step === REGISTRATION_STEPS[0]"
    @success="handleNextStep"
  />
  <OtpStep
    v-if="step === REGISTRATION_STEPS[1]"
    @success="handleNextStep"
  />
  <NameStep 
    v-if="step === REGISTRATION_STEPS[2]"
    :profile="profile"
    :getUserId="getUserId"
    @success="handleNextStep"
  />
  <RegistrationStep
    v-if="step === REGISTRATION_STEPS[3]"
    :profile="profile"
    :getUserId="getUserId"
    @success="handleNextStep"
  />
  <ValidationStep
    v-if="step === REGISTRATION_STEPS[4]"
    :profile="profile"
    :registration="registration"
  />
  <BillStep
    v-if="step === REGISTRATION_STEPS[4]"
    :registration="registration"
  />
</template>

<script setup>
import EmailStep from '@components/registration/00EmailStep.vue'
import OtpStep from '@components/registration/01OtpStep.vue'
import NameStep from '@components/registration/02NameStep.vue'
import RegistrationStep from '@components/registration/03RegistrationStep.vue'
import ValidationStep from '@components/registration/04ValidationStep.vue'
import BillStep from '@components/registration/05BillStep.vue'
import { ref, reactive, onMounted } from 'vue'
import { REGISTRATION_STEPS } from '@helpers/constants'
import { session } from '@stores/session'
import { supabase } from '@helpers/supabase'

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
const getUserId = () => session.get()?.user_id

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
  } else {
    const { id, email, first_name, last_name } = data
    session.set({ 
      user_id: id,
      user_email: email,
    })
    if (!first_name || !last_name) {
      step.value = REGISTRATION_STEPS[2]
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

const handleNextStep = (val) => step.value = val

const getRegistration = async () => {
  const userId = getUserId()

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
  
}

</script>