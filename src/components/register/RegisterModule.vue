<template>
  <EmailStep
    v-if="step === REGISTER_STEPS[0]"
    @success="handleNextStep"
  />
  <OtpStep
    v-if="step === REGISTER_STEPS[1]"
    @success="handleNextStep"
  />
  <NameStep 
    v-if="step === REGISTER_STEPS[2]"
    :profile="profile"
    :getUserId="getUserId"
    @success="handleNextStep"
  />
  <RegistrationStep
    :profile="profile"
    :getUserId="getUserId"
    v-if="step === REGISTER_STEPS[3]"
    @success="handleNextStep"
  />
</template>

<script setup>
import EmailStep from '@components/register/00EmailStep.vue'
import OtpStep from '@components/register/01OtpStep.vue'
import NameStep from '@components/register/02NameStep.vue'
import RegistrationStep from '@components/register/03RegistrationStep.vue'
import { ref, reactive, onMounted } from 'vue'
import { session } from '@stores/session'
import { supabase } from '@helpers/supabase'
import { REGISTER_STEPS } from '@helpers/constants'

/*  vue  state  */
const step = ref(null)
const profile = ref({})
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
    step.value = REGISTER_STEPS[0]
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
      step.value = REGISTER_STEPS[2]
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

  console.log(data)
  
  if (error) {
    console.log('here', error, error.message)
    step.value = REGISTER_STEPS[3]
  } else {
    step.value = REGISTER_STEPS[4]
  }
  
}

</script>