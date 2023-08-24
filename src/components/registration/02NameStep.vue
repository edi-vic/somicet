<template>
  <section>
    <User :profile="profile" />
  </section>
  <section class="name-step">
    <label
      class="name-step__label"
      for="first-name"
    >
      Nombre(s)
    </label>
    <input
      class="name-step__input"
      id="first-name"
      type="text"
      placeholder="Nombre(s)"
      v-model="firstName"
      :disabled="status.loading"
    >
    <div class="name-step__input-error">
      <span v-if="status.error">
        {{ status.error }}
      </span>
    </div>
    <label
      class="name-step__label"
      for="last-name"
    >
      Apellidos
    </label>
    <input
      class="name-step__input"
      id="last-name"
      type="text"
      placeholder="Apellidos"
      v-model="lastName"
      :disabled="status.loading"
    >
    <div class="name-step__input-error">
      <span v-if="status.error">
        {{ status.error }}
      </span>
    </div>
    <button
      class="name-step__button"
      @click="saveName"
      :disabled="status.loading"
    >
      Guardar nombre
    </button>
  </section>
</template>

<script setup>
import User from '@components/core/User.vue';
import { ref, reactive, onMounted } from "vue"
import { REGISTRATION_STEPS } from "@helpers/constants"
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
  const userId = getUserId()

  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from("profiles")
    .update({ 
      "first_name": firstName.value,
      "last_name": lastName.value, 
    })
    .eq("id", userId)

  console.log(data, error)

  if (error) {
    // TODO: find errors
    console.error("Error in saveName: ", error.message)
  } else {
    status.success = true
    emit("success", REGISTRATION_STEPS[3])
  }

  status.loading = false
}
</script>

<style lang="scss">
@import "@assets/library";
.name-step {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &__label {
    font-size: 16px;
    margin-bottom: 12px;
  }
  &__input {
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