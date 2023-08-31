<template>
  <section
    class="otp-step otp-step--loading"
    v-if="status.loading"
  >
    <Loader />
  </section>

  <section
    class="otp-step"
    v-if="!status.loading"
  >
    <article class="email">
      <h5>
        Correo electrónico
      </h5>
      <p>
        {{ session.get()?.user_email }}
      </p>
      <button @click="handleRestart">
        Cambiar de correo
      </button>
    </article>
  </section>

  <form 
    class="otp-step"
    v-if="!status.loading"
  >
    <label
      class="otp-step__label"
      for="code"
    >
      Ingresa el código que recibiste en tu correo:
    </label>
    <input
      class="otp-step__input" 
      id="code"
      type="text"
      placeholder="Código"
      v-model="code"
      :disabled="status.loading"
      @input="validateCode"
    >
    <div class="otp-step__input-error">
      <span v-show="inputErrors.code">
        {{ status.error }}
      </span>
    </div>
    <button
      class="otp-step__button"
      @click="validateAuthCode"
      :disabled="status.loading || !isCodeValid"
      type="submit"
    >
      Validar código
    </button>

    <p class="otp-step__copy">
      Si no has recibido el código, te sugerimos 
      revisar la carpeta de correo no deseado.
    </p>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from "vue"
import Loader from "@components/core/Loader.vue"
import { session } from "@stores/session"
import { REGISTRATION_STEPS } from "@helpers/constants"
import { supabase } from "@helpers/supabase"
import { isEmpty, isLength } from "@helpers/validators"

/*  vue  emits  */
const emit = defineEmits(["restart", "success"])

/*  vue  state  */
const code = ref("")
const inputErrors = reactive({
  code: null,
})
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  computed  */
const isCodeValid = computed(() => 
  !isEmpty(code.value) && isLength(code.value, 6))

/*  vue  methods  */
const validateCode = () => {
  const empty = isEmpty(code.value)
  const length = isLength(code.value, 6)

  if (empty)
    status.error = "El código no puede estar vacío."
  else if (!length)
    status.error = "El código debe tener 6 dígitos"
  else
    status.error = null
}

const handleRestart = (e) => {
  e.preventDefault()
  emit('restart')
}

const validateAuthCode = async () => {
  const email = session.get()?.user_email

  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .auth
    .verifyOtp({
      email,
      token: code.value,
      type: "email"
    })
  
  console.log(data, error)

  if (error) {
    // TODO: find errors ej. wrong code
    console.error("Error in validateAuthCode: ", error.message)
  } else {

    handleLogin(data)

    const { user: { id } } = data
    session.set({ 
      user_id: id,
      user_email: email,
    })
    status.success = true
    emit("success", REGISTRATION_STEPS[2])
  }

  status.loading = false
}

const handleLogin = async ({ session }) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: new Headers({"Content-Type": "application/json"}),
      credentials: "same-origin",
      body: JSON.stringify(session),
    })

    console.log(response)
  } catch (error) {
    console.error("Error in handleLogin: ", error)
  }
}
</script>

<style scoped lang="scss">
@import "@assets/library";

.otp-step {
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
    margin-bottom: 20px;
    &:disabled {
      background-color: $primary-color-600;
      cursor: not-allowed;
    }
  }
  &__copy {
    font-size: 12px;
    margin-bottom: 20px;
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

.email {
  background-color: $lightgray;
  border: 1px solid $gray;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px;
  margin-bottom: 20px;
  h5 {
    color: $black;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  p {
    color: $black;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 12px;
  }
  button {
    background: transparent;
    border: none;
    color: $primary-color;
    font-size: 16px;
    cursor: pointer;
    text-align: left;
    font-weight: 600;
  }
}
</style>