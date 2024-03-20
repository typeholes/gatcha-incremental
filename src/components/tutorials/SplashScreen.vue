<script setup lang="ts"></script>

<template>
  <q-card>
    <h2>Welcome to <span class="gameTitle"> Gatcha Fool </span></h2>
    <h4>The incremental game about being taken advantage of</h4>
    Generally speaking, everything you can do in this game will make things
    worse. Expect to fail and fail often.<br />
    Maybe if you fail hard enough, you will stop being so gullible. Have fun&nbsp;
    <span
      ><span class="sucker"> sucker</span
      ><span class="player"> dear player</span></span
    >
  </q-card>
</template>

<style scoped>
.gameTitle {
  color: green;
}

@keyframes fadeIn {
  from {
    opacity: 100%;
  }
  to {
    opacity: 0%;
  }
}

.sucker {
  color: red;
  position: absolute;
  animation: fadeIn 5s;
  animation-fill-mode: both;
}

.player {
  color: wheat;
  position: absolute;
  animation: fadeIn 4s;
  animation-delay: 1s;
  animation-direction: reverse;
  animation-fill-mode: both;
}
</style>
