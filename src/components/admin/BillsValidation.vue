<template>
  <dialog class="validation">
    <!-- Main -->
    <div 
      class="validation__dialog"
      v-if="!status.loading && confirmation === ''"
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
        Envío de factura
      </h2>

      <div class="validation__data">
        <div class="validation__row">
          <div class="validation__cell">
            <h6>
              Nombre
            </h6>
            <p>
              {{ bill.name }}
            </p>
          </div>
        </div>

        <div class="validation__row">
          <div class="validation__cell">
            <h6>
              Razón social
            </h6>
            <p>
              {{ bill.denomination }}
            </p>
          </div>
        </div>

        <div class="validation__row">
          <div class="validation__cell">
            <h6>
              RFC
            </h6>
            <p>
              {{ bill.rfc }}
            </p>
          </div>
        </div>

        <div class="validation__row">
          <div class="validation__cell">
            <h6>
              Dirección
            </h6>
            <p>
              {{ bill.address }}
            </p>
          </div>
        </div>

        <div class="validation__row">
          <div class="validation__cell">
            <h6>
              Correo electrónico
            </h6>
            <p>
              {{ bill.registrations.email }}
            </p>
          </div>
          <div class="validation__cell">
            <h6>
              Aportación cubierta
            </h6>
            <p>
              {{ handleGroup(bill.registrations.group).price }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="bill.status === 'pending'"
        class="validation__actions"
      >
        <button 
          class="validation__action validation__action--cancel"
          @click="$emit('close')"
        >
          Cancelar
        </button>
        <button 
          class="validation__action validation__action--approve"
          @click="handleFlow('approve')"
        >
          Enviada
        </button>
      </div>

      <div
        :class="`validation__status validation__status--${bill.status}`"
        v-else
      >
        <span>
          {{ bill.status === 'rejected' ? "Rechazado" : "Enviada" }}
        </span>
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
        Envío de factura
      </h2>

      <p class="validation__copy">
        ¿Estás segura que quieres marcar la factura como enviada?
      </p>

      <div
        v-if="bill.status === 'pending'"
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
          Enviada
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
import { REGISTRATION_STATUS, REGISTRATION_GROUPS } from "@helpers/constants"
import { supabase } from "@helpers/supabase"

/*  vue  emits  */
const emit = defineEmits(["close", "update"])

/*  vue  props  */
const { bill } = defineProps({
  bill: {
    type: Object,
    required: true,
  },
})

/*  vue  data  */
const confirmation = ref("")
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  methods  */
const handleFlow = (value) => {
  confirmation.value = value
}

const handleGroup = (groupCode) => Object.values(REGISTRATION_GROUPS)
  .find(group => group.code === groupCode)

const handleApprove = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("bills")
    .update({ 
      "status": REGISTRATION_STATUS[1]
    })
    .eq("id", bill.id)
    .select(`*,
      registrations (
        email,
        group
      )
    `)

    if (error) {
      console.error("Error in handleApprove: ", error)
      status.error = error.message
    } else {
      status.success = true
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    background-color: $white;
    padding: 20px;
    border-radius: 4px;
    &--loading {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &__close {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }
  &__title, &__copy {
    margin-bottom: 12px;
  }
  &__data {
    border: 1px solid $gray;
    border-radius: 4px;
    margin-bottom: 12px;
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
    width: 100%;
    
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