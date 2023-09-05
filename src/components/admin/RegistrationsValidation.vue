<template>
  <dialog class="validation">
    <!-- Main -->
    <div 
      class="validation__dialog"
      v-if="!status.loading && confirmation === ''"
    >
      <div class="validation__header">
        <h2 class="validation__title">
          Validación de registro
        </h2>
        <div class="validation__close">
          <button
            class="action"
            @click="$emit('close')"
          >
            <img
              class="action__image"
              src="@assets/icons/close.svg"
              alt="Cerrar"
            />
            <span>Cerrar</span>
          </button>
        </div>
      </div>

      <div class="validation__data">
        <div class="validation__row">
          <div class="validation__cell">
            <h6>
              Nombre
            </h6>
            <p>
              {{ registration.name }}
            </p>
          </div>
          <div class="validation__cell">
            <h6>
              Correo
            </h6>
            <p>
              {{ registration.email }}
            </p>
          </div>
        </div>

        <div class="validation__row">
          <div class="validation__cell">
            <h6>
              Adscripción
            </h6>
            <p>
              {{ registration.secondment }}
            </p>
          </div>
          <div class="validation__cell">
            <h6>
              Grupo
            </h6>
            <p>
              {{ handleGroup(registration.group).copy }}
            </p>
          </div>
        </div>
        
        <div class="validation__row">
          <div class="validation__cell">
            <h6>
              Aportación a cubrir
            </h6>
            <p>
              {{ handleGroup(registration.group).price }}
            </p>
          </div>
          <div class="validation__cell">
            <h6>
              Fecha de registro
            </h6>
            <p>
              {{ parseDate(registration.created_at) }}
            </p>
          </div>
        </div>
      </div>
      <a 
        class="validation__receipt"
        :href="registration.receipt_url" 
        target="_blank" 
        rel="noopener noreferrer"
        v-if="isPdf(registration.receipt_url)"
      >
        <template >
          Abrir archivo
        </template>
      </a>
      <div 
        class="validation__payment"
        v-else
      >
        <a 
          class="validation__btn"
          :href="registration.receipt_url"
          target="_blank"
        >
          Visualizar pago
        </a>
        <img
          :src="registration.receipt_url" 
          alt="recibo"
        >
      </div>

      <div
        v-if="registration.status === 'pending'"
        class="validation__actions"
      >
        <button 
          class="validation__action validation__action--reject"
          @click="handleFlow('reject')"
        >
          Rechazar
        </button>
        <button 
          class="validation__action validation__action--approve"
          @click="handleFlow('approve')"
        >
          Aprobar
        </button>
      </div>

      <div
        :class="`validation__status validation__status--${registration.status}`"
        v-else
      >
        <span>
          {{ registration.status === 'rejected' ? "Rechazado" : "Aprobado" }}
        </span>
      </div>

      <div
        class="validation__note"
        v-if="registration.note"
      >
        <h6>
          Motivo de rechazo
        </h6>
        <p>
          {{ registration.note }}
        </p>
      </div>
    </div>

    <!-- Approve -->
    <div
      class="validation__dialog"
      v-if="!status.loading && confirmation === 'approve'"
    >
      <div class="validation__close">
        <button
          class="action"
          @click="$emit('close')"
        >
          <img
            class="action__image"
            src="@assets/icons/close.svg"
            alt="Cerrar"
          />
          <span>Cerrar</span>
        </button>
      </div>
      <h2 class="validation__title">
        Validación de registro
      </h2>
      <p class="validation__copy">
        ¿Estás segura de aprobar el registro?
      </p>
      <div
        v-if="registration.status === 'pending'"
        class="validation__actions"
      >
        <button 
          class="validation__action validation__action--cancel"
          @click="handleFlow('')"
        >
          Cancelar
        </button>
        <button 
          class="validation__action validation__action--approve"
          @click="handleApprove"
        >
          Aprobar
        </button>
      </div>
    </div>

    <!-- Reject -->
    <div 
      class="validation__dialog"
      v-if="!status.loading && confirmation === 'reject'"
    >
      <div class="validation__close">
        <button
          class="action"
          @click="$emit('close')"
        >
          <img
            class="action__image"
            src="@assets/icons/close.svg"
            alt="Cerrar"
          />
          <span>Cerrar</span>
        </button>
      </div>
      <h2 class="validation__title">
        Validación de registro
      </h2>
      <p class="validation__copy">
        ¿Estás segura de rechazar el registro? Ingresa un 
        motivo para notificar al usuario.
      </p>
      <textarea
        class="validation__reason"
        placeholder="Motivo de rechazo"
        v-model="reason"
      />
      <div
        v-if="registration.status === 'pending'"
        class="validation__actions"
      >
        <button 
          class="validation__action validation__action--cancel"
          @click="handleFlow('')"
        >
          Cancelar
        </button>
        <button 
          class="validation__action validation__action--reject"
          @click="handleReject"
        >
          Rechazar
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div
      class="validation__dialog validation__dialog--loading"
      v-if="status.loading"
    >
      <Loader />
    </div>
  </dialog>
</template>

<script setup>
import Loader from '@components/core/Loader.vue'
import { ref, reactive } from 'vue'
import { parseDate } from "@helpers/dates"
import { REGISTRATION_STATUS } from "@helpers/constants"
import { supabase, sendEmail } from "@helpers/supabase"

/*  vue  emits  */
const emit = defineEmits(["close", "update"])

/*  vue  props  */
const { registration, handleGroup } = defineProps({
  registration: {
    type: Object,
    required: true,
  },
  handleGroup: {
    type: Function,
    required: true,
  },
})

/*  vue  data  */
const confirmation = ref("")
const reason = ref("")
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  methods  */
const isPdf = (url) => {
  return url.endsWith('.pdf');
}

const handleFlow = (value) => {
  confirmation.value = value
}

const handleApprove = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("registrations")
    .update({ 
      "status": REGISTRATION_STATUS[1]
    })
    .eq("id", registration.id)
    .select()

    if (error) {
      console.error("Error in handleApprove: ", error)
      status.error = error.message
    } else {
      status.success = true
      sendEmail('payment-accepted', registration.email, registration.name)
      emit("update", data[0])
      status.loading = false
  }
}

const handleReject = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
      .from('registrations')
      .update({ 
        status: REGISTRATION_STATUS[2],
        ...(reason.value && { note: reason.value })
      })
      .eq('id', registration.id)
      .select()

  if (error) {
    console.error("Error in handleReject: ", error)
    status.error = error.message
  } else {
    status.success = true
    sendEmail('payment-rejected', registration.email, registration.name)
    emit("update", data[0])
    status.loading = false
  }
}

</script>

<style scoped lang="scss">
@import "@assets/library";
.validation {
  position: absolute;
  display: block;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  &__dialog {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 75vh;
    background-color: $white;
    justify-content: space-around;
    padding: 20px;
    border-radius: 4px;
    &--loading {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &__header{
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  &__close {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }
  &__title, &__copy {
    margin-bottom: 12px;
  }
  &__reason {
    width: 100%;
    height: 100px;
    border: 1px solid $gray;
    border-radius: 8px;
    padding: 12px;
    font-size: 16px;
    appearance:none;
    margin-bottom: 12px;
  }
  &__data {
    border: 1px solid $gray;
    border-radius: 4px 4px 0 0;
  }
  &__row {
    width: 100%;
    display: flex;
    padding: 12px;
    border-bottom: 1px solid $gray;
    &:last-child {
      border-bottom: none;
    }
  }
  &__cell {
    width: 50%;
  }

  &__receipt{
    height: 400px;
    border: 1px solid $gray;
    border-top: none;
    background: $lightgray;
    display: flex;
    justify-content: center;
    border-radius: 0 0 4px 4px;
    margin-bottom: 12px;
    overflow: hidden;
  }
  &__payment{
    height: 30%;
    border: 1px solid $gray;
    background: $lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
    & a {
      width: 180px;
      height: 40px;
      border-radius: 4px;
      text-decoration:none;
      padding: 8px 0;
      border: none;
      background: $primary-color;
      text-align: center;
      color: $white;
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;
    }
    
  }
  &__payment img {
    width: 50%;
    height: 85%;
    object-fit: contain;
    object-position: center;
  }
  &__actions {
    display: flex;
    justify-content: space-between
  }
  &__action {
    width: 48%;
    padding: 8px 12px;
    border: 1px solid $lightgray;
    border-radius: 4px;
    background-color: $white;
    cursor: pointer;
    &:hover {
      background-color: $lightgray;
      color: $black;
    }
    &--reject {
      padding: 12px;
      color: $white;
      background: $red;
      &:hover {
        border: 1px solid $red;
        background-color: $lightgray;
        color: $red;
      }
    }
    &--approve {
      padding: 12px;
      color: $black;
      background: $green;
      &:hover {
        border: 1px solid $green;
        background-color: $lightgray;
      }
    }
    &--cancel {
      padding: 12px;
      color: $black;
      background: $gray;
      &:hover {
        border: 1px solid $gray;
        background-color: $lightgray;
      }
    }
  }
  &__status {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    border: 1px solid $gray;
    border-radius: 4px;
    background-color: $lightgray;
    font-size: 16px;
    font-weight: 600;
    &--rejected {
      background: $red;
      color: $white;
    }
    &--approved {
      background: $green;
      color: $black;
    }
  }
  &__note {
    margin-top: 12px;
    border: 1px solid $gray;
    border-radius: 4px;
    padding: 12px;
    h6 {
      margin-bottom: 8px;
    }
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
  &__image {
    width: 16px;
    margin-right: 8px;
  }
  &:hover {
    background-color: $lightgray;
  }
}
</style>