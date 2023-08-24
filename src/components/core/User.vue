<template>
  <article class="user">
    <div class="user__element">
      <h5>
        Nombre
      </h5>
      <p>
        {{ profile.firstName }} {{ profile.lastName }}
      </p>
    </div>
    <div class="user__element">
      <h5>
        Correo electrónico
      </h5>
      <p>
        {{ profile.email }}
      </p>
    </div>
    <div class="user__element">
      <button @click="logout">
        Cerrar sesión
      </button>
    </div>
  </article>
</template>

<script setup>
import { supabase } from '@helpers/supabase';
import { session } from '@stores/session';

/*  vue  props  */
const { profile } = defineProps({
  profile: {
    type: Object,
    required: true,
  },
})

/*  vue  methods  */
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
  window.location.href = '/registro';
}

</script>

<style scoped lang="scss">
@import "@assets/library";
.user {
  background-color: $white;
  border-radius: 10px;
  border: 3px solid lightgray;
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-bottom: 20px;
  h5 {
    color: $primary-color;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  p {
    color: $black;
    font-size: 16px;
    font-weight: 400;
  }
  &__element {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>