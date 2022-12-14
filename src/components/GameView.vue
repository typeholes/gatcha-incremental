<template>
  <q-list bordered separator>
    <q-item>
      <q-item-section>
        <q-card>
          <q-card-section horizontal class="items-center">
            <q-card-section> Income: ${{ ceil(getIncome()) }} </q-card-section>
            <q-card-section>
              Net Worth: ${{ ceil(game.worth) }}
            </q-card-section>
<q-space/>
            <q-card-section>
              <q-btn
                label="Go Bankrupt"
                v-if="game.worth <= 0"
                @click="bankrupt"
              />
            </q-card-section>

            <template
              v-for="(description, type) of PrestigeDescriptions"
              :key="type"
            >
              <q-card-section>
                <q-btn
                  :label="description"
                  v-if="canPrestige(type)"
                  @click="prestige(type)"
                />
              </q-card-section>
            </template>
          </q-card-section>
        </q-card>
      </q-item-section>
    </q-item>
    <template v-for="name of names" :key="name">
      <q-item>
        <q-item-section>
          <q-card>
            <q-card-section horizontal class="items-center">
              <q-card-section>
                {{ name }}
              </q-card-section>

              <q-card-section> </q-card-section>

              <q-card-section>
                Repsonses {{ game.responses[name] ?? 'mising' }}
              </q-card-section>

              <q-card-section>
                Losses {{ ceil(getScaledGatcha(name, 'value')) }} <br />/
                {{ ceil(getDivisor(name, 'value')) }} <br />*
                {{ ceil(game.multipliers[name].value) }}
              </q-card-section>

              <q-card-section>
                <q-btn
                  :label="'respond: ' + ceil(getScaledGatcha(name, 'cost'))"
                  :disable="!affordable(name)"
                  @click="respond(name)"
                />
                <br />/ {{ ceil(getDivisor(name,'cost')) }} <br />*
                {{ ceil(game.multipliers[name].cost) }}
              </q-card-section>

              <q-card-section>
                <q-btn
                  :label="calcNext[name].value.map(ceil).join (': ')"
                  :disable="game.worth < calcNext[name].value[1]"
                  @click="respond(name, calcNext[name].value)"
                />
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { QList, QItem, QItemSection, QCard, QCardSection, QBtn } from 'quasar';
import {
  game,
  affordable,
  respond,
  getScaledGatcha,
  bankrupt,
  canPrestige,
  prestige,
  getIncome,
  PrestigeDescriptions,
  availableGatchas,
  nextBuy,
  getDivisor,
} from 'src/ts/game';
import { GatchaNames } from 'src/ts/gatcha';

import { ceil } from 'src/ts/util';
import { computed } from 'vue';

const names = computed(() => GatchaNames.slice(0, availableGatchas()));

const calcNext = Object.fromEntries(
  GatchaNames.map((name) => [name, computed(() => nextBuy(name))])
);
</script>
