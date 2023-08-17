<template>
  <section class="name-step">
    <label for="first-name">
      Nombre(s)
    </label>
    <input 
      id="first-name"
      type="text"
      placeholder="Nombre(s)"
      v-model="firstName"
      :disabled="status.loading"
    >
    <span v-if="status.error">
      {{ status.error }}
    </span>
    <label for="last-name">
      Apellidos
    </label>
    <input 
      id="last-name"
      type="text"
      placeholder="Apellidos"
      v-model="lastName"
      :disabled="status.loading"
    >
    <span v-if="status.error">
      {{ status.error }}
    </span>
    <button 
      @click="saveName"
      :disabled="status.loading"
    >
      Guardar nombre
    </button>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { STEPS } from "@helpers/constants"
import { supabase } from "@helpers/supabase"

/*  vue  emits  */
const emit = defineEmits(["success"])

/*  vue  props  */
const { profile, getUserId } = defineProps({
  profile: {
    type: Object,
    required: true,
  },
  getUserId: {
    type: Function,
    required: true,
  },
})

/*  vue  state  */
const firstName = ref("")
const lastName = ref("")
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  lifecycle  */
onMounted(() => {
  if (profile.firstName) firstName.value = profile.firstName
  if (profile.lastName) lastName.value = profile.lastName
})

/*  vue  methods  */
const saveName = async () => {
  const user_id = getUserId()

  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("profiles")
    .update({ 
      "first_name": firstName.value,
      "last_name": lastName.value, 
    })
    .eq("id", user_id)

  console.log(data, error)

  if (error) {
    // TODO: find errors
    console.error("Error in saveName: ", error.message)
  } else {
    status.success = true
    emit("success", STEPS[3])
  }

  status.loading = false
}
</script>