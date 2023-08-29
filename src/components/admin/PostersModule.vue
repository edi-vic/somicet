<template>
  <section class="posters__table">
    <div class="posters__control">
      <input
        class="posters__search"
        type="text"
        placeholder="Buscar"
        v-model="search"
      />
      <select
        class="posters__select"
        v-model="postersStatusSelect"
      >
        <option
          v-for="option in posterStatus"
          :key="option.code"
          :value="option.code"
        >
          {{ option.copy }}
        </option>
      </select>
    </div>
    <ul class="posters__header">
      <li class="posters__titles">
        <div class="posters__title posters__title--folio">
          Folio
        </div>
        <div class="posters__title posters__title--status">
          Estado
        </div>
        <div class="posters__title posters__title--actions">
          Acciones
        </div>
        <div class="posters__title posters__title--title">
          Título
        </div>
        <div class="posters__title posters__title--authors">
          Autores
        </div>
      </li>
    </ul>
    <div 
      class="posters__status"
      v-if="status.loading"
    >
      <Loader />
    </div>
    <div 
      class="posters__status"
      v-else-if="!status.loading && !filteredPosters.length"
    >
      <span>No hay registros</span>
    </div>
    <ul class="posters__rows">
      <li
        class="posters__row"
        v-for="poster in filteredPosters" 
        :key="poster.id"
      >
        <div class="posters__cell posters__cell--folio">
          {{ poster.serial_number }}
        </div>
        <div class="posters__cell posters__cell--status">
          <div :class="`status-tag status-tag--${poster.status}`" />
        </div>
        <div class="posters__cell posters__cell--actions">
          <button
            v-if="poster.status === 'pending'"
            class="action"
          >
            Validar
          </button>
          <span v-else>-</span>
        </div>
        <div class="posters__cell posters__cell--title">
          {{ poster.title }}
        </div>
        <div class="posters__cell posters__cell--authors">
          {{ poster.authors }}
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import Loader from "@components/core/Loader.vue"
import { ref, reactive, computed, onMounted } from "vue"
import { supabase } from "@helpers/supabase"
import { POSTER_STATUS } from "@helpers/constants";

/*  vue  state  */
const posters = ref([])
const poster = ref(null)
const search = ref("")
const postersStatusSelect = ref("no_status")
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  lifecycle  */
onMounted(() => {
  getPosters()
})

/*  vue  computed  */
const posterStatus = computed(() => Object.values(POSTER_STATUS))

const filteredPosters = computed(() => {
  const searchValue = search.value.toLowerCase()
  const statusValue = postersStatusSelect.value

  return posters.value.filter((poster) => {
    const title = poster.title.toLowerCase()
    const authors = poster.authors.toLowerCase()
    const status = poster.status

    return (
      (title.includes(searchValue) || authors.includes(searchValue)) &&
      (statusValue === "no_status" || statusValue === status)
    )
  })
})

/*  vue  methods  */
const getPosters = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("projects")
    .select()
    .order("serial_number", { ascending: false })

  if (error) {
    status.error = error.message
    console.error("Error in getPosters: ", error.message)
  } else {
    console.log("getPosters: ", data)
    posters.value = data
    status.success = true
  }

  status.loading = false
}
</script>

<style scoped lang="scss">
@import "@assets/library";
.posters {
  &__table {
    border: 1px solid $gray;
    border-radius: 8px;
  }
  &__control {
    padding: 16px;
    display: flex;
  }
  &__search, &__select {
    width: 300px;
    height: 50px;
    border: 1px solid $gray;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 16px;
    margin-right: 12px;
    appearance:none;
  }
  &__header {
    background: $primary-color;
    color: $white;
  }
  &__status {
    width: 100%;
    height: 35vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__titles, &__row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid $gray;
  }
  &__titles {
    font-weight: bold;
  }
  &__rows {
    max-height: 70vh;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &__row {
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: $lightgray;
    }
  }
  &__title, &__cell {
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid $gray;
    &:last-child {
      border-right: none;
    }
    &--folio, &--status {
      width: 10%;
    }
    &--actions {
      width: 20%;
    }
    &--title, &--authors {
      width: 30%;
    }
  }
}

.status-tag {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid $gray;
  &--pending {
    background: $yellow;
  }
  &--approved {
    background: $green;
  }
  &--rejected {
    background: $red;
  }
}

.action {
  padding: 8px 12px;
  border: 1px solid $gray;
  border-radius: 4px;
  background-color: $white;
  cursor: pointer;
  &:hover {
    background-color: $lightgray;
  }
}
</style>