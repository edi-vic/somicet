<template>
  <!-- <button @click="getPostersRelation">
    Generate CSV
  </button> -->
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
      <select
        class="posters__select"
        v-model="postersThemeSelect"
      >
      <option
          v-for="option in posterThemes"
          :key="option.code"
          :value="option.code"
        >
          {{ option.short_copy }}
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
        <div class="posters__title posters__title--theme">
          Tema
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
            class="action"
            v-if="poster.status === 'pending'"
            @click="handlePoster(poster)"
          >
            <img
              class="action__image"
              src="@assets/icons/check.svg"
              alt="Validar"
            />
            <span>Validar</span>
          </button>
          <button
            class="action"
            v-else
            @click="handlePoster(poster)"
          >
            <img
              class="action__image"
              src="@assets/icons/view.svg"
              alt="Ver"
            />
            <span>Ver</span>
          </button>
        </div>
        <div class="posters__cell posters__cell--theme">
          {{ handleTheme(poster.theme, 'short_copy') }}
        </div>
        <div class="posters__cell posters__cell--title">
          {{ truncateText(poster.title, "title") }}
        </div>
        <div 
          class="posters__cell posters__cell--authors"
          :innerHTML="truncateText(poster.authors , 'authors')"
        />
      </li>
    </ul>
  </section>
  <PostersValidation
    v-if="poster"
    :poster="poster"
    :handleTheme="handleTheme"
    @update="handleUpdate"
    @close="poster = null"
  />
</template>

<script setup>
import Loader from "@components/core/Loader.vue"
import PostersValidation from "./PostersValidation.vue";
import { ref, reactive, computed, onMounted } from "vue"
import { supabase } from "@helpers/supabase"
import { POSTER_STATUS, POSTER_THEMES } from "@helpers/constants";
/*  vue  state  */
const posters = ref([])
const poster = ref(null)
const search = ref("")
const postersStatusSelect = ref("no_status")
const postersThemeSelect = ref("no_theme")

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
const posterThemes = computed(() => Object.values(POSTER_THEMES))

const filteredPosters = computed(() => {
  const searchValue = search.value.toLowerCase()
  const statusValue = postersStatusSelect.value
  const themeValue = postersThemeSelect.value

  return posters.value.filter((poster) => {
    const title = poster.title.toLowerCase()
    const authors = poster.authors.toLowerCase()
    const status = poster.status
    const theme = poster.theme


    const searchMatch = title.includes(searchValue) || authors.includes(searchValue)
    const statusMatch = statusValue === "no_status" || status === statusValue
    const themeMatch = themeValue === "no_theme" || theme === themeValue

    return searchMatch && statusMatch && themeMatch
  })
})

/*  vue  methods  */
const getPosters = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from('posters')
    .select(`*,
      registrations (
        email,
        name
      )
    `)
  
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

const truncateText = (str, type) => {
  const maxLength = 50;
  return str.length > maxLength && type === "title" ?
  str.slice(0, maxLength - 1) + "…" :
  str.length > maxLength && type === "authors" ? 
  `<p>${str.slice(0, maxLength - 1)}...<i>et al</i></p>` 
  : str;
}

const handleTheme = (code, type) => {
  for (const key in POSTER_THEMES) {
    if (POSTER_THEMES[key].code === code) {
      return POSTER_THEMES[key][type];
    }
  }
}

const handlePoster = (element) => {
  poster.value = element
  
}

const handleUpdate = (element) => {
  const index = posters.value.findIndex((poster) => poster.id === element.id)
  posters.value[index] = element
  poster.value = null
}


// LOGIC FOR CSV GENERATION

const getPostersRelation = async () => {
  const { data, error } = await supabase
    .from('posters')
    .select(`*,
      registrations (
        email,
        name
      )
    `)

  if (error) {
    console.error("Error in getPostersRelation: ", error.message)
  } else {
    console.log(data)
    const csvData = arrayToCSV(data);
    downloadCSV(csvData, 'posters.csv');
  }

}

const flattenRegistrations = (data) => {
  return data.map(poster => {
    const flattened = { ...poster };
    // Verificar si 'registrations' existe y no está vacío
    if (flattened.registrations) {
      flattened['registrations_email'] = flattened.registrations.email || '';
      flattened['registrations_name'] = flattened.registrations.name || '';
    } else {
      // Asignar valores vacíos si no hay 'registrations'
      flattened['registrations_email'] = '';
      flattened['registrations_name'] = '';
    }
    delete flattened.registrations; // Eliminar la propiedad original
    return flattened;
  });
};



function arrayToCSV(response) {
  const data = flattenRegistrations(response);
  // Crear los encabezados del CSV (basados en las claves del primer objeto, si todos tienen la misma estructura)
  const headers = Object.keys(data[0]).join(',');
  console.log(headers)

  // Crear las filas del CSV
  const rows = data.map(obj => {
    return Object.keys(obj).map(key => {
      let val = obj[key];
      if (key === 'name') {
      // Eliminar espacios adicionales y convertir a mayúsculas
      val = val.replace(/\s+/g, ' ').trim().toUpperCase();
    }
      return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val; // Manejar comillas dentro de los valores
    }).join(',');
  });

  // Unir encabezados y filas, y agregar un salto de línea al final de cada fila
  return [headers].concat(rows).join('\r\n');
}

function downloadCSV(csvData, filename = 'data.csv') {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



</script>

<style scoped lang="scss">
@import "@assets/library";
.posters {
  &__table {
    max-height: calc(90vh - 135px);
    border: 1px solid $gray;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
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
    font-weight: 600;
  }
  &__rows {
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
    height: 58px;
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
    &--theme, &--title, &--authors {
      width: 20%;
      padding: 0 8px;
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