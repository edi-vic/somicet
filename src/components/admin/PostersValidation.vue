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
  
      <div class="validation__data" id="validation-data">
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
        <div 
          class="validation__resume"
          :class="{'validation__resume--download': status.isDownload}"
        >
          <h6>
            Resumen
          </h6>
          <p>
            {{ poster.summary }}
          </p>
        </div>
      </div>

      <div class="validation__pdf">
        <button @click="exportToPDF()">
          Descargar PDF
        </button>

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
        :class="`validation__status validation__status--${poster.status}`"
        v-else
      >
        <span>
          {{ poster.status === 'rejected' ? "Rechazado" : "Aprobado" }}
        </span>
      </div>

      <div
        class="validation__note"
        v-if="poster.approval_number"
      >
        <h6>
          Número de cartel
        </h6>
        <p class="validation__copy">
          {{ poster.approval_number }}
        </p>

        <h6>
          Fecha y hora de presentación
        </h6>
        <p>
          {{ poster.presentation_date }}, {{ poster.presentation_time }}
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
        Validación de cartel
      </h2>
      <p class="validation__copy">
        ¿Está seguro que desea aprobar el cartel? Ingresa el número de cartel y
        la fecha de presentación.
      </p>
      <div class="validation__cell validation__cell--full">
        <label 
          class="validation__label" 
          for="poster-number"
        >
          Número de cartel
        </label>
        <input 
          class="validation__input"
          id="poster-number" 
          type="text"
          v-model="posterNumber"
        >
      </div>
      <div class="validation__cell validation__cell--full">
        <label 
          class="validation__label" 
          for="poster-number"
        >
          Fecha de presentación
        </label>
        <input 
          class="validation__input"
          id="poster-number" 
          type="date"
          v-model="posterDate"
        >
      </div>
      <div class="validation__cell validation__cell--full">
        <label 
          class="validation__label" 
          for="poster-number"
        >
          Hora de presentación
        </label>
        <input 
          class="validation__input"
          id="poster-number" 
          type="time"
          v-model="posterTime"
        >
      </div>
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
          :disabled="!validConfirmation"
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
import { ref, reactive, computed } from 'vue'
import { parseDate } from "@helpers/dates"
import { REGISTRATION_STATUS, POSTER_THEMES } from "@helpers/constants"
import { supabase, sendEmail } from "@helpers/supabase"
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
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
const posterNumber = ref("")
const posterDate = ref("")
const posterTime = ref("")
const status = reactive({
  loading: false,
  success: false,
  error: null,
  isDownload: false
})

/*  vue  computed  */
const validConfirmation = computed(() => {
  if (confirmation.value === "approve") {
    return posterNumber.value !== "" && posterDate.value !== "" && posterTime.value !== ""
  } else {
    return true
  }
})

/*  vue  methods  */
const handleFlow = (value) => {
  confirmation.value = value
}

const handleApprove = async () => {
  const posterData = {
    "number": posterNumber.value,
    "date": posterDate.value,
    "time": posterTime.value,
  }

  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("posters")
    .update({ 
      "status": REGISTRATION_STATUS[1],
      "approval_number": posterData.number,
      "presentation_date": posterData.date,
      "presentation_time": posterData.time,
    })
    .eq("id", poster.id)
    .select(`*,
      registrations (
        email,
        name
      )
    `)


    if (error) {
      console.error("Error in handleApprove: ", error)
      status.error = error.message
    } else {
      status.success = true
      sendEmail(
        'poster-accepted',
        poster.registrations.email, 
        poster.registrations.name,
        posterData
      )
      emit("update", data[0])
      status.loading = false
  }
}

const handleReject = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
      .from('posters')
      .update({ 
        status: REGISTRATION_STATUS[2],
      })
      .eq('id', poster.id)
      .select(`*,
        registrations (
          email,
          name
        )
      `)

  if (error) {
    console.error("Error in handleReject: ", error)
    status.error = error.message
  } else {
    status.success = true
    sendEmail('poster-rejected', poster.registrations.email, poster.registrations.name)
    emit("update", data[0])
    status.loading = false
  }
}
const exportToPDF = async () =>{
  status.isDownload = true;
  status.loading = true;

  let theme;
  for(const key in POSTER_THEMES){
    if(POSTER_THEMES[key].code === poster.theme){
      theme = POSTER_THEMES[key].copy
    }
  }
  html2canvas(document.getElementById("validation-data")).then((canvas) => {
    var imgdata = canvas.toDataURL("image/jpg");
    var doc = new jsPDF();
    doc.addImage(imgdata, "JPG", 10, 10);
    doc.save(theme);
  })
  status.loading = false;
  status.isDownload = false
  
  
  
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
    &--full {
      width: 100%;
    }
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
    overflow-y: scroll;
    &--download{
      height: auto;
      overflow-y: initial;
    }
  }
  &__pdf{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    & button{
      width: 180px;
      height: 40px;
      border-radius: 4px;
      text-decoration:none;
      padding: 8px 0;
      border: none;
      cursor: pointer;
      background: $primary-color;
      text-align: center;
      color: $white;
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;

    }
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
      &:disabled {
        background-color: $gray;
        border: 1px solid $gray;
        cursor: not-allowed;
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
  &__label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  &__input {
    height: 50px;
    width: 100%;
    border: 1px solid $gray;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 16px;
    margin-bottom: 12px;
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