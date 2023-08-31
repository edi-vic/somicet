<template>

  <section class="validation">
    <User :profile="profile" />
  </section>

  <section class="validation">
    <div v-if="registration.status === REGISTRATION_STATUS[0] ">
      <p>
        Tu registro está en proceso de validación,
        te notificaremos por correo electrónico cuando esté listo.
      </p>
    </div>
    <div v-else-if="registration.status === REGISTRATION_STATUS[1] ">
      <p>
        ¡Tu registro fue validado! Te esperamos en el evento.
      </p>
    </div>
    <div v-else-if="registration.status === REGISTRATION_STATUS[2] ">
      <p>
        Tu registro fue rechazado, por favor intenta nuevamente.
      </p>
    </div>
  </section>
</template>

<script setup>
import User from '@components/core/User.vue';
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

<style scoped lang="scss">
@import "@assets/library";
.validation {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  p {
    color: $black;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>