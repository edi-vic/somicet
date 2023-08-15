<template>
  <ul>
    <li 
      v-for="attendee in attendees" 
      :key="attendee.id"
    >
      {{ attendee.first_name }}
    </li>
  </ul>

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { supabase } from '@helpers/supabase'

/*  vue  state  */
const attendees = ref([])
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

/*  vue  lifecycle  */
onMounted(() => {
  getAttendees()
})

/*  vue  methods  */
const getAttendees = async () => {
  status.loading = true
  status.success = false
  status.error = null

  const { data, error } = await supabase
    .from('event_attendees')
    .select('id, first_name')

  if (error) {
    status.error = error.message
    console.error('Error in getAttendees: ', error.message)
  } else {
    console.log('getAttendees: ', data)
    attendees.value = data
    status.success = true
  }

  status.loading = false
}
</script>