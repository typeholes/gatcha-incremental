<script setup lang="ts">
import { game, finishTutorial, loaded, } from 'src/ts/game';
import { ref, watch } from 'vue';

import SplashScreen from 'src/components/tutorials/SplashScreen.vue';
import { Notify } from 'quasar';

const tutorialComponents = {
  SplashScreen: SplashScreen,
  DummyTutorial: undefined,
} as const; // satisfies Record<keyof Game['tutorialFlags'], unknown>;

const noAction = () => {
  /**/
};
const tutorialActions = {
  SplashScreen: {
    pre: () => noAction,
    post: () => {
      Notify.create({
        type: 'positive',
        message: 'Your phone is ringing',
      });
      // doTutorial('DummyTutorial');
    },
  },
  DummyTutorial: {
    pre: () => {
      Notify.create({
        type: 'info',
        message: 'test',
      });
    },
    post: () => noAction,
  },
};

const showTutorial = ref(loaded && !!game.currentTutorial);
watch(
  () => game.currentTutorial,
  () => {
    const show = (showTutorial.value = loaded && !!game.currentTutorial);
    if (show) {
      tutorialActions[game.currentTutorial!].pre();
    }
    return show && tutorialComponents[game.currentTutorial!];
  },
);
</script>

<template>
  <q-card :v-if="game.currentTutorial">
    <q-dialog
      v-model="showTutorial"
      @hide="finishTutorial(tutorialActions[game.currentTutorial!].post)"
      full-width
      full-height
      auto-close
      class="text-center"
    >
      <component
        v-if="game.currentTutorial && tutorialComponents[game.currentTutorial]"
        :is="tutorialComponents[game.currentTutorial]"
      />
    </q-dialog>
  </q-card>
</template>
