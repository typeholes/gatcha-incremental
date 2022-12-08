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

        <q-toolbar-title> Gatch Fool </q-toolbar-title>

        <div>pre-alpha v0.01</div>
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
import { ref } from 'vue';
import InfoPane from 'src/components/InfoPane.vue';

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
