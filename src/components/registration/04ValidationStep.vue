<template>
  <section>
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
    </article>
  </section>
  <section class="validation">
    <div v-if="registration.status === REGISTRATION_STATUS[0] ">
      <p>
        Tu registro está en proceso de validación
      </p>
    </div>
    <div v-else-if="registration.status === REGISTRATION_STATUS[1] ">
      <p>
        ¡Tu registro fue validado! Te esperamos en el evento.
      </p>
    </div>
    <div v-else-if="registration.status === REGISTRATION_STATUS[2] ">
      <p>
        Tu registro fue rechazado
      </p>
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
.validation {
  margin-bottom: 20px;
  p {
    color: $black;
    font-size: 20px;
    font-weight: 400;
  }
}
</style>