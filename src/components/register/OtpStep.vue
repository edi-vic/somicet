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
import { ref, reactive, computed } from 'vue'
import { session, expiration, user } from '@stores/session';
import { isEmpty, isLength } from '@helpers/validators'
import { supabase } from '@helpers/supabase'

//  STATE 
const code = ref('')
const status = reactive({
  error: null,
  success: false,
  loading: false,
})

//  COMPUTED 
const isCodeValid = computed(() => 
  !isEmpty(code.value) && isLength(code.value, 6))

//  METHODS 
const validateAuthCode = async () => {
  const email = user.get().email

  status.error = null
  status.success = false
  status.loading = true

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code.value,
    type: 'email'
  })

  if (error?.message) {
    status.error = error.message
  } else {
    saveStorage(data)
  }

  status.loading = false
}

const saveStorage = (data) => {
  const { 
    session: { access_token, refresh_token, expires_at },
    user: { id }
  } = data

  session.set({ access_token, refresh_token })
  expiration.set(expires_at)
  user.set({ id }) // FIX

  status.success = true
}
</script>