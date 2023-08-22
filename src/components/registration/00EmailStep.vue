<template>
  <section class="email-step">
    <label for="email">
      Correo electrónico
    </label>
    <input 
      id="email"
      type="text"
      placeholder="Correo electrónico"
      v-model="email"
      :disabled="status.loading"
      @input="validateEmail"
    >
    <span v-if="status.error">
      {{ status.error }}
    </span>
    <button 
      @click="sendAuthCode"
      :disabled="status.loading || !isEmailValid"
    >
      Enviar código
    </button>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue"
import { session } from "@stores/session"
import { REGISTER_STEPS } from "@helpers/constants"
import { supabase } from "@helpers/supabase"
import { isEmpty, isEmail } from "@helpers/validators"

/*  vue  emits  */
const emit = defineEmits(["success"])

/*  vue  state  */
const email = ref("")
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  computed  */
const isEmailValid = computed(() => 
  !isEmpty(email.value) && isEmail(email.value))

/*  vue  lifecycle  */
onMounted(() => {
  const storedEmail = session.get()?.user_email || ""
  if (storedEmail) email.value = storedEmail
})

/*  vue  methods  */
const validateEmail = () => {
  const empty = isEmpty(email.value)
  const valid = isEmail(email.value)

  if (empty)
    status.error = "El campo de correo electrónico no puede estar vacío."
  else if (!valid)
    status.error = "Por favor, ingresa un correo electrónico válido."
  else
    status.error = null
}

const sendAuthCode = async () => {
  const _email = email.value.trim()

  status.loading = true
  status.success = false
  status.error = null

  session.set({ user_email: _email })

  const { error } = await supabase
    .auth
    .signInWithOtp({ email: _email })

  if (error) {
    // TODO: find errors ej. code every 60 seconds
    console.error("Error in sendAuthCode: ", error.message)
  } else {
    status.success = true
    emit("success", REGISTER_STEPS[1])
  }

  status.loading = false
}
</script>

<style lang="scss">
.email-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>