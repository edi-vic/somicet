<template>
  <ul class="registrations__table">
    <li class="registrations__header">
      <div>
        Folio
      </div>
      <div>
        Nombre
      </div>
      <div>
        Correo
      </div>
      <div>
        Adscripción
      </div>
      <div>
        Grupo
      </div>
      <div>
        Estatus
      </div>
    </li>
    <li
      class="registrations__row"
      v-for="attendee in attendees" 
      :key="attendee.id"
    >
      <div>
        {{ attendee.serial_number }}
      </div>
      <div>
        {{ attendee.name }}
      </div>
      <div>
        {{ attendee.email }}
      </div>
      <div>
        {{ attendee.secondment || "-" }}
      </div>
      <div>
        {{ attendee.group }}
      </div>
      <div>
        {{ attendee.status }}
      </div>
    </li>
  </ul>

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { supabase } from '@helpers/supabase'

/*  vue  state  */
const attendees = ref([])
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  lifecycle  */
onMounted(() => {
  // getRegistrations()
  const obj = {
    "id": "0dbc37c9-06a7-4189-a4bc-1de609e5d812",
    "created_at": "2023-08-21T02:43:23.964578+00:00",
    "name": "Víctor Peña Romero",
    "email": "vic.pero@icloud.com",
    "secondment": "UNAM",
    "group": "student",
    "receipt_url": "https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/receipts/receipts/23SIM1/071bf837-f3a7-41d9-bee5-7f042d4d1bcb-2023-08-21-02:43:21",
    "status": "pending",
    "user_id": "071bf837-f3a7-41d9-bee5-7f042d4d1bcb",
    "event": "23SIM1",
    "serial_number": 1
  }
  const array = Array(20).fill().map(() => ({ ...obj }));
  attendees.value = array
})

/*  vue  methods  */
const getRegistrations = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from('registrations')
    .select()

  if (error) {
    status.error = error.message
    console.error('Error in getRegistrations: ', error.message)
  } else {
    console.log('getRegistrations: ', data)
    attendees.value = data
    status.success = true
  }

  status.loading = false
}
</script>

<style lang="scss">
.registrations {
  &__table {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid lightgray;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    border-bottom: 1px solid lightgray;
    font-weight: bold;
  }
  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    border-bottom: 1px solid lightgray;
  }
}
</style>