<template>
  <q-list>
    <q-expansion-item :label="'Bankruptcy Value:' + ceil(getBankruptcyValue())">
      <q-item
        dense
        :inset-level="1"
        v-for="idx in Math.min(GatchaNames.length, availableGatchas())"
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
        v-for="([chance, [name, type]], i) of game.gatchaRewards.table"
        :key="i"
      >
        <q-item-section>
          {{ name }} {{ type }} ({{ game.gatchaRewards.received[i] }}):
          {{ chance }}
        </q-item-section>
      </q-item>
    </q-expansion-item>
    <template v-for="(description, type) of PrestigeDescriptions" :key="type">
      <q-expansion-item :label="description + ' cost:' + prestigeCost(type)">
        <q-item
          :inset-level="1"
          v-for="([chance, [message]], i) of game[type].rewards.table"
          :key="i"
        >
          <q-item-section>
            {{ message }} ({{ game[type].rewards.received[i] }}): {{ chance }}
          </q-item-section>
        </q-item>
      </q-expansion-item>
    </template>
    <q-item>
      <q-item-section>
        Wait Time: {{ ceil(detectLock(false), 0) }}
      </q-item-section>
      <q-item-section v-if="mercyTicks > 0"
        >Mercy Time: {{ mercyTicks }}</q-item-section
      >
    </q-item>
    <q-space />
    <q-item>
      <q-item-section>
        <q-btn label="Hard Reset" @click="hardReset" />
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
import {
  hardReset,
  getBankruptcyValue,
  game,
  prestigeCost,
  PrestigeDescriptions,
  detectLock,
  availableGatchas,
  mercyTicks,
} from 'src/ts/game';
import { ceil } from 'src/ts/util';
import { GatchaNames } from 'src/ts/gatcha';
</script>
