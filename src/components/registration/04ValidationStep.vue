<template>
  
  <section class="validation">
    <h1>
      Constancia de asistencia.
    </h1>
    <User :profile="profile" />
  </section>
  <section class="validation__download">
    <button 
      class="principal-btn"
      @click="handleDownload"
    >
      Descargar constancia

    </button>
    <p>
      Muchas gracias por tu participación y esperamos contar contigo en futuros eventos.
    </p>
    
  </section>
  <!-- <section class="validation">
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
        Tu registro fue rechazado. Hubo una irregularidad
        en tus datos.
      </p>
      <p v-if="registration.note" class="validation__note">
        {{ registration.note }}
      </p>
      <p>
        Por favor, vuelve a enviar tu información.
      </p>
      <button 
        class="validation__button"
        @click="resetRegistration"
      >
        Reenviar registro
      </button>
    </div>
  </section> -->
</template>

<script setup>
import User from '@components/core/User.vue';
import { reactive } from 'vue'
import { REGISTRATION_STATUS } from '@helpers/constants';
import { supabase } from '@helpers/supabase';

const emit = defineEmits(["reset", "download"])


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

/*  vue  state  */
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  methods  */
const resetRegistration = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .rpc('reset_registration_fields', { r_id: registration.id })

  if (error) {
    console.error('Error in resetRegistration: ', error)
    status.error = error.message
  } else {
    status.success = true
    emit("reset")
  }
  status.loading = false
}

const handleDownload = (e) =>{
  e.preventDefault()
  emit('download')
}
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
    margin-bottom: 12px;
  }
  &__note {
    border: 1px solid $primary-color;
    border-radius: 8px;
    padding: 12px;
  }
  &__button {
    height: 50px;
    width: 100%;
    background-color: $primary-color;
    border: none;
    border-radius: 8px;
    color: $white;
    font-size: 16px;
    cursor: pointer;
  }
  &__download{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & p{
      font-size: 20px;
      line-height: 26px;
      font-weight: 700;
      margin-top: 20px;
      text-align: center;
    }
  }
  & h1{
    font-size: 24px;
    line-height: 28px;
    color: $black;
    margin-bottom: 20px;
  }
}
</style>