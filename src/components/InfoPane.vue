<template>
  <q-list>
    <q-item> Bankruptcy Value: {{ ceil(getBankruptcyValue()) }} </q-item>
    <q-expansion-item label="Reward Chances">
    <q-item dense
      :inset-level="1"
      v-for="[chance, [name, type]] of game.gatchaRewards"
      :key="name + type"
    >
      <q-item-section> {{ name }} {{ type }}: {{ chance }} </q-item-section>
    </q-item>
    </q-expansion-item>
  </q-list>
</template>
<script setup lang="ts">
import { getBankruptcyValue, game } from 'src/ts/game';
import { ceil } from 'src/ts/util';
</script>
