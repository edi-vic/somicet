<template>
  <section>
    <label for="name">
      Nombre
    </label>
    <input 
      id="name"
      type="text"
      placeholder="Nombre"
      v-model="name"
      :disabled="status.loading"
    >
    <span v-if="status.error">
      {{ status.error }}
    </span>
    <button 
      @click="updateName"
      :disabled="status.loading"
    >
      Guardar nombre
    </button>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { user } from '@stores/session'
import { supabase } from '@helpers/supabase'

const props = defineProps(['firstName'])

const emit = defineEmits(['ready'])

//  STATE 
const name = ref('')
const status = reactive({
  error: null,
  success: false,
  loading: false,
})

//  LIFECYCLE 
onMounted(() => {
  emit('ready')
})

watch(() => props.firstName, (value) => {
  name.value = value
})

//  METHODS 
const saveName = async () => {

  // status.error = null
  // status.success = false
  // status.loading = true

  const { error } = await supabase
    .from('event_attendees')
    .insert({ 'first_name': name.value })

  console.log(error)
}

const updateName = async () => {
  const userId = await user.get()?.id

  console.log(name.value, userId)

  const { error } = await supabase
    .from('event_attendees')
    .update({ 'first_name': name.value })
    .eq('user_id', userId)

  console.log(error)
}
</script>