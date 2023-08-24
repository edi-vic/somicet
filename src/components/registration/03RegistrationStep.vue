<template>
  <section>
    <User :profile="profile" />
  </section>
  <section class="registration-step">
    <label
      class="registration-step__label"
      for="secondment"
    >
      Adscripción
    </label>
    <input
      class="registration-step__input"
      id="secondment"
      type="text"
      placeholder="Adscripción"
      v-model="secondment"
      :disabled="status.loading"
    >
    <div class="registration-step__input-error">
      <span v-if="status.error">
        {{ status.error }}
      </span>
    </div>
    <label
      class="registration-step__label"
      for="group"
    >
      Grupo
    </label>
    <select
      class="registration-step__input"
      v-model="group"
    >
      <option
        v-for="option in groups"
        :key="option.code"
        :value="option.code"
        :disabled="option.code === 'no_group'"
      >
        {{ option.copy }}
      </option>
    </select>
    <div class="registration-step__input-error">
      <span v-if="status.error">
        {{ status.error }}
      </span>
    </div>
    <label
      class="registration-step__label"
      for="receipt"
    >
      Recibo
    </label>
    <input
      v-if="!receiptUrl"
      class="registration-step__input"
      id="receipt"
      type="file"
      accept="image/*"
      @change="handleFile"
    >
    <img
      v-if="receiptUrl"
      :src="receiptUrl"
      alt=""
    >
    <div class="registration-step__input-error">
      <span v-if="status.error">
        {{ status.error }}
      </span>
    </div>
    <button
      class="registration-step__button"
      @click="saveRegistration"
      :disabled="status.loading"
    >
      Guardar registro
    </button>
  </section>
</template>

<script setup>
import User from '@components/core/User.vue';
import { ref, reactive, computed } from 'vue'
import { REGISTRATION_STEPS, REGISTRATION_GROUPS } from '@helpers/constants'
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
    emit("success", REGISTRATION_STEPS[4])
  }

  status.loading = false
}

</script>

<style lang="scss">
@import "@assets/library";
.registration-step {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &__label {
    font-size: 16px;
    margin-bottom: 12px;
  }
  &__input {
    height: 50px;
    border: 1px solid lightgray;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 16px;
    margin-bottom: 4px;
  }
  &__input-error {
    height: 16px;
    color: red;
    font-size: 12px;
    margin-bottom: 12px;
  }
  &__button {
    height: 50px;
    width: 100%;
    background-color: $primary-color;
    border: none;
    border-radius: 8px;
    color: $white;
    font-size: 16px;
    cursor: pointer;
  }
  @media (min-width: 992px) {
    max-width: 440px;
    &__label {
      font-size: 20px;
    }
    &__input {
      width: 440px;
      height: 60px;
    }
    &__input {
      font-size: 20px;
    }
    &__button {
      width: 440px;
      font-size: 20px;
    }
  }
}
</style>