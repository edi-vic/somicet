<template>
  <section>
    <label for="email">
      Correo electrónico
    </label>
    <input 
      id="email"
      type="text"
      placeholder="Correo electrónico"
      v-model="email"
      :disabled="status.isLoading"
    >
    <button 
      @click="sendAuthCode"
      :disabled="status.isLoading || !isEmailValid"
    >
      Enviar código
    </button>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { user } from '@stores/session'
import { isEmpty, isEmail } from '@helpers/validators'

//  STATE 
const stEmail = user.get().email || ''
const email = ref(stEmail)
const status = reactive({
  error: null,
  success: false,
  isLoading: false,
})

//  COMPUTED 
const isEmailValid = computed(() => 
  !isEmpty(email.value) && isEmail(email.value))

//  METHODS 
const sendAuthCode = async () => {
  const _email = email.value.trim()

  status.error = null
  status.success = false
  status.isLoading = true

  user.set({ email: _email })

  // TODO:  Supabase logic to send code

}
</script>