<template>
  <section class="otp-step">
    <label for="code">
      Código
    </label>
    <input 
      id="code"
      type="text"
      placeholder="Código"
      v-model="code"
      :disabled="status.loading"
      @input="validateCode"
    >
    <span v-if="status.error">
      {{ status.error }}
    </span>
    <button 
      @click="validateAuthCode"
      :disabled="status.loading || !isCodeValid"
    >
      Validar código
    </button>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from "vue"
import { session } from "@stores/session"
import { STEPS } from "@helpers/constants"
import { supabase } from "@helpers/supabase"
import { isEmpty, isLength } from "@helpers/validators"

/*  vue  emits  */
const emit = defineEmits(["success"])

/*  vue  state  */
const code = ref("")
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  computed  */
const isCodeValid = computed(() => 
  !isEmpty(code.value) && isLength(code.value, 6))

/*  vue  methods  */
const validateCode = () => {
  const empty = isEmpty(code.value)
  const length = isLength(code.value, 6)

  if (empty)
    status.error = "El código no puede estar vacío."
  else if (!length)
    status.error = "El código debe tener 6 dígitos"
  else
    status.error = null
}

const validateAuthCode = async () => {
  const email = session.get()?.user_email

  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .auth
    .verifyOtp({
      email,
      token: code.value,
      type: "email"
    })
  
  console.log(data, error)

  if (error) {
    // TODO: find errors ej. wrong code
    console.error("Error in validateAuthCode: ", error.message)
  } else {
    const { user: { id } } = data
    session.set({ 
      user_id: id,
      user_email: email,
    })
    status.success = true
    emit("success", STEPS[2])
  }

  status.loading = false
}
</script>

<style lang="scss">
.otp-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>