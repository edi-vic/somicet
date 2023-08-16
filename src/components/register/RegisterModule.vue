<template>
  <EmailStep
    v-if="step === STEPS[0]"
    @success="handleNextStep"
  />
  <OtpStep
    v-if="step === STEPS[1]"
    @success="handleNextStep"
  />
  <NameStep v-if="step === STEPS[2]"/>
</template>

<script setup>
import EmailStep from '@components/register/00EmailStep.vue'
import OtpStep from '@components/register/01OtpStep.vue'
import NameStep from '@components/register/NameStep.vue'
import { ref, reactive, onMounted } from 'vue'
import { session } from '@stores/session'
import { supabase } from '@helpers/supabase'
import { STEPS } from '@helpers/constants'

/*  vue  state  */
const step = ref(null)
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
  const user_id = getUserId()
  if (!user_id) {
    step.value = STEPS[0]
    return
  }

  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', user_id)
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
      step.value = STEPS[2]
    } else {
      step.value = STEPS[3]
    }
    status.success = true
  }

  status.loading = false
}

const handleNextStep = (val) => step.value = val

// const getEventRegistration = async () => {
//   return
//   const userId = await user.get()?.id
//   const { data, error } = await supabase
//     .from('event_attendees')
//     .select('first_name')
//     .eq('user_id', userId)
//     .single()
  
//   if (error) {
//     console.log('here', error, error.message)
//   } else {
//     firstName.value = data.first_name
//   }
  
//   console.log(data, error)
// }

</script>