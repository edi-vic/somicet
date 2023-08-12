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
import { ref, reactive, computed, onMounted } from 'vue'
import { user } from '@stores/session'
import { isEmpty, isEmail } from '@helpers/validators'
import { supabase } from '@helpers/supabase'

//  STATE 

const storedEmail = user.get().email || ''
const email = ref(storedEmail)
const status = reactive({
  error: null,
  success: false,
  loading: false,
})

//  COMPUTED 

const isEmailValid = computed(() => 
  !isEmpty(email.value) && isEmail(email.value))

//  METHODS 

const validateEmail = () => {
  const empty = isEmpty(email.value)
  const valid = isEmail(email.value)

  if (empty)
    status.error = 'El campo de correo electrónico no puede estar vacío.'
  else if (!valid)
    status.error = 'Por favor, ingresa un correo electrónico válido.'
  else
    status.error = null
}

const sendAuthCode = async () => {
  const _email = email.value.trim()

  status.error = null
  status.success = false
  status.loading = true

  user.set({ email: _email })

  const { error } = await supabase.auth.signInWithOtp({ email: _email })

  if (error?.message) {
    status.error = error.message
  } else {
    status.success = true
  }
  status.loading = false

}
</script>