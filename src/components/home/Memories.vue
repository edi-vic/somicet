<template>
  <section class="banner">
    <div class="banner__bg" />
    <div class="banner__content">
      <div class="banner__img">
        <img src={cover} alt="">
      </div>
      <div class="banner__text">
        <p>
         Memorias del simposio
        </p>
        <button 
          @click="downloadMemories()"
          class="principal-btn"
        >
          Descargar memorias
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
  const downloadMemories = () => {
    const publicUrl = "https://dvehcomkytvfptmklezb.supabase.co/storage/v1/object/public/assets/Memorias_Simposio2023_SOMICET.pdf"
    window.open(publicUrl, '_blank');
  }
</script>

<style scoped lang="scss">
@import "@assets/library";
  .banner{
    width: 100%;
    height: 300px;
    background-color: $white;
    position: relative;
    display: flex;
    justify-content:center;
    
    @media (max-width: 768px){
      height: 300px;

    }

    &__bg{
      clip-path: circle(62.0% at 9% 87%);
      height: 100%;
      width: 70%;
      position: absolute;
      left: 0;
      background-color: $primary-color-800;
      
    }
    &__content{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      max-width: 880px;
      z-index: 1;
      @media (max-width: 768px){
        flex-wrap: wrap-reverse;
        padding:20px 40px;

      }
    }
    &__img{
      height: 100%;
      width: 50%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      @media (max-width: 768px){
        width: 90%;
        height: auto;
        justify-content: center;
      }
      & img{
        width: 100%;
        border-radius: 8px;
        max-width: 330px;
        filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.70));
      }
    }
    &__text{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 50%;
      @media (max-width: 768px){
        width: 90%;
      }
      & p{
        text-align: center;
        max-width: 500px;
        font-size: 24px;
        line-height: 32px;
        font-weight: 400;
        color: $black;
        @media (max-width: 768px){
          font-size: 16px;
          line-height: 24px;
          max-width: 350px;
        }
        & span{
          color: $primary-color-800;
          font-weight: 600;
          font-size: 28px;
          line-height: 32px;
          @media (max-width: 768px){
            font-size: 20px;
            line-height: 28px;
          }
        }
      }
    }

  }

</style>