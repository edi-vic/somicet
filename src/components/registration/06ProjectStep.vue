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