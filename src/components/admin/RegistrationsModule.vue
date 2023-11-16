<template>
  <!-- <button @click="getAssistants">
    Generate CSV
  </button> -->
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
    <div 
      class="registrations__status"
      v-if="status.loading"
    >
      <Loader />
    </div>
    <div 
      class="registrations__status"
      v-else-if="!status.loading && !filteredRegistrations.length"
    >
      <span>No hay registros</span>
    </div>
    <ul 
      class="registrations__rows"
      v-else-if="!status.loading"
    >
      <li
        class="registrations__row"
        :class="`registrations__row--${!registration.assistance || registration.status === 'rejected' ? 'no-assistance' : 'assistance'}`"
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
            class="action action--diploma"
            v-if="registration.assistance && registration.status !== 'rejected'"
            @click="downloadDiploma(registration)"
          >
            Diploma
          </button>
          <button
            class="action"
            v-if="registration.status === 'pending'"
            @click="handleRegistration(registration)"
          >
            <img
              class="action__image"
              src="@assets/icons/check.svg"
              alt="Validar"
            />
            <span>Validar</span>
          </button>
          <button
            class="action"
            v-else
            @click="handleRegistration(registration)"
          >
            <img
              class="action__image"
              src="@assets/icons/view.svg"
              alt="Ver"
            />
            <span>Ver</span>
          </button>
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
  <RegistrationsValidation
    v-if="registration"
    :registration="registration"
    :handleGroup="handleGroup"
    @update="handleUpdate"
    @close="registration = null"
  />
</template>

<script setup>
import Loader from "@components/core/Loader.vue"
import RegistrationsValidation from "@components/admin/RegistrationsValidation.vue"
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
    const groupMatch = groupValue === "no_group" || groupValue === group || (groupValue === "no_group" && !group)

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
    registrations.value = data
    status.success = true
  }

  status.loading = false
}

const handleGroup = (groupCode) => {
  if (!groupCode) return '-'
  
  const group = Object.values(REGISTRATION_GROUPS)
    .find(group => group.code === groupCode)
    
  return group ? group : '-'
}


const handleRegistration = (element) => {
  registration.value = element
}

const handleUpdate = (element) => {
  const index = registrations.value.findIndex((registration) => registration.id === element.id)
  registrations.value[index] = element
  registration.value = null
}

const downloadDiploma = async (registration) => {

    const { id } = registration;

    const { data, error } = supabase
      .storage
      .from('diplomas')
      .getPublicUrl(`${id}.pdf`)

    const { publicUrl } = data
  window.open(publicUrl, '_blank');
}

// LOGIC FOR CSV GENERATION

const getAssistants = async () => {
  const { data, error } = await supabase
    .from("registrations")
    .select()
    .eq("assistance", true)
    .not("status", 'eq', "rejected")
    .order("serial_number", { ascending: false })

  if (error) {
    console.error("Error in getRegistrations: ", error.message)
  } else {
    console.log(data)
    const csvData = arrayToCSV(data);
    downloadCSV(csvData, 'diplomas.csv');
  }

}

function arrayToCSV(data) {
  // Crear los encabezados del CSV (basados en las claves del primer objeto, si todos tienen la misma estructura)
  const headers = Object.keys(data[0]).join(',');

  // Crear las filas del CSV
  const rows = data.map(obj => {
    return Object.keys(obj).map(key => {
      let val = obj[key];
      if (key === 'name') {
      // Eliminar espacios adicionales y convertir a mayúsculas
      val = val.replace(/\s+/g, ' ').trim().toUpperCase();
    }
      return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val; // Manejar comillas dentro de los valores
    }).join(',');
  });

  // Unir encabezados y filas, y agregar un salto de línea al final de cada fila
  return [headers].concat(rows).join('\r\n');
}

function downloadCSV(csvData, filename = 'data.csv') {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

</script>

<style scoped lang="scss">
@import "@assets/library";
.registrations {
  &__table {
    max-height: calc(90vh - 135px);
    border: 1px solid $gray;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
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
    font-weight: 600;
  }
  &__rows {
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &__row {
    &--no-assistance {
      background-color: $red;
    }
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
  display: flex;
  align-items: center;
  padding: 8px 20px;
  border: 1px solid $gray;
  border-radius: 4px;
  background-color: $white;
  cursor: pointer;
  &--diploma {
    margin-right: 8px;
  }
  &__image {
    width: 16px;
    margin-right: 8px;
  }
  &:hover {
    background-color: $lightgray;
  }
}
</style>