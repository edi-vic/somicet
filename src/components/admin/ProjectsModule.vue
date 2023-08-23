<template>
  <section class="projects__table">
    <ul class="projects__header">
      <li class="projects__titles">
        <div class="projects__title projects__title--folio">
          Folio
        </div>
        <div class="projects__title projects__title--status">
          Estado
        </div>
        <div class="projects__title projects__title--actions">
          Acciones
        </div>
        <div class="projects__title projects__title--title">
          Título
        </div>
        <div class="projects__title projects__title--authors">
          Autores
        </div>
        <div class="projects__title projects__title--date">
          Fecha
        </div>
      </li>
    </ul>
    <ul class="projects__rows">
      <li
        class="projects__row"
        v-for="project in projects" 
        :key="project.id"
      >
        <div class="projects__cell projects__cell--folio">
          {{ project.serial_number }}
        </div>
        <div class="projects__cell projects__cell--status">
          <div :class="`status-tag status-tag--${project.status}`" />
        </div>
        <div class="projects__cell projects__cell--actions">
          <button
            v-if="project.status === 'pending'"
            class="action"
          >
            Validar
          </button>
          <span v-else>-</span>
        </div>
        <div class="projects__cell projects__cell--title">
          {{ project.title }}
        </div>
        <div class="projects__cell projects__cell--authors">
          {{ project.authors }}
        </div>
        <div class="projects__cell projects__cell--date">
          {{ parseDate(project.created_at)  }}
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { parseDate } from "@helpers/dates"
import { supabase } from "@helpers/supabase"

/*  vue  state  */
const projects = ref([])
const project = ref(null)
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  lifecycle  */
onMounted(() => {
  getProjects()
})

/*  vue  methods  */
const getProjects = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("projects")
    .select()
    .order("serial_number", { ascending: false })

  if (error) {
    status.error = error.message
    console.error("Error in getProjects: ", error.message)
  } else {
    console.log("getProjects: ", data)
    projects.value = data
    status.success = true
  }

  status.loading = false
}
</script>

<style scoped lang="scss">
.projects {
  &__table {
    border: 1px solid lightgray;
  }
  &__titles, &__row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid lightgray;
  }
  &__titles {
    font-weight: bold;
  }
  &__rows {
    max-height: 78vh;
    overflow-y: scroll;
  }
  &__row {
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: #f5f5f5;
    }
  }
  &__title, &__cell {
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid lightgray;
    &--folio, &--status {
      width: 7.5%;
    }
    &--actions {
      width: 20%;
    }
    &--title, &--authors {
      width: 25%;
    }
    &--date {
      width: 15%;
    }
  }
}

.status-tag {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid lightgray;
  &--pending {
    background-color: yellow;
  }
  &--approved {
    background-color: green;
  }
}
</style>