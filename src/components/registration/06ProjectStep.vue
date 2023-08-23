<template>
  <section class="project-step">
    <div class="project-step__form">
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
    </div>
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
.project-step {
  &__form {
    width: 440px; // temporal
    display: flex;
    flex-direction: column;
  }
}
</style>