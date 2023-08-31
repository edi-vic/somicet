<template>
  <section
    class="email-step email-step--loading"
    v-if="status.loading"
  >
    <Loader />
  </section>
  <form
    class="email-step"
    v-else
  >
    <label
      class="email-step__label"
      for="email"
    >
      Ingresa tu correo electrónico:
    </label>
    <input
      class="email-step__input"
      id="email"
      type="text"
      placeholder="ejemplo@correo.com"
      v-model="email"
      :disabled="status.loading"
      @input="validateEmail"
    >
    <div class="email-step__input-error">
      <span v-show="inputErrors.email">
        {{ inputErrors.email }}
      </span>
    </div>
    <button
      class="email-step__button"
      @click="sendAuthCode"
      :disabled="status.loading || !isEmailValid"
    >
      Enviar
    </button>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue"
import Loader from "@components/core/Loader.vue"
import { session } from "@stores/session"
import { REGISTRATION_STEPS } from "@helpers/constants"
import { supabase } from "@helpers/supabase"
import { isEmpty, isEmail } from "@helpers/validators"

/*  vue  emits  */
const emit = defineEmits(["success"])

/*  vue  state  */
const email = ref("")
const inputErrors = reactive({
  email: null,
})
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  computed  */
const isEmailValid = computed(() => 
  !isEmpty(email.value) && isEmail(email.value))

/*  vue  lifecycle  */
onMounted(() => {
  const storedEmail = session.get()?.user_email || ""
  if (storedEmail) email.value = storedEmail
})

/*  vue  methods  */
const validateEmail = () => {
  const empty = isEmpty(email.value)
  const valid = isEmail(email.value)

  if (empty)
    inputErrors.email = "El campo de correo electrónico no puede estar vacío."
  else if (!valid)
    inputErrors.email = "Por favor, ingresa un correo electrónico válido."
  else
    inputErrors.email = null
}

const sendAuthCode = async () => {
  const _email = email.value.trim()

  status.loading = true
  status.success = false
  status.error = null

  session.set({ user_email: _email })

  const { error } = await supabase
    .auth
    .signInWithOtp({ email: _email })

  if (error) {
    // TODO: find errors ej. code every 60 seconds
    console.error("Error in sendAuthCode: ", error.message)
  } else {
    status.success = true
    emit("success", REGISTRATION_STEPS[1])
  }

  status.loading = false
}
</script>

<style scoped lang="scss">
@import "@assets/library";
.email-step {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &--loading {
    align-items: center;
    height: 300px;
  }
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