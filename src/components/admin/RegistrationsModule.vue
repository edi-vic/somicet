<template>
  <section class="registrations__table">
    <div class="registrations__control">
      <input
        class="registrations__search"
        type="text"
        placeholder="Buscar"
        v-model="search"
      />
      <select
        class="registrations__select"
        v-model="registrationsStatusSelect"
      >
        <option
          v-for="option in registrationStatus"
          :key="option.code"
          :value="option.code"
        >
          {{ option.copy }}
        </option>
      </select>
      <select
        class="registrations__select"
        v-model="registrationsGroupSelect"
      >
        <option
          v-for="option in registrationGroups"
          :key="option.code"
          :value="option.code"
        >
          {{ option.copy }}
        </option>
      </select>
    </div>
    <ul class="registrations__header">
      <li class="registrations__titles">
        <div class="registrations__title registrations__title--folio">
          Folio
        </div>
        <div class="registrations__title registrations__title--status">
          Estado
        </div>
        <div class="registrations__title registrations__title--actions">
          Acciones
        </div>
        <div class="registrations__title registrations__title--name">
          Nombre
        </div>
        <div class="registrations__title registrations__title--email">
          Correo
        </div>
        <div class="registrations__title registrations__title--group">
          Grupo
        </div>
      </li>
    </ul>
    <ul class="registrations__rows">
      <li
        class="registrations__row"
        v-for="registration in filteredRegistrations" 
        :key="registration.id"
      >
        <div class="registrations__cell registrations__cell--folio">
          {{ registration.serial_number }}
        </div>
        <div class="registrations__cell registrations__cell--status">
          <div :class="`status-tag status-tag--${registration.status}`" />
        </div>
        <div class="registrations__cell registrations__cell--actions">
          <button
            v-if="registration.status === 'pending'"
            class="action"
            @click="handleRegistration(registration)"
          >
            Validar
          </button>
          <span v-else>-</span>
        </div>
        <div class="registrations__cell registrations__cell--name">
          {{ registration.name }}
        </div>
        <div class="registrations__cell registrations__cell--email">
          {{ registration.email }}
        </div>
        <div class="registrations__cell registrations__cell--group">
          {{ handleGroup(registration.group).copy }}
        </div>
      </li> 
    </ul>
  </section>
  <ValidationDialog
    v-if="registration"
    :registration="registration"
    :handleGroup="handleGroup"
    @close="registration = null"
  />
</template>

<script setup>
import ValidationDialog from "@components/admin/ValidationDialog.vue"
import { ref, reactive, computed, onMounted } from "vue"
import { REGISTRATION_STATUS_FULL, REGISTRATION_GROUPS } from "@helpers/constants"
import { supabase } from "@helpers/supabase"

/*  vue  state  */
const registrations = ref([])
const registration = ref(null)
const search = ref("")
const registrationsStatusSelect = ref("no_status")
const registrationsGroupSelect = ref("no_group")
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  lifecycle  */
onMounted(() => {
  getRegistrations()
})

/*  vue  computed  */
const registrationStatus = computed(() => Object.values(REGISTRATION_STATUS_FULL))
const registrationGroups = computed(() => Object.values(REGISTRATION_GROUPS))

const filteredRegistrations = computed(() => {
  const searchValue = search.value.toLowerCase()
  const statusValue = registrationsStatusSelect.value
  const groupValue = registrationsGroupSelect.value

  return registrations.value.filter((registration) => {
    const name = registration.name.toLowerCase()
    const email = registration.email.toLowerCase()
    const status = registration.status
    const group = registration.group

    const searchMatch = name.includes(searchValue) || email.includes(searchValue)
    const statusMatch = statusValue === "no_status" || statusValue === status
    const groupMatch = groupValue === "no_group" || groupValue === group

    return searchMatch && statusMatch && groupMatch
  })
})

/*  vue  methods  */
const getRegistrations = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("registrations")
    .select()
    .order("serial_number", { ascending: false })

  if (error) {
    status.error = error.message
    console.error("Error in getRegistrations: ", error.message)
  } else {
    console.log("getRegistrations: ", data)
    registrations.value = data
    status.success = true
  }

  status.loading = false
}

const handleGroup = (group) => {
  switch (group) {
    case REGISTRATION_GROUPS[1].code:
      return REGISTRATION_GROUPS[1]
    case REGISTRATION_GROUPS[2].code:
     return REGISTRATION_GROUPS[2]
    case REGISTRATION_GROUPS[3].code:
      return REGISTRATION_GROUPS[3]
    case REGISTRATION_GROUPS[4].code:
      return REGISTRATION_GROUPS[4]
    default:
      return REGISTRATION_GROUPS[0]
  }
}

const handleRegistration = (element) => {
  registration.value = element
}
</script>

<style scoped lang="scss">
@import "@assets/library";
.registrations {
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
    color: white;
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
    max-height: 70vh;
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
    &:last-child {
      border-right: none;
    }
    &--folio, &--status {
      width: 10%;
    }
    &--actions, &--name, &--email, &--group {
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
  padding: 8px 12px;
  border: 1px solid lightgray;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
}
</style>