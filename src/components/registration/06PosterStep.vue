<template>
  <section
    class="project-step project-step--loading"
    v-if="status.loading"
  >
    <Loader />
  </section>

  <section 
    class="project-step"
    v-if="!status.loading"
  >
    <p class="project-step__p">
      Es esencial completar todos los campos del formulario. El resumen 
      debe ser claro, conciso y no exceder de 250 palabras. Todo trabajo
      será revisado por el comité y está sujeto a aceptación.
      Revisa cuidadosamente toda la información antes de enviar.
    </p>
    <label
      class="project-step__label"
      for="title"
    >
      Título del proyecto
    </label>
    <input
      id="title"
      class="project-step__input"
      type="text"
      placeholder="Título"
      v-model="project.title"
    />

    <label
      class="project-step__label"
      for="group"
    >
      Grupo
    </label>
    <select
      class="project-step__input"
      v-model="project.theme"
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
      class="project-step__label"
      for="authors"
    >
      Autores
    </label>
    <input
      id="authors"
      class="project-step__input"
      type="text"
      placeholder="Autores"
      v-model="project.authors"
    />
    <label
      class="project-step__label"
      for="secondment"
    >
      Adscripción
    </label>
    <input
      id="secondment"
      class="project-step__input"
      type="text"
      placeholder="Adscripción"
      v-model="project.secondment"
    />
    <label
      class="project-step__label"
      for="summary"
    >
      Resumen
    </label>
    <textarea
      id="summary"
      class="project-step__textarea project-step__textarea--summary"
      placeholder="Resumen"
      v-model="project.summary"
    />
    <p 
      class="project-step__p project-step__p--small"
      :class="{ 'project-step__p--error': wordCount > 250 }"
    >
      Palabras: {{ wordCount }} / 250
    </p>
    <label
      class="project-step__label"
      for="acknowledgements"
    >
      Agradecimientos
    </label>
    <textarea
      id="acknowledgements"
      class="project-step__textarea"
      placeholder="Agradecimientos"
      v-model="project.acknowledgements"
    />
    <button
      class="project-step__button"
      @click="savePoster"
      :disabled="status.loading || !isFormComplete"
    >
      Enviar
    </button>
  </section>
</template>

<script setup>
import Loader from "@components/core/Loader.vue"
import { ref, reactive, computed, onMounted } from "vue"
import { supabase } from "@helpers/supabase"
import { POSTER_THEMES } from "@helpers/constants";
import { isEmpty } from "@helpers/validators"

/*  vue  props  */
const { registration } = defineProps({
  registration: {
    type: Object,
    required: true,
  },
})

/*  vue  state  */
const project = ref({
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
  getProject()
})

/*  vue  computed  */
const posterThemes = computed(() => Object.values(POSTER_THEMES))
const wordCount = computed(() => {
  const summary = project.value.summary;
  if (!summary) {
    return 0;
  }
  const words = summary.trim().split(/\s+/);
  return words.length;
});

const isFormComplete = computed(() => {
  return !isEmpty(project.value.title)
    && !isEmpty(project.value.authors)
    && project.value.theme !== "no_theme"
    && !isEmpty(project.value.secondment)
    && !isEmpty(project.value.summary)
    && wordCount.value <= 250
    && !isEmpty(project.value.acknowledgements)
})

/*  vue  methods  */
const getProject = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("posters")
    .select()
    .eq("user_id", registration.user_id)
    .single()

  if (error) {
    console.error("Error in getProject: ", error)
  } else {
    console.log("getProject: ", data)
    project.value = data
  }

  status.loading = false
}

const savePoster = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const record = {
    "user_id": registration.user_id,
    "title": project.value.title,
    "authors": project.value.authors,
    "theme": project.value.theme,
    "secondment": project.value.secondment,
    "summary": project.value.summary,
    "acknowledgements": project.value.acknowledgements,
    "registration_id": registration.id,
  }

  const { data, error } = await supabase
    .from("posters")
    .upsert(record)
    .select()
    .single()


  if (error) {
    console.error("Error in savePosters: ", error)
  } else {
    console.log("savePosters: ", data)
    status.success = true
  }

  status.loading = false
}
</script>

<style scoped lang="scss">
@import "@assets/library";
.project-step {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &--loading {
    align-items: center;
    height: 300px;
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
    font-weight: bold;
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