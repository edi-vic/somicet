<template>
  <EmailStep
    v-if="step === REGISTRATION_STEPS[0]"
    @success="handleNextStep"
  />
  <OtpStep
    v-if="step === REGISTRATION_STEPS[1]"
    @success="handleNextStep"
  />
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import EmailStep from '@components/registration/00EmailStep.vue'
import OtpStep from '@components/registration/01OtpStep.vue'
import { REGISTRATION_STEPS } from '@helpers/constants'
import { supabase } from '@helpers/supabase'
import { session, getUserId } from '@stores/session'

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
  // await getUserProfile()
  await getSession()
})

/*  vue  methods  */

const getSession = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error in getSession: ', error)
  } else {
    console.log('data: ', data)
    handleLogin(data)
    status.success = true
  }
  status.loading = false
}

const handleLogin = async ({ session }) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: new Headers({"Content-Type": "application/json"}),
      credentials: "same-origin",
      body: JSON.stringify(session),
    })

    console.log(response)
    window.location.href = '/admin';
  } catch (error) {
    console.error("Error in handleLogin: ", error)
  }
}

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
    // validación de admin
    status.success = true
  }

  status.loading = false
}

const handleNextStep = (val) => step.value = val
</script>