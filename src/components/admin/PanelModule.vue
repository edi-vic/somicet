<template>
  <section class="panel">
    <h2 class="panel__subtitle">Usuarios</h2>
    <div class="panel__section">
      <div class="panel__module">
        <p class="panel__big-no">{{ profiles.users }}</p>
        <p class="panel__title">Usuarios</p>
      </div>
      <div class="panel__module">
        <p class="panel__big-no">{{ profiles.admins }}</p>
        <p class="panel__title">Admins</p>
      </div>
    </div>

    <h2 class="panel__subtitle">Registros</h2>
    <div class="panel__section">
      <div class="panel__module">
        <p class="panel__big-no">{{ registrations.total }}</p>
        <p class="panel__title">Total</p>
      </div>
      <div class="panel__module panel__module--wide">
        <p class="panel__big-no">{{ registrations.pending }}</p>
        <p class="panel__title">
          <span class="status-tag status-tag--pending" />
          Pendientes
        </p>
      </div>
      <div class="panel__module panel__module--wide">
        <p class="panel__big-no">{{ registrations.approved }}</p>
        <p class="panel__title">
            <span class="status-tag status-tag--approved" />
            Aprobados
        </p>
      </div>
      <div class="panel__module panel__module--wide">
        <p class="panel__big-no">{{ registrations.rejected }}</p>
        <p class="panel__title">
          <span class="status-tag status-tag--rejected" />
          Rechazados
        </p>
      </div>
    </div>

    <h2 class="panel__subtitle">Carteles</h2>
    <div class="panel__section">
      <div class="panel__module">
        <p class="panel__big-no">{{ posters.total }}</p>
        <p class="panel__title">Total</p>
      </div>
      <div class="panel__module panel__module--wide">
        <p class="panel__big-no">{{ posters.pending }}</p>
        <p class="panel__title">
          <span class="status-tag status-tag--pending" />
          Pendientes
        </p>
      </div>
      <div class="panel__module panel__module--wide">
        <p class="panel__big-no">{{ posters.approved }}</p>
        <p class="panel__title">
            <span class="status-tag status-tag--approved" />
            Aprobados
        </p>
      </div>
      <div class="panel__module panel__module--wide">
        <p class="panel__big-no">{{ posters.rejected }}</p>
        <p class="panel__title">
          <span class="status-tag status-tag--rejected" />
          Rechazados
        </p>
      </div>
    </div>

    <h2 class="panel__subtitle">Facturas</h2>
    <div class="panel__section">
      <div class="panel__module">
        <p class="panel__big-no">{{ bills.total }}</p>
        <p class="panel__title">Total</p>
      </div>
      <div class="panel__module panel__module--wide">
        <p class="panel__big-no">{{ bills.pending }}</p>
        <p class="panel__title">
          <span class="status-tag status-tag--pending" />
          Pendientes
        </p>
      </div>
      <div class="panel__module panel__module--wide">
        <p class="panel__big-no">{{ bills.approved }}</p>
        <p class="panel__title">
            <span class="status-tag status-tag--approved" />
            Aprobados
        </p>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { supabase } from "@helpers/supabase"

/*  vue  state  */
const profiles = ref({
  users: 0,
  admins: 0,
})

const registrations = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
})

const posters = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
})

const bills = ref({
  total: 0,
  pending: 0,
  approved: 0,
})

/*  vue  lifecycle  */
onMounted(() => {
  getProfiles()
  getRegistrations()
  getPosters()
  getBills()
})

const getProfiles = async () => {
  const { data, error } = await supabase
    .rpc('total_profiles_and_admins')
    .single()

  if (error) {
    console.error("Error in getProfiles: ", error)
  } else {
    const { total_profiles: users, total_admins: admins } = data
    profiles.value = { users, admins }
  }
}

const getRegistrations = async () => {
  const { data, error } = await supabase
    .rpc('total_registrations_and_status')
    .single()

  if (error) {
    console.error("Error in getRegistrations: ", error)
  } else {
    const { 
      total_registrations: total,
      pending_registrations: pending,
      approved_registrations: approved,
      rejected_registrations: rejected
    } = data
    registrations.value = { total, pending, approved, rejected }
  }
}

const getPosters = async () => {
  const { data, error } = await supabase
    .rpc('total_posters_and_status')
    .single()

  if (error) {
    console.error("Error in getPosters: ", error)
  } else {
    const { 
      total_posters: total,
      pending_posters: pending,
      approved_posters: approved,
      rejected_posters: rejected
    } = data
    posters.value = { total, pending, approved, rejected }
  }
}

const getBills = async () => {
  const { data, error } = await supabase
    .rpc('total_bills_and_status')
    .single()

  if (error) {
    console.error("Error in getBills: ", error)
  } else {
    const { 
      total_bills: total,
      pending_bills: pending,
      approved_bills: approved
    } = data
    bills.value = { total, pending, approved }
  }
}


</script>

<style scoped lang="scss">
@import "@assets/library";
.panel {
  max-height: calc(90vh - 135px);
  overflow-y: auto;
  padding: 20px;
  border: 1px solid $gray;
  border-radius: 8px;
  &__subtitle {
    margin-bottom: 8px;
  }
  &__section {
    width: 100%;
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    padding-left: 20px;
  }
  &__module{
    width: 120px;
    height: 120px;
    background-color: $white;
    border-radius: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &--wide {
      width: 140px;
    }
  }
  &__big-no {
    font-size: 48px;
    font-weight: 700;
    color: $primary-color;
    text-align: center;
  }
  &__title {
    font-size: 16px;
    font-weight: 700;
    color: $black;
    text-align: center;
    display: flex;
  }
}

.status-tag {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid $gray;
  display: inline-block;
  margin-right: 8px;
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
</style>