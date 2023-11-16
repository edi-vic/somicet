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
    <NoEmailRegister 
      v-if="!status.loading && step === REGISTRATION_STEPS[2]"
      @restart="handleRestart"
    />
    <!-- <NameStep 
      v-if="!status.loading && step === REGISTRATION_STEPS[2]"
      :profile="profile"
      :getUserId="getUserId"
      @success="handleNextStep"
    /> -->
    <RegistrationStep
      v-if="!status.loading && step === REGISTRATION_STEPS[3]"
      :profile="profile"
      :registration="registration"
      :getUserId="getUserId"
      @success="handleNextStep"
    />
    <ValidationStep
      v-if="!status.loading && step === REGISTRATION_STEPS[4] && assistance"
      :profile="profile"
      :registration="registration"
      @download="downloadDiploma"
    />
    <section 
      class="registration-container__msg"
      v-if="!status.loading && step === REGISTRATION_STEPS[4] && !assistance"
    >
      <User :profile="profile" />
      <p>
        Lamentamos informarte que no cumples con los requisitos necesarios para obtener la constancia. Si tienes alguna pregunta o necesitas aclaraciones, no dudes en ponerte en contacto con nosotros a través de <a href="mailto:somicet@gmail.com">somicet@gmail.com</a>.
      </p>

    </section>
    <!-- <BillStep
      v-if="!status.loading && step === REGISTRATION_STEPS[4] && registration.status === 'approved'"
      :registration="registration"
    /> -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Loader from '@components/core/Loader.vue'
import EmailStep from '@components/registration/00EmailStep.vue'
import User from '@components/core/User.vue';
import OtpStep from '@components/registration/01OtpStep.vue'
import NameStep from '@components/registration/02NameStep.vue'
import RegistrationStep from '@components/registration/03RegistrationStep.vue'
import ValidationStep from '@components/registration/04ValidationStep.vue'
import BillStep from '@components/registration/05BillStep.vue'
import NoEmailRegister from '@components/registration/NoEmailRegister.vue'
import { REGISTRATION_STEPS } from '@helpers/constants'
import { supabase } from '@helpers/supabase'
import { session, getUserId } from '@stores/session'

/*  vue  state  */
const step = ref(null)
const profile = ref({})
const registration = ref({})
const assistance = ref(false)

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

const handleReset = () => {
  getUserProfile()
  step.value = REGISTRATION_STEPS[3]
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
    console.error('Error in getRegistration: ', error.message)
    step.value = REGISTRATION_STEPS[3]
  } else {
    registration.value = data
    assistance.value = data.assistance
    if (data.receipt_url === null) {
      step.value = REGISTRATION_STEPS[3]
    } else {
      step.value = REGISTRATION_STEPS[4]
    }
  }
  status.loading = false
}

const downloadDiploma = async () => {
  const { data, error } = supabase
    .storage
    .from('diplomas')
    .getPublicUrl(`${registration.value.id}.pdf`)

  const { publicUrl } = data
  window.open(publicUrl, '_blank');
}

</script>

<style scoped lang="scss">
@import "@assets/library";
.registration-container {
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
  &__msg{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
    & p{
      font-size: 20px;
      line-height: 24px;
      color: $black;
      text-align: center;
      & a{
        text-decoration: none;
        color: $primary-color;
      }
    }
  }
}
</style>