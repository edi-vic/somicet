<template>
  <section class="panel">
    <div class="panel__module">
      <p class="panel__big-no">{{ profiles.users }}</p>
      <p class="panel__title">Usuarios</p>
    </div>
    <div class="panel__module">
      <p class="panel__big-no">{{ profiles.admins }}</p>
      <p class="panel__title">Admins</p>
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

/*  vue  lifecycle  */
onMounted(() => {
  getProfiles()
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

</script>

<style scoped lang="scss">
@import "@assets/library";
.panel {
  width: 100%;
  display: flex;
  gap: 16px;
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
  }
}
</style>