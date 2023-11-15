<template>
  <main class="no-email">
    <section class="no-email__text">
      <h1>
        No encontramos a ningún asistente con este correo electrónico.
      </h1>
      <button
        class="principal-btn"
        @click="handleRestart"
      >
        Cambiar correo
      </button>

    </section>
  </main>
</template>

<script setup>
  /*  vue  emits  */
  const emit = defineEmits(["success"])

  const handleRestart = (e) => {
    e.preventDefault()
    emit('restart')
  }
</script>

<style scoped lang="scss">
@import "@assets/library";
  .no-email{
    display: flex;
    width: 100%;
    min-height: 450px;
    &__text{
      display: flex;
      flex-direction: column;
      & h1{
        color: $black;
        font-size: 24px;
        line-height: 28px;

      }
    }
    & button{
      
    }
  }
</style>