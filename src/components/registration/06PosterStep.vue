<template>
  <section
    class="poster-step poster-step--loading"
    v-if="status.loading"
  >
    <Loader />
  </section>

  <section 
    class="poster-step"
    v-if="!status.loading && !poster.id"
  >
    <p class="poster-step__p">
      Es esencial completar todos los campos del formulario. El resumen 
      debe ser claro, conciso y no exceder de 250 palabras. Todo trabajo
      será revisado por el comité y está sujeto a aceptación.
      Revisa cuidadosamente toda la información antes de enviar.
    </p>
    <label
      class="poster-step__label"
      for="title"
    >
      Título del proyecto
    </label>
    <input
      id="title"
      class="poster-step__input"
      type="text"
      placeholder="Título"
      v-model="poster.title"
    />

    <label
      class="poster-step__label"
      for="group"
    >
      Grupo
    </label>
    <select
      class="poster-step__input"
      v-model="poster.theme"
    >
    <option
        v-for="option in posterThemes"
        :key="option.code"
        :value="option.code"
        :disabled="option.code === 'no_theme'"
      >
        {{ option.short_copy }}
      </option>
    </select>

    <label
      class="poster-step__label"
      for="authors"
    >
      Autores
    </label>
    <input
      id="authors"
      class="poster-step__input"
      type="text"
      placeholder="Autores"
      v-model="poster.authors"
    />
    <label
      class="poster-step__label"
      for="secondment"
    >
      Adscripción
    </label>
    <input
      id="secondment"
      class="poster-step__input"
      type="text"
      placeholder="Adscripción"
      v-model="poster.secondment"
    />
    <label
      class="poster-step__label"
      for="summary"
    >
      Resumen
    </label>
    <textarea
      id="summary"
      class="poster-step__textarea poster-step__textarea--summary"
      placeholder="Resumen"
      v-model="poster.summary"
    />
    <p 
      class="poster-step__p poster-step__p--small"
      :class="{ 'poster-step__p--error': wordCount > 250 }"
    >
      Palabras: {{ wordCount }} / 250
    </p>
    <label
      class="poster-step__label"
      for="acknowledgements"
    >
      Agradecimientos
    </label>
    <textarea
      id="acknowledgements"
      class="poster-step__textarea"
      placeholder="Agradecimientos"
      v-model="poster.acknowledgements"
    />
    <button
      class="poster-step__button"
      @click="savePoster"
      :disabled="status.loading || !isFormComplete"
    >
      Enviar
    </button>
  </section>

  <section 
    class="poster-step"
    v-if="!status.loading && poster.id && poster.status === 'pending'"
  >
    <h4 class="poster-step__title">
      Revisión de Cartel en Proceso
    </h4>
    <p class="poster-step__p">
      ¡Gracias por enviar tu cartel! Actualmente está en revisión por 
      nuestro comité. Te notificaremos el resultado por correo electrónico 
      a más tardar el 29 de septiembre de 2023. Agradecemos tu paciencia.
    </p>
  </section>

  <section 
    class="poster-step"
    v-if="!status.loading && poster.id && poster.status === 'approved'"
  >
    <h4 class="poster-step__title">
      ¡Tu cartel ha sido seleccionado!
    </h4>
    <p class="poster-step__p">
      Nos complace informarte que, tras el proceso de evaluación, 
      tu trabajo ha sido seleccionado para participar en el Simposio 
      "Células Troncales, Medicina Regenerativa y Envejecimiento".
    </p>
    <p class="poster-step__p">
      Tu número de póster es {{ poster.approval_number }} y deberás presentarte el día 
      {{ poster.presentation_date }} a partir de las {{ poster.presentation_time }}.
    </p>
    <p class="poster-step__p">
      A continuación, te listamos los requerimientos para la 
      presentación de tu proyecto:
    </p>
    <ol>
      <li class="poster-step__element">
        <div class="poster-step__instruction">
          <span class="poster-step__bullet">a</span>
          <p class="poster-step__p">
            Las medidas máximas son 150 cm de alto por 100 cm de ancho.
          </p>
        </div>
      </li>
      <li class="poster-step__element">
        <div class="poster-step__instruction">
          <span class="poster-step__bullet">b</span>
          <p class="poster-step__p">
            El cartel debe contener la siguiente información:
          </p>
        </div>
        <ol class="poster-step__sub-list">
          <li class="poster-step__sub-element">
            Resumen
          </li>
          <li class="poster-step__sub-element">
            Introducción
          </li>
          <li class="poster-step__sub-element">
            Metodología y Resultados
          </li>
          <li class="poster-step__sub-element">
            Conclusiones y perspectivas
          </li>
          <li class="poster-step__sub-element">
            Agradecimientos
          </li>
        </ol>
      </li>
    </ol>
  </section>

  <section 
    class="poster-step"
    v-if="!status.loading && poster.id && poster.status === 'rejected'"
  >
    <h4 class="poster-step__title">
      Cartel no seleccionado
    </h4>
    <p class="poster-step__p">
      Lamentamos informarte que, tras un cuidadoso proceso de evaluación, 
      tu trabajo no fue seleccionado para participar en el Simposio "Células 
      Troncales, Medicina Regenerativa y Envejecimiento".
    </p>
    <p class="poster-step__p">
      Aunque tu propuesta no fue seleccionada en esta ocasión, agradecemos 
      sinceramente tu interés en el Simposio y te invitamos a participar 
      como asistente, lo que también te permitirá obtener una constancia.
    </p>
    <p class="poster-step__p">
      Si deseas solicitar la devolución de tu pago de inscripción, por favor 
      envía un correo a somicet@gmail.com adjuntando tu comprobante de pago 
      y la cuenta a la que deseas que se realice la devolución, siempre y 
      cuando no hayas solicitado factura.
    </p>
  </section>

</template>

<script setup>
import Loader from "@components/core/Loader.vue"
import { ref, reactive, computed, onMounted } from "vue"
import { supabase } from "@helpers/supabase"
import { POSTER_THEMES } from "@helpers/constants";
import { isEmpty } from "@helpers/validators"

/*  vue  emits  */
const emit = defineEmits(["success"])

/*  vue  props  */
const { registration } = defineProps({
  registration: {
    type: Object,
    required: true,
  },
})

/*  vue  state  */
const poster = ref({
  title: "",
  authors: "",
  theme: "no_theme",
  secondment: "",
  summary: "",
  acknowledgements: "",
})
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  lifecycle  */
onMounted(() => {
  getPoster()
})

/*  vue  computed  */
const posterThemes = computed(() => Object.values(POSTER_THEMES))
const wordCount = computed(() => {
  const summary = poster.value.summary;
  if (!summary) {
    return 0;
  }
  const words = summary.trim().split(/\s+/);
  return words.length;
});

const isFormComplete = computed(() => {
  return !isEmpty(poster.value.title)
    && !isEmpty(poster.value.authors)
    && poster.value.theme !== "no_theme"
    && !isEmpty(poster.value.secondment)
    && !isEmpty(poster.value.summary)
    && wordCount.value <= 250
    && !isEmpty(poster.value.acknowledgements)
})

/*  vue  methods  */
const getPoster = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("posters")
    .select()
    .eq("user_id", registration.user_id)
    .single()

  if (error) {
    console.error("Error in getPoster: ", error)
  } else {
    console.log("getPoster: ", data)
    poster.value = data
  }

  status.loading = false
}

const savePoster = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const record = {
    "user_id": registration.user_id,
    "title": poster.value.title,
    "authors": poster.value.authors,
    "theme": poster.value.theme,
    "secondment": poster.value.secondment,
    "summary": poster.value.summary,
    "acknowledgements": poster.value.acknowledgements,
    "registration_id": registration.id,
  }

  const { data, error } = await supabase
    .from("posters")
    .upsert(record)
    .select()
    .single()


  if (error) {
    console.error("Error in savePoster: ", error)
  } else {
    console.log("savePoster: ", data)
    status.success = true
    emit("success", data)
  }

  status.loading = false
}
</script>

<style scoped lang="scss">
@import "@assets/library";
.poster-step {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &--loading {
    align-items: center;
    height: 300px;
  }
  &__title {
    color: $primary-color;
    font-size: 20px;
    margin-bottom: 12px;
  }
  &__p {
    font-size: 16px;
    margin-bottom: 12px;
    &--small {
      font-size: 12px;
      text-align: right;
      margin-bottom: 8px;
    }
    &--error {
      color: $red;
    }
  }
  &__label {
    font-size: 16px;
    margin-bottom: 8px;
    font-weight: 600;
  }
  &__input, &__textarea {
    height: 50px;
    border: 1px solid lightgray;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 16px;
    margin-bottom: 12px;
  }
  &__textarea {
    padding: 12px;
    height: 150px;
    &--summary {
      height: 300px;
      margin-bottom: 4px;
    }
  }
  &__input-error {
    height: 16px;
    color: $red;
    font-size: 12px;
    margin-bottom: 12px;
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
    &:disabled {
      background-color: $primary-color-600;
      cursor: not-allowed;
    }
  }
  &__element {
    display: flex;
    flex-direction: column;
    padding-bottom: 12px;
  }
  &__instruction {
    display: flex;
    color: $black;
  }
  &__bullet {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $primary-color;
    color: $white;
    flex-shrink: 0;
    margin-right: 8px;
  }
  &__sub-list {
    width: 80%;
    margin-left: 10%;
  }
  &__sub-element {
    margin-bottom: 8px;
    &::marker {
      color: $primary-color;
    }
  }
  @media (min-width: 992px) {
    max-width: 440px;
    &__label {
      font-size: 20px;
    }
    &__input {
      width: 440px;
      height: 60px;
    }
    &__input {
      font-size: 20px;
    }
    &__button {
      width: 440px;
      font-size: 20px;
    }
  }
}
</style>