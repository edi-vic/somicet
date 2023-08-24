<template>
  <details class="bill-step">
    <summary class="bill-step__summary">
        Datos de facturación
    </summary>
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
  </details>
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
@import "@assets/library";
.bill-step {
  &__summary {
    cursor: pointer;
  }
  &__title {
    margin-bottom: 16px;
  }
  &__form {
    padding: 20px 0;
    width: 440px; // temporal
    display: flex;
    flex-direction: column;
  }
  &__label {
    font-size: 16px;
    margin-bottom: 8px;
  }
  &__input {
    height: 50px;
    border: 1px solid lightgray;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 16px;
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
}
</style>