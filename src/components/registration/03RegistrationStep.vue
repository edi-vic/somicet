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
      @click="saveRegistration"
      :disabled="status.loading"
    >
      Guardar registro
    </button>
    <img
      v-if="receiptUrl"
      :src="receiptUrl"
      alt=""
    >
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { REGISTER_STEPS, REGISTRATION_GROUPS } from '@helpers/constants'
import { supabase } from '@helpers/supabase'

/*  vue  emits  */
const emit = defineEmits(["success"])

/*  vue  props  */
const { profile, getUserId } = defineProps({
  profile: {
    type: Object,
    required: true,
  },
  getUserId: {
    type: Function,
    required: true,
  },
})

/*  vue  state  */
const secondment = ref('')
const group = ref('no_group')
const file = ref(null)
const receiptUrl = ref('')
const status = reactive({
  error: null,
  success: false,
  loading: false,
})

/*  vue  computed  */
const groups = computed(() => Object.values(REGISTRATION_GROUPS))

/*  vue  methods  */
const handleFile = (event) => {
  file.value = event.target.files[0]
  uploadReceipt()
}

const uploadReceipt = async () => {
  const userId = getUserId()
  const todayArray = new Date().toISOString().split('T')
  const date = todayArray[0]
  const time = todayArray[1].split('.')[0]
  const path = `receipts/23SIM1/${userId}-${date}-${time}`

  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .storage
    .from('receipts')
    .upload(path, file.value)

  console.log(data, error)

  if (error) {
    // TODO: find errors
    console.error("Error in uploadReceipt: ", error.message)
  } else {
    await getPublicUrl(path)
    status.success = true
  }

  status.loading = false
}

const getPublicUrl = async (path) => {
  const { data, error } = await supabase
    .storage
    .from('receipts')
    .getPublicUrl(path)
  
  console.log(data, error)

  if (error) {
    // TODO: find errors
    console.error("Error in getPublicUrl: ", error.message)
  } else {
    receiptUrl.value = data.publicUrl
  }
}

const saveRegistration = async () => {
  const record = { 
    name: `${profile.firstName} ${profile.lastName}`,
    email: profile.email,
    secondment: secondment.value,
    group: group.value,
    receipt_url: receiptUrl.value,
  }

  console.log(record)

  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from('registrations')
    .insert(record)

  console.log(data, error)

  if (error) {
    // TODO: find errors
    console.error("Error in saveRegistration: ", error.message)
  } else {
    status.success = true
    emit("success", REGISTER_STEPS[4])
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