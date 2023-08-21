<template>
  <section class="registrations__table">
    <ul class="registrations__header">
      <li class="registrations__titles">
        <div class="registrations__title registrations__title--status">
          Estatus
        </div>
        <div class="registrations__title registrations__title--actions">
          Acciones
        </div>
        <div class="registrations__title registrations__title--folio">
          Folio
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
        <div class="registrations__title registrations__title--secondment">
          Adscripción
        </div>
      </li>
    </ul>
    <ul class="registrations__rows">
      <li
        class="registrations__row"
        v-for="registration in registrations" 
        :key="registration.id"
      >
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
        <div class="registrations__cell registrations__cell--folio">
          {{ registration.serial_number }}
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
        <div class="registrations__cell registrations__cell--secondment">
          {{ registration.secondment || "-" }}
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
import { ref, reactive, onMounted } from "vue"
import { REGISTRATION_GROUPS } from "@helpers/constants"
import { supabase } from "@helpers/supabase"

/*  vue  state  */
const registrations = ref([])
const registration = ref(null)
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  lifecycle  */
onMounted(() => {
  getRegistrations()
  // const obj = {
  //   "id": "0dbc37c9-06a7-4189-a4bc-1de609e5d812",
  //   "created_at": "2023-08-21T02:43:23.964578+00:00",
  //   "name": "Víctor Peña Romero",
  //   "email": "vic.pero@icloud.com",
  //   "secondment": "UNAM",
  //   "group": "student",
  //   "receipt_url": "https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/receipts/receipts/23SIM1/071bf837-f3a7-41d9-bee5-7f042d4d1bcb-2023-08-21-02:43:21",
  //   "status": "pending",
  //   "user_id": "071bf837-f3a7-41d9-bee5-7f042d4d1bcb",
  //   "event": "23SIM1",
  //   "serial_number": 1
  // }
  // const array = Array(100).fill().map(() => ({ ...obj }));
  // registrations.value = array
})

/*  vue  methods  */
const getRegistrations = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("registrations")
    .select()

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

<style lang="scss">
.registrations {
  &__table {
    border: 1px solid lightgray;
  }
  &__rows {
    max-height: 78vh;
    overflow-y: scroll;
  }
  &__titles, &__row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid lightgray;
  }
  &__titles {
    font-weight: bold;
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
    &--name, &--email {
      width: 20%;
    }
    &--group, &--secondment {
      width: 15%;
    }
  }
}
.status-tag {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid lightgray;
  &--pending {
    background-color: yellow;
  }
  &--approved {
    background-color: green;
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