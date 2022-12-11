<template>
  <q-list>
    <q-expansion-item :label="'Bankruptcy Value:' + ceil(getBankruptcyValue())">
      <q-item
        dense
        :inset-level="1"
        v-for="idx in Math.max(GatchaNames.length, game.bankruptcies)"
        :key="idx"
      >
        <q-item-section>
          {{ GatchaNames[idx - 1] }}: {{ ceil(getBankruptcyValue(idx)) }}
        </q-item-section>
      </q-item>
    </q-expansion-item>
    <q-expansion-item label="Reward Chances">
      <q-item
        dense
        :inset-level="1"
        v-for="[chance, [name, type]], i of game.gatchaRewards.table"
        :key="i"
      >
        <q-item-section> {{ name }} {{ type }} ({{ game.gatchaRewards.received[i]}}): {{ chance }} </q-item-section>
      </q-item>
    </q-expansion-item>
    <q-expansion-item :label="'Midlife Crisis cost:' + prestigeCost()">
      <q-item
        :inset-level="1"
        v-for="[chance, [message]], i of game.prestigeRewards.table"
        :key="i"
      >
        <q-item-section> {{ message }} ({{ game.prestigeRewards.received[i] }}): {{ chance }} </q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>
<script setup lang="ts">
import { getBankruptcyValue, game, prestigeCost } from 'src/ts/game';
import { ceil } from 'src/ts/util';
import { GatchaNames } from 'src/ts/gatcha';
</script>
