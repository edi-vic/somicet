<template>
  <EmailStep
    v-if="step === PROJECT_STEPS[0]"
  />
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import EmailStep from '@components/registration/00EmailStep.vue'
import { PROJECT_STEPS } from "@helpers/constants"
import { getUserId } from "@stores/session"

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
const getUserProfile = async () => {
  const userId = getUserId()
  if (!userId) {
    step.value = PROJECT_STEPS[0]
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
</script>

<style scoped lang="scss">
</style>