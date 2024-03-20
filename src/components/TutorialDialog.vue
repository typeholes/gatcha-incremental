<script setup lang="ts">
import { game, finishTutorial, loaded } from 'src/ts/game';
import { ref, watch } from 'vue';

import SplashScreen from 'src/components/tutorials/SplashScreen.vue';

const tutorialComponents = {
  SplashScreen: SplashScreen,
} as const; // satisfies Record<keyof Game['tutorialFlags'], unknown>;

const showTutorial = ref(loaded && !!game.currentTutorial);
watch(
  () => game.currentTutorial,
  () => (showTutorial.value = loaded && !!game.currentTutorial),
);
</script>

<template>
  <q-card :v-if="game.currentTutorial">
    <q-dialog v-model="showTutorial" @hide="finishTutorial">
      <component :is="tutorialComponents[game.currentTutorial!]" />
    </q-dialog>
  </q-card>
</template>
