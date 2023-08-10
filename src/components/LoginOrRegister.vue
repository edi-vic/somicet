<template>
  <p>
    Inicia o registrarte, con un enlace a tu correo.
  </p>
    <input 
      :disabled="status.isLoading"
      id="email"
      type="text"
      placeholder="Correo"
      v-model="email"
    >
    <div v-show="status.error">
      {{ status.error }}
    </div>
    <div v-show="status.success">
        Revisa tu bandeja de entrada.
    </div>
    <button 
      @click="sendAuthLink"
      :disabled="status.isLoading"
    >
      Enviar enlace
    </button>
    <div v-show="status.isLoading">
      Cargando...
    </div>
    <input 
      :disabled="status.isLoading"
      id="code"
      type="text"
      placeholder="Codigo"
      v-model="code"
    >
    <button 
      @click="validateCode"
      :disabled="status.isLoading"
    >
      Validar código
    </button>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { supabase } from '../services/supabase'

const email = ref('')
const code = ref('')
const status = reactive({
  error: null,
  success: false,
  isLoading: false,
})

const sendAuthLink = async () => {
  status.error = null
  status.success = false
  status.isLoading = true

  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: import.meta.env.PUBLIC_REDIRECT_URL
    }
  })

  if (error?.message) {
    status.error = error.message
    status.success = false
  } else {
    status.success = true
  }
  status.isLoading = false

}

const validateCode = async () => {
  status.error = null
  status.success = false
  status.isLoading = true

  const { data, error } = await supabase.auth.verifyOtp({ 
    email: email.value,
    token: code.value, 
    type: 'email'
  })

  console.log(data, error)
  if (error?.message) {
    status.error = error.message
    status.success = false
  } else {
    status.success = true
  }
  status.isLoading = false
}
</script>