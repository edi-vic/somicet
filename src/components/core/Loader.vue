<template>
  <span class="loader" />
</template>

<style scoped lang="scss">
@import "@assets/library";

$loader-size: 100px;
.loader {
  width: $loader-size;
  height:$loader-size;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border: 3px solid;
  border-color: $primary-color $primary-color transparent $primary-color;
  box-sizing: border-box;
  animation: rotation 1.5s linear infinite;
}
.loader::after,
.loader::before {
  content: '';  
  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: 3px solid;
  border-color: transparent transparent $secondary-color $secondary-color;
  width: calc($loader-size - 15px);
  height: calc($loader-size - 15px);
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotationBack 0.7s linear infinite;
  transform-origin: center center;
}
.loader::before {
  width: calc($loader-size - 30px);
  height: calc($loader-size - 30px);
  border-color: $primary-color-600 $primary-color-600 transparent transparent;
  animation: rotation 2s linear infinite;
}
    
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} 
@keyframes rotationBack {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>