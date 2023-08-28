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
  document.cookie = "sbat=;"
  window.location.href = '/admin/inicio';
}
</script>