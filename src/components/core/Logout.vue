<template>
  <button @click="logout">
    Cerrar sesión
  </button>
</template>

<script setup>
import { supabase } from '@helpers/supabase';
import { session } from '@stores/session';

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error(error)
    return
  }
  session.set({ 
    user_id: "",
    user_email: "",
  })
  document.cookie = "sbat=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = '/admin/inicio';
}
</script>

<style scoped lang="scss">
@import "@assets/library";

button {
  height: 50px;
  width: 150px;
  background-color: $primary-color;
  border: none;
  border-radius: 8px;
  color: $white;
  font-size: 16px;
  cursor: pointer;
}
</style>