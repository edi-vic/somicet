<template>
  <section class="project-step">
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
        class="project-step__textarea"
        placeholder="Resumen"
        v-model="project.summary"
      />
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
        @click="saveProject"
      >
        Enviar
      </button>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { supabase } from "@helpers/supabase"

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

/*  vue  methods  */
const getProject = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("projects")
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

const saveProject = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const record = {
    "user_id": registration.user_id,
    "title": project.value.title,
    "authors": project.value.authors,
    "secondment": project.value.secondment,
    "summary": project.value.summary,
    "acknowledgements": project.value.acknowledgements,
  }

  const { data, error } = await supabase
    .from("projects")
    .upsert(record)

  if (error) {
    console.error("Error in saveProject: ", error)
  } else {
    console.log("saveProject: ", data)
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
  &__label {
    font-size: 16px;
    margin-bottom: 12px;
  }
  &__input, &__textarea {
    height: 50px;
    border: 1px solid lightgray;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 16px;
    margin-bottom: 4px;
  }
  &__input-error {
    height: 16px;
    color: red;
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