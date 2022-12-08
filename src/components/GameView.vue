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

            <q-card-section>
              <q-btn
                label="Go Bankrupt"
                v-if="game.worth <= 0"
                @click="bankrupt"
              />
            </q-card-section>

            <q-card-section>
              <q-btn
                label="Mid Life Crisis"
                v-if="canPrestige()"
                @click="prestige"
              />
            </q-card-section>
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
                {{ ceil(game.divisors[name].value) }} <br />*
                {{ ceil(game.multipliers[name].value) }}
              </q-card-section>

              <q-card-section>
                <q-btn
                  :label="'respond: ' + ceil(getScaledGatcha(name, 'cost'))"
                  :disable="!affordable(name)"
                  @click="respond(name)"
                />
                <br />/ {{ ceil(game.divisors[name].cost) }} <br />*
                {{ ceil(game.multipliers[name].cost) }}
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
import {
  GatchaNames,
  game,
  affordable,
  respond,
  getScaledGatcha,
  bankrupt,
  prestige,
  canPrestige,
  ceil,
  getIncome,
} from 'src/ts/game';
import { computed } from 'vue';

const names = computed(() => GatchaNames.slice(0, game.bankruptcies + 1));
</script>
