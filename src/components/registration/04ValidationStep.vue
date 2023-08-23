<template>
  <section>
    <p>
      Correo
    </p>
    <p>
      {{ profile.email }}
    </p>
    <p>
      Nombre
    </p>
    <p>
      {{ profile.firstName }} {{ profile.lastName }}
    </p>
  </section>
  <section>
    <div v-if="registration.status === REGISTRATION_STATUS[0] ">
      Tu registro está en proceso de validación
    </div>
    <div v-else-if="registration.status === REGISTRATION_STATUS[1] ">
      Tu registro fue validado
    </div>
    <div v-else-if="registration.status === REGISTRATION_STATUS[2] ">
      Tu registro fue rechazado
    </div>
  </section>
</template>

<script setup>
import { REGISTRATION_STATUS } from '@helpers/constants';

/*  vue  props  */
const { registration } = defineProps({
  profile: {
    type: Object,
    required: true,
  },
  registration: {
    type: Object,
    required: true,
  },
})
</script>