<template>
  <EmailStep
    v-if="step === REGISTRATION_STEPS[0]"
    @success="handleNextStep"
  />
  <OtpStep
    v-if="step === REGISTRATION_STEPS[1]"
    @success="handleNextStep"
  />
  <ProjectStep
    v-if="step === REGISTRATION_STEPS[4]"
    :registration="registration"
  />
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import EmailStep from "@components/registration/00EmailStep.vue"
import OtpStep from "@components/registration/01OtpStep.vue"
import ProjectStep from "@components/registration/06ProjectStep.vue"
import { REGISTRATION_STEPS } from "@helpers/constants"
import { supabase } from "@helpers/supabase"
import { session, getUserId } from "@stores/session"

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
const handleNextStep = (val) => step.value = val

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
    .from("profiles")
    .select()
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Error in getUserProfile: ", error)
  } else {
    const { id, email, first_name, last_name } = data
    session.set({ 
      user_id: id,
      user_email: email,
    })
    if (!first_name || !last_name) {
      // todo: send to registration step
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

const getRegistration = async () => {
  const userId = getUserId()

  const { data, error } = await supabase
    .from("registrations")
    .select()
    .eq("user_id", userId)
    .single()
  
  if (error) {
    console.log("here", error, error.message)
    step.value = REGISTRATION_STEPS[3]
  } else {
    console.log("there", data)
    registration.value = data
    step.value = REGISTRATION_STEPS[4]
  }
  
}
</script>

<style scoped lang="scss">
</style>