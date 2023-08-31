<template>
  <section class="bills__table">
    <div class="bills__control">
      <input
        class="bills__search"
        type="text"
        placeholder="Buscar"
        v-model="search"
      />
      <select
        class="bills__select"
        v-model="billsStatusSelect"
      >
        <option
          v-for="option in billStatus"
          :key="option.code"
          :value="option.code"
        >
          {{ option.copy }}
        </option>
      </select>
    </div>
    <ul class="bills__header">
      <li class="bills__titles">
        <div class="bills__title bills__title--folio">
          Folio
        </div>
        <div class="bills__title bills__title--status">
          Estado
        </div>
        <div class="bills__title bills__title--actions">
          Acciones
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
      </li>
    </ul>
    <div 
      class="bills__status"
      v-if="status.loading"
    >
      <Loader />
    </div>
    <div 
      class="bills__status"
      v-else-if="!status.loading && !filteredBills.length"
    >
      <span>No hay registros</span>
    </div>
    <ul
      class="bills__rows"
      v-else-if="!status.loading"
    >
      <li
        class="bills__row"
        v-for="bill in filteredBills" 
        :key="bill.id"
      >
        <div class="bills__cell bills__cell--folio">
          {{ bill.serial_number }}
        </div>
        <div class="bills__cell bills__cell--status">
          <div :class="`status-tag status-tag--${bill.status}`" />
        </div>
        <div class="bills__cell bills__cell--actions">
          <button
            class="action"
            v-if="bill.status === 'pending'"
            @click="handleBill(bill)"
          >
            <img
              class="action__image"
              src="@assets/icons/check.svg"
              alt="Validar"
            />
            <span>Revisar</span>
          </button>
          <button
            class="action"
            v-else
            @click="handleBill(bill)"
          >
            <img
              class="action__image"
              src="@assets/icons/view.svg"
              alt="Ver"
            />
            <span>Ver</span>
          </button>
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
      </li>
    </ul>
  </section>
  <BillsValidation
    v-if="bill"
    :bill="bill"
    @update="handleUpdate"
    @close="bill = null"
  />
</template>

<script setup>
import Loader from "@components/core/Loader.vue"
import BillsValidation from "@components/admin/BillsValidation.vue"
import { ref, reactive, computed, onMounted } from "vue"
import { supabase } from "@helpers/supabase"
import { BILL_STATUS } from "@helpers/constants";

/*  vue  state  */
const bills = ref([])
const bill = ref(null)

const search = ref("")
const billsStatusSelect = ref("no_status")

const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  lifecycle  */
onMounted(() => {
  getBills()
})

/*  vue  computed  */
const billStatus = computed(() => Object.values(BILL_STATUS))

const filteredBills = computed(() => {
  const searchValue = search.value.toLowerCase()
  const statusValue = billsStatusSelect.value

  return bills.value.filter((bill) => {
    const name = bill.name.toLowerCase()
    const denomination = bill.denomination.toLowerCase()
    const rfc = bill.rfc.toLowerCase()
    const status = bill.status.toLowerCase()

    const searchMatch = name.includes(searchValue)
      || denomination.includes(searchValue)
      || rfc.includes(searchValue)
    const statusMatch = statusValue === "no_status" || status === statusValue

    return searchMatch && statusMatch
  })
})

/*  vue  methods  */
const getBills = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("bills")
    .select(`*,
      registrations (
        email,
        group
      )
    `)
    .order("serial_number", { ascending: false })

  if (error) {
    status.error = error.message
    console.error("Error in getBills: ", error.message)
  } else {
    bills.value = data
    status.success = true
  }

  status.loading = false
}

const handleBill = (element) => {
  bill.value = element
}

const handleUpdate = (element) => {
  const index = bills.value.findIndex((bill) => bill.id === element.id)
  bills.value[index] = element
  bill.value = null
}
</script>

<style lang="scss" scoped>
@import "@assets/library";
.bills {
  &__table {
    border: 1px solid $gray;
    border-radius: 8px;
  }
  &__control {
    padding: 16px;
    display: flex;
  }
  &__search, &__select {
    width: 300px;
    height: 50px;
    border: 1px solid $gray;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 16px;
    margin-right: 12px;
    appearance:none;
  }
  &__header {
    background: $primary-color;
    color: $white;
  }
  &__status {
    width: 100%;
    height: 35vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__titles, &__row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid $gray;
  }
  &__titles {
    font-weight: bold;
  }
  &__rows {
    max-height: 70vh;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &__row {
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: $lightgray;
    }
  }
  &__title, &__cell {
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid $gray;
    &:last-child {
      border-right: none;
    }
    &--folio, &--status {
      width: 10%;
    }
    &--actions, &--name, &--denomination, &--rfc {
      width: 20%;
    }
  }
}
.status-tag {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid $gray;
  &--pending {
    background: $yellow;
  }
  &--approved {
    background: $green;
  }
  &--rejected {
    background: $red;
  }
}
.action {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  border: 1px solid $gray;
  border-radius: 4px;
  background-color: $white;
  cursor: pointer;
  &__image {
    width: 16px;
    margin-right: 8px;
  }
  &:hover {
    background-color: $lightgray;
  }
}
</style>