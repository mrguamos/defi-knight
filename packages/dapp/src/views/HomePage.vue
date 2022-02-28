<template>
  <div class="flex justify-center items-center grow h-full pb-10 w-full">
    <div class="box glowing before:rounded-lg">
      <img src="/home-image.jpg" class="rounded-lg p-1" />
    </div>
  </div>
</template>
<script lang="ts" setup></script>
<style scoped>
  .box {
    position: relative;
    display: block;
    background: linear-gradient(0deg);
  }

  .glowing::before {
    content: '';
    position: absolute;
    left: -2px;
    top: -2px;
    background: linear-gradient(
      45deg,
      #292929,
      #13174a,
      #104320,
      #530002,
      #581852
    );
    background-size: 400%;
    width: calc(100% + 5px);
    height: calc(100% + 5px);
    z-index: -1;
    animation: glower 20s linear infinite;
  }

  @keyframes glower {
    0% {
      background-position: 0 0;
    }

    50% {
      background-position: 400% 0;
    }

    100% {
      background-position: 0 0;
    }
  }
</style>
