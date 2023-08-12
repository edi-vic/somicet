<template>
  <section>
    <label for="code">
      Código
    </label>
    <input 
      id="code"
      type="text"
      placeholder="Código"
      v-model="code"
    >
    <button 
      @click="validateCode"
      :disabled="status.loading"
    >
      Validar código
    </button>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { session, expiration } from '@stores/session';
import { user } from '@stores/session'
import { supabase } from '@helpers/supabase'

const email = user.get().email || ''
const code = ref('')
const status = reactive({
  error: null,
  success: false,
  loading: false,
})

const validateCode = async () => {
  status.error = null
  status.success = false
  status.loading = true

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code.value,
    type: 'email'
  })

  console.log(data, error)

  if (error?.message) {
    status.error = error.message
  } else {
    const { session: { access_token, refresh_token, expires_at } } = data
    session.set({ access_token, refresh_token })
    expiration.set(expires_at)
    status.success = true
  } 
  status.loading = false
}

</script>