<template>
  <dialog class="validation">
    <div class="validation__dialog">
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
      >
        <img
          :src="registration.receipt_url" 
          alt="recibo"
        >
      </a>
      <div
        v-if="registration.status === 'pending'"
        class="validation__actions">
        <button 
          class="validation__action validation__action--reject"
          @click="handleReject"
        >
          Rechazar
        </button>
        <button 
          class="validation__action validation__action--approve"
          @click="handleApprove"
        >
          Aprobar
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref } from 'vue'
import { parseDate } from "@helpers/dates"
import { REGISTRATION_STATUS } from "@helpers/constants"
import { supabase } from "@helpers/supabase"

/*  vue  emits  */
const emit = defineEmits(["close"])

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

/*  vue  methods  */
const handleApprove = async () => {
  const { data, error } = await supabase
    .from("registrations")
    .update({ 
      "status": REGISTRATION_STATUS[1]
    })
    .eq("id", registration.id)

  console.log("handleApprove", data, error)
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    background-color: $white;
    padding: 20px;
    border-radius: 4px;
  }
  &__close {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }
  &__title {
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
  }
  &__cell {
    width: 50%;
  }
  &__receipt {
    height: 400px;
    border: 1px solid $gray;
    background: $lightgray;
    display: flex;
    justify-content: center;
    border-radius: 0 0 4px 4px;
    margin-bottom: 12px;
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
      color: $white;
      background: $red;
      &:hover {
        border: 1px solid $red;
        background-color: $lightgray;
        color: $red;
      }
    }
    &--approve {
      color: $black;
      background: $green;
      &:hover {
        border: 1px solid $green;
        background-color: $lightgray;
        color: $green;
      }
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