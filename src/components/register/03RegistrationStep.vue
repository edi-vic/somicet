<template>
  <section>
    <p>
      Correo
    </p>
    <p>
      {{ profile.email }}
    </p>
    <p>
      Nombre
    </p>
    <p>
      {{ profile.firstName }} {{ profile.lastName }}
    </p>
  </section>
  <section class="registration-step">
    <label for="secondment">
      Adscripción
    </label>
    <input 
      id="secondment"
      type="text"
      placeholder="Adscripción"
      v-model="secondment"
      :disabled="status.loading"
    >
    <span v-if="status.error">
      {{ status.error }}
    </span>
    <label for="group">
      Grupo
    </label>
    <select v-model="group">
      <option
        v-for="option in groups"
        :key="option.code"
        :value="option.code"
        :disabled="option.code === 'no_group'"
      >
        {{ option.copy }}
      </option>
    </select>
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
import { REGISTRATION_GROUPS } from '@helpers/constants'
import { isEmpty } from '@helpers/validators'
import { supabase } from '@helpers/supabase'

/*  vue  props  */
const { profile } = defineProps({
  profile: {
    type: Object,
    required: true,
  },
})

/*  vue  state  */
const secondment = ref('')
const group = ref('no_group')
const file = ref(null)
const status = reactive({
  error: null,
  success: false,
  loading: false,
})
const receipt = ref('')

/*  vue  computed  */
const groups = computed(() => Object.values(REGISTRATION_GROUPS))

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

// event-x
// name -<
// email -<
// secondment -?
// group-*
// receipt_url-*
// status-x
// user_id-x

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

<style lang="scss">
.registration-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>