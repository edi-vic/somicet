<template>
  <MailStep :step="step" />
  <!-- <OtpStep />
  <NameStep/>
  <ReceiptStep /> -->
</template>

<script setup>
import MailStep from '@components/register/MailStep.vue'
import OtpStep from '@components/register/OtpStep.vue'
import NameStep from '@components/register/NameStep.vue'
import ReceiptStep from '@components/register/ReceiptStep.vue'
import { ref, reactive, onMounted } from 'vue'
import { session } from '@stores/session'
import { supabase } from '@helpers/supabase'
import { STEPS } from '@helpers/constants'

/*  vue  state  */
const step = ref(STEPS[0])

/*  vue  lifecycle  */
onMounted(async () => {
  await getUserProfile()
})

/*  vue  methods  */
const getUserId = async () => await session.get()?.user_id

const getUserProfile = async () => {
  const user_id = await getUserId()
  if (!user_id) {
    step.value = STEPS[0]
    return
  }

  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', user_id)
    .single()

  if (error) {
    console.error('Error in getUserProfile: ', error)
  } else {
    console.log('DATA ', data)
  }
}


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