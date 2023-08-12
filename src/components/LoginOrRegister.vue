<template>
  <!-- <p>
    Inicia o registrarte, con un enlace a tu correo.
  </p> -->
    <!-- <input 
      :disabled="status.isLoading"
      id="email"
      type="text"
      placeholder="Correo"
      v-model="email"
    > -->
    <div v-show="status.error">
      {{ status.error }}
    </div>
    <div v-show="status.success">
        Revisa tu bandeja de entrada.
    </div>
    <!-- <button 
      @click="sendAuthLink"
      :disabled="status.isLoading"
    >
      Enviar enlace
    </button> -->
    <div v-show="status.isLoading">
      Cargando...
    </div>
    <p>{{ $user.email }}</p>
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
import { useStore } from '@nanostores/vue'
import { user } from '../stores/session'
import { supabase } from '../helpers/supabase'

const $user = useStore(user)
// const stEmail= user.get().email || ''
// const email = ref(stEmail)
// const code = ref('')
// const status = reactive({
//   error: null,
//   success: false,
//   isLoading: false,
// })

const sendAuthLink = async () => {
  // status.error = null
  // status.success = false
  // status.isLoading = true

  // user.setKey('email', email.value)


  // const { error } = await supabase.auth.signInWithOtp({
  //   email: email.value,
  // })

  // if (error && error.message) {
  //   status.error = error.message
  //   status.success = false
  // } else {
  //   status.success = true
  // }
  // status.isLoading = false

}

// const validateCode = async () => {

//   if (!email.value || !code.value) return

//   status.error = null
//   status.success = false
//   status.isLoading = true

//   const { data, error } = await supabase.auth.verifyOtp({ 
//     email: email.value,
//     token: code.value, 
//     type: 'email'
//   })

//   console.log(data, error)
//   if (error?.message) {
//     status.error = error.message
//     status.success = false
//   } else {
//     status.success = true
//   }
//   status.isLoading = false
// }
</script>