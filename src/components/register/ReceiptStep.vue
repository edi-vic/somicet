<template>
  <section>
    <label for="receipt">
      Recibo
    </label>
    <input 
      id="receipt"
      type="file"
      accept="image/*"
      @change="handleFile"
    >
    <span v-if="status.error">
      {{ status.error }}
    </span>
    <button 
      @click="getPublicUrl"
      :disabled="status.loading"
    >
      Subir recibo
    </button>
    <img
      v-if="receipt"
      :src="receipt"
      alt=""
    >
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { session as user } from '@stores/session'
import { isEmpty } from '@helpers/validators'
import { supabase } from '@helpers/supabase'

//  STATE 
const file = ref(null)
const status = reactive({
  error: null,
  success: false,
  loading: false,
})
const receipt = ref('')

//  METHODS 
const handleFile = (event) => {
  file.value = event.target.files[0]
}

const uploadReceipt = async () => {
  const userId = user.get().id

  status.error = null
  status.success = false
  status.loading = true

  const { data, error } = await supabase
    .storage
    .from('receipts')
    .upload(`receipts/23/${userId}`, file.value)

  console.log(data, error)

  if (error?.message) {
    status.error = error.message
  } else {
    getPublicUrl()
  }
}

const getPublicUrl = () => {
  console.log('getPublicUrl')
  const userId = user.get().id
  const key = `receipts/23/${userId}`

  const { data } = supabase
    .storage
    .from('receipts')
    .getPublicUrl(key)
  
  console.log(data)

  receipt.value = data.publicUrl

  return data
}

const saveStorage = (data) => {
  console.log(data)
  const userId = user.get().id

  const { data: res, error } = supabase
    .from('event_attendees')
    .update({ receipt: data.Key })
    .eq('user_id', userId)

  console.log(res, error)

  if (error?.message) {
    status.error = error.message
  } else {
    status.success = true
  }

  status.loading = false
}

</script>