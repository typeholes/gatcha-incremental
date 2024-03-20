<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Gatcha Fool </q-toolbar-title>

        <div @click="showChangeLog = !showChangeLog">pre-alpha v0.01</div>
        <q-dialog full-width full-height auto-close v-model="showChangeLog">
          <ChangeLog />
        </q-dialog>
        <TutorialDialog />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <info-pane></info-pane>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer> footer </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, } from 'vue';
import InfoPane from 'src/components/InfoPane.vue';
import ChangeLog from 'src/components/ChangeLog.vue';
import TutorialDialog from 'src/components/TutorialDialog.vue';

const leftDrawerOpen = ref(false);
const showChangeLog = ref(false);


function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
