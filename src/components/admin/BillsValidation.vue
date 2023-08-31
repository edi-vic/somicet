<template>
  <dialog class="validation">
    <!-- Main -->
    <div 
      class="validation__dialog"
      v-if="!status.loading && confirmation === ''"
    >
    </div>
  </dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'

/*  vue  emits  */
const emit = defineEmits(["close", "update"])

/*  vue  props  */
const { bill } = defineProps({
  bill: {
    type: Object,
    required: true,
  },
})

/*  vue  data  */
const confirmation = ref("")
const status = reactive({
  loading: false,
  success: false,
  error: null,
})

</script>

<style scoped lang="scss">
@import "@assets/library";
.validation {
  position: absolute;
  display: block;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  &__dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    background-color: $white;
    padding: 20px;
    border-radius: 4px;
    &--loading {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>