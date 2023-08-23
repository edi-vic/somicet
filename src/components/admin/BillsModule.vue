<template>
  <section class="bills__table">
    <ul class="bills__header">
      <li class="bills__titles">
        <div class="bills__title bills__title--status">
          Estado
        </div>
        <div class="bills__title bills__title--actions">
          Acciones
        </div>
        <div class="bills__title bills__title--folio">
          Folio
        </div>
        <div class="bills__title bills__title--name">
          Nombre
        </div>
        <div class="bills__title bills__title--denomination">
          Razón social
        </div>
        <div class="bills__title bills__title--rfc">
          RFC
        </div>
        <div class="bills__title bills__title--address">
          Dirección
        </div>
      </li>
    </ul>
    <ul class="bills__rows">
      <li
        class="bills__row"
        v-for="bill in bills" 
        :key="bill.id"
      >
        <div class="bills__cell bills__cell--status">
          <div :class="`status-tag status-tag--${bill.status}`" />
        </div>
        <div class="bills__cell bills__cell--actions">
          <button
            v-if="bill.status === 'pending'"
            class="action"
          >
            Validar
          </button>
          <span v-else>-</span>
        </div>
        <div class="bills__cell bills__cell--folio">
          {{ bill.serial_number }}
        </div>
        <div class="bills__cell bills__cell--name">
          {{ bill.name }}
        </div>
        <div class="bills__cell bills__cell--denomination">
          {{ bill.denomination }}
        </div>
        <div class="bills__cell bills__cell--rfc">
          {{ bill.rfc  }}
        </div>
        <div class="bills__cell bills__cell--address">
          {{ bill.address }}
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { supabase } from "@helpers/supabase"

/*  vue  state  */
const bills = ref([])
const bill = ref(null)
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  lifecycle  */
onMounted(() => {
  getBills()
})

/*  vue  methods  */
const getBills = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("bills")
    .select()
    .order("serial_number", { ascending: false })

  if (error) {
    status.error = error.message
    console.error("Error in getBills: ", error.message)
  } else {
    console.log("getBills: ", data)
    bills.value = data
    status.success = true
  }

  status.loading = false
}
</script>

<style lang="scss" scoped>
.bills {
  &__table {
    border: 1px solid lightgray;
  }
  &__titles, &__row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid lightgray;
  }
  &__titles {
    font-weight: bold;
  }
  &__rows {
    max-height: 78vh;
    overflow-y: scroll;
  }
  &__row {
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: #f5f5f5;
    }
  }
  &__title, &__cell {
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid lightgray;
    &--status, &--actions, &--folio {
      width: 10%;
    }
    &--name, &--denomination {
      width: 20%;
    }
    &--rfc, &--address {
      width: 15%;
    }
  }
}
.status-tag {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid lightgray;
  &--requested {
    background-color: yellow;
  }
  &--approved {
    background-color: green;
  }
}
</style>