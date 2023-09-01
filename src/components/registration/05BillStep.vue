<template>
  <section
    class="bill-step bill-step--loading"
    v-if="status.loading"
  >
    <Loader />
  </section>

  <details
    v-if="!status.loading && !bill.id"
    class="bill-step"
  >
    <summary class="bill-step__summary">
        ¿Deseas facturar?
    </summary>
    <form class="bill-step__form">
      <p>Ingresa tuas datos a continuación:</p>
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
        :disabled="status.loading || !isFormComplete"
        type="submit"
      >
        Enviar
      </button>
    </form>
  </details>

  <details
    v-if="!status.loading && bill.id"
    class="bill-step"
  >
    <summary class="bill-step__summary">
        Datos de tu factura
    </summary>
    <div class="bill-step__form">
      <h5>
        Nombre
      </h5>
      <p>
        {{ bill.name }}
      </p>
      <h5>
        Razón social
      </h5>
      <p>
        {{ bill.denomination }}
      </p>
      <h5>
        RFC
      </h5>
      <p>
        {{ bill.rfc }}
      </p>
      <h5>
        Domicilio fiscal
      </h5>
      <p>
        {{ bill.address }}
      </p>
    </div>
  </details>
</template>

<script setup>
import Loader from "@components/core/Loader.vue"
import { ref, reactive, computed, onMounted } from "vue"
import { supabase } from '@helpers/supabase'
import { isEmpty } from "@helpers/validators"

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

/*  vue  computed  */
const isFormComplete = computed(() => {
  return !isEmpty(bill.value.name) && 
    !isEmpty(bill.value.denomination) && 
    !isEmpty(bill.value.rfc) && 
    !isEmpty(bill.value.address)
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
    bill.value = data
    status.success = true
  }

  status.loading = false
}

const saveBill = async (e) => {
  e.preventDefault()
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

  const { data, error } = await supabase
    .from("bills")
    .insert(record)
    .select()
    .single()

  if (error) {
    console.error("Error in saveBill: ", error.message)
  } else {
    bill.value = data
    status.success = true
  }

  status.loading = false
}
</script>

<style lang="scss" scoped>
@import "@assets/library";
.bill-step {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &--loading {
    align-items: center;
    height: 300px;
  }
  &__summary {
    cursor: pointer;
  }
  &__title {
    margin-bottom: 16px;
  }
  p {
    margin-bottom: 12px;
  }
  &__form {
    padding: 12px 0;
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
    &:disabled {
      background-color: $primary-color-600;
      cursor: not-allowed;
    }
  }
}
</style>