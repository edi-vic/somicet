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
        Validación de cartel
      </h2>
  
      <div class="validation__data">
        <div class="validation__row">
          <div class="validation__cell">
            <h6>
                Tema
              </h6>
              <p>
                {{ handleTheme(poster.theme, 'copy') }}
              </p>
          </div>
          <div class="validation__cell">
            <h6>
              Fecha
            </h6>
            <p>
              {{ parseDate(poster.created_at) }}
            </p>
          </div>
        </div>

        <div class="validation__row">
          <div class="validation__cell">
            <h6>
                Título
              </h6>
              <p>
                {{ poster.title }}
              </p>
          </div>
          <div class="validation__cell">
            <h6>
                Autores
              </h6>
              <p>
                {{ poster.authors }}
              </p>
          </div>
        </div>

        <div class="validation__row">
          <div class="validation__cell">
            <h6>
                Adscripción
              </h6>
              <p>
                {{ poster.secondment }}
              </p>
          </div>
          <div class="validation__cell">
            <h6>
              Agradecimientos
            </h6>
            <p>
              {{ poster.acknowledgements }}
            </p>
          </div>
        </div>
      </div>

      <div class="validation__resume">
        <h6>
          Resumen
        </h6>
        <p>
          {{ poster.summary }}
        </p>
      </div>

      <div
        v-if="poster.status === 'pending'"
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
        Validación de cartel
      </h2>
      <p class="validation__copy">
        ¿Estás segura de aprobar el cartel?
      </p>
      <div
        v-if="poster.status === 'pending'"
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
        Validación de cartel
      </h2>
      <p class="validation__copy">
        ¿Estás segura de rechazar el cartel?
      </p>
      <div
        v-if="poster.status === 'pending'"
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

/*  vue  emits  */
const emit = defineEmits(["close", "update"])

/*  vue  props  */
const { poster, handleTheme } = defineProps({
  poster: {
    type: Object,
    required: true,
  },
  handleTheme: {
    type: Function,
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
  &__resume {
    height: 400px;
    border: 1px solid $gray;
    border-top: none;
    background: $lightgray;
    display: flex;
    flex-direction: column;
    border-radius: 0 0 4px 4px;
    padding: 12px;
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