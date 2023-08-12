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
}

</script>