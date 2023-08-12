<template>
  <input 
    id="email"
    type="text"
    placeholder="Correo electrónico"
    v-model="email"
    :disabled="status.isLoading"
  >
  <button 
    @click="sendAuthCode"
    :disabled="status.isLoading"
  >
    Enviar código
  </button>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { user } from '@stores/session'

const email = ref('')
const status = reactive({
  error: null,
  success: false,
  isLoading: false,
})

const sendAuthCode = async () => {
  //  TODO:  Email validation

  status.error = null
  status.success = false
  status.isLoading = true

  user.set({ email: email.value })

  // TODO:  Supabase logic to send code

}
</script>@helpers/crypto