<template>
  <div
    class="poster-container"
    :class="{ 'poster-container--loading': status.loading }"
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
    <PosterStep
      v-if="!status.loading && step === REGISTRATION_STEPS[4]"
      :registration="registration"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import Loader from '@components/core/Loader.vue'
import EmailStep from "@components/registration/00EmailStep.vue"
import OtpStep from "@components/registration/01OtpStep.vue"
import PosterStep from "@components/registration/06PosterStep.vue"
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
const handleNextStep = (val) => {
  if (
    val === REGISTRATION_STEPS[2]
  ) {
    getUserProfile()
  } else {
    step.value = val
  }
}
const handleSuccess = (data) => {
  registration.value = data
  getUserProfile()
}

const handleRestart = () => {
  session.set({ 
    user_id: "",
    user_email: "",
  })
  step.value = REGISTRATION_STEPS[0]
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
    .from("profiles")
    .select()
    .eq("id", userId)
    .single()

  if (error) {
    step.value = REGISTRATION_STEPS[0]
    console.error("Error in getUserProfile: ", error.message)
  } else {
    const { id, email, first_name, last_name } = data
    session.set({ 
      user_id: id,
      user_email: email,
    })
    if (!first_name || !last_name) {
      window.location.href = '/registro/formulario';
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

  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("registrations")
    .select()
    .eq("user_id", userId)
    .single()
  
  if (error) {
    console.error("Error in getRegistration: ", error, error.message)
    window.location.href = '/registro/formulario';
  } else {
    registration.value = data
    step.value = REGISTRATION_STEPS[4]
  }
  
}
</script>

<style scoped lang="scss">
.poster-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  &--loading {
    height: 300px;
    justify-content: center;
    align-items: center;
  }
}
</style>