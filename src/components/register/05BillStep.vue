<template>
  <section class="bill-step">
    <h2 class="bill-step__title">
      Datos de facturación
    </h2>
    <div class="bill-step__form">
      <label 
        class="bill-step__label"
        for="name"
      >
        Nombre
      </label>
      <input 
        id="name" 
        class="bill-step__input"
        type="text" 
        placeholder="Nombre"
        v-model="bill.name"
      />
      <label 
        class="bill-step__label"
        for="denomination"
      >
        Razón social
      </label>
      <input 
        id="denomination" 
        class="bill-step__input"
        type="text" 
        placeholder="Razón social"
        v-model="bill.denomination"
      />
      <label 
        class="bill-step__label"
        for="rfc"
      >
        RFC
      </label>
      <input 
        id="rfc" 
        class="bill-step__input"
        type="text" 
        placeholder="RFC"
        v-model="bill.rfc"
      />
      <label 
        class="bill-step__label"
        for="address"
      >
        Domicilio fiscal
      </label>
      <input 
        id="address" 
        class="bill-step__input"
        type="text" 
        placeholder="Dirección"
        v-model="bill.address"
      />
      <button 
        class="bill-step__button"
        @click="saveBill"
      >
        Enviar
    </button>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { supabase } from '@helpers/supabase'

/*  vue  props  */
const { registration } = defineProps({
  registration: {
    type: Object,
    required: true,
  },
})

/*  vue  state  */
const bill = ref({
  name: "",
  denomination: "",
  rfc: "",
  address: "",
})
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  lifecycle  */
onMounted(() => {
  getBill()
})

/*  vue  methods  */
const getBill = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("bills")
    .select()
    .eq("registration_id", registration.id)
    .single()

  if (error) {
    console.error("Error in getBill: ", error.message)
  } else {
    console.log(data)
    bill.value = data
    status.success = true
  }

  status.loading = false
}

const saveBill = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const record = {
    "name": bill.value.name,
    "denomination": bill.value.denomination,
    "rfc": bill.value.rfc,
    "address": bill.value.address,
    "registration_id": registration.id,
    "user_id": registration.user_id,
  }

  console.log(record)

  const { data, error } = await supabase
    .from("bills")
    .insert(record)

  if (error) {
    console.error("Error in saveBill: ", error.message)
  } else {
    console.log(data)
    status.success = true
  }

  status.loading = false
}
</script>

<style lang="scss" scoped>
.bill-step {
  &__title {
    margin-bottom: 16px;
  }
  &__form {
    width: 440px; // temporal
    display: flex;
    flex-direction: column;
  }
  &__label {
    font-size: 16px;
    margin-bottom: 8px;
  }
  &__input {
    font-size: 16px;
    height: 60px;
    margin-bottom: 16px;
  }
  &__button {
    font-size: 16px;
    height: 60px;
    margin-top: 4px;
  
  }
}
</style>