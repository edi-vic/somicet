<template>
  <MailStep />
  <OtpStep />
  <NameStep
    :firstName="firstName"
    @ready='getEventRegistration' 
  />
  <ReceiptStep />
</template>

<script setup>
import MailStep from '@components/register/MailStep.vue'
import OtpStep from '@components/register/OtpStep.vue'
import NameStep from '@components/register/NameStep.vue'
import ReceiptStep from '@components/register/ReceiptStep.vue'
import { ref } from 'vue'
import { user } from '@stores/session'
import { supabase } from '@helpers/supabase'

/*  STATE  */
const firstName = ref('')

/*  METHODS  */
const getEventRegistration = async () => {
  const userId = await user.get()?.id
  const { data, error } = await supabase
    .from('event_attendees')
    .select('first_name')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.log(error, error.message)
  } else {
    firstName.value = data.first_name
  }
  
  console.log(data, error)
}

</script>