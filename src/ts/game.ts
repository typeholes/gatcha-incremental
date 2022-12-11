/* eslint-disable @typescript-eslint/no-empty-function */
import { reactive } from 'vue';
import { Notify } from 'quasar';
import { sumOfPowers, ceil, tuple, runLazy, TODO } from './util';
import { CostValue, Gatcha, GatchaName, GatchaNames, gatchas } from './gatcha';
import { pickReward, RewardTable } from './random';

export type Game = {
  retirement: {
    base: Record<CostValue, number>;
    scale: Record<CostValue, number>;
    cnt: number;
    rewards: PrestigeRewardTable;
    rewardCnt: number | (() => number);
  };
  crisis: {
    base: Record<CostValue, number>;
    scale: Record<CostValue, number>;
    cnt: number;
    rewards: PrestigeRewardTable;
    rewardCnt: number | (() => number);
  };
  responses: Record<GatchaName, number>;
  baseIncome: number;
  worth: number;
  bankruptcies: number;
  divisors: Record<GatchaName, Record<CostValue, number>>;
  multipliers: Record<GatchaName, Record<CostValue, number>>;
  gatchaRewards: RewardTable<readonly [GatchaName, CostValue]>;
  gatchaRewardChanceModifier: number;
  gatchaRewardChanceModifierScaling: number;
};

const initialDivisors: () => Record<
  GatchaName,
  Record<CostValue, number>
> = () =>
  Object.fromEntries(tuple(GatchaNames.map((x) => [x, { cost: 1, value: 1 }])));

const initialMultipliers: () => Record<
  GatchaName,
  Record<CostValue, number>
> = () =>
  Object.fromEntries(tuple(GatchaNames.map((x) => [x, { cost: 1, value: 1 }])));

export const game: Game = reactive({
  responses: Object.fromEntries(tuple(GatchaNames.map((x) => [x, 0]))),
  baseIncome: 1,
  worth: 0,
  bankruptcies: 0,
  divisors: initialDivisors(),
  multipliers: initialMultipliers(),
  crisisMultiplier: 10,
  crisis: {
    base: { cost: 10, value: 1.5 },
    scale: { cost: 1.5, value: 1.5 },
    cnt: 0,
    rewards: crisisRewards(),
    rewardCnt: 1,
  },
  retirement: {
    base: { cost: 1000, value: 1.5 },
    scale: { cost: 1.5, value: 1.5 },
    cnt: 0,
    rewards: retirementRewards(),
    rewardCnt: () => game.retirement.cnt,
  },
  gatchaRewards: Gatcha.mkRewardTable(0),
  gatchaRewardChanceModifier: 1,
  gatchaRewardChanceModifierScaling: 2,
});

export function getScaledGatcha(name: GatchaName, type: 'cost' | 'value') {
  const params = gatchas[name][type];
  const cnt = game.responses[name] + (type === 'value' ? -1 : 0);
  return (
    (sumOfPowers(params.base, params.growth, cnt) / game.divisors[name][type]) *
    game.multipliers[name][type]
  );
}

export function affordable(name: GatchaName) {
  const cost = getScaledGatcha(name, 'cost');
  return game.worth >= cost ? cost : 0;
}

export function getIncome() {
  let income =
    game.baseIncome *
    sumOfPowers(
      game.crisis.base.value,
      game.crisis.scale.value,
      game.crisis.cnt
    );

  for (const name of GatchaNames) {
    income -= getScaledGatcha(name, 'value');
  }

  return income;
}

export function respond(name: GatchaName) {
  const cost = affordable(name);
  if (cost) {
    const oldCnt = game.responses[name];
    const newCnt = (game.responses[name] += getBuyAmt(name));
    checkTiers(name, oldCnt, newCnt);
    game.worth -= cost;
  }
}

function getBuyAmt(name: GatchaName) {
  return 1;
}

function resetGameValues() {
  game.worth = 0;
  for (const name of GatchaNames) {
    game.responses[name] = 0;
  }
}

export function getBankruptcyValue(upToGatchaIdx = game.bankruptcies) {
  const worth = game.worth >= 0 ? -1 : game.worth;
  const responses = Object.values(game.responses).slice(0, upToGatchaIdx);

  const responseMultiplier = responses.reduce(
    (a, b, i) => (a * Math.max(b, 1) * (b ? i + 1 : 1)) ** (1 + (b * i) / 40),
    1
  );
  return Math.log(worth * -1 * responseMultiplier) / log4;
}

const log4 = Math.log(4);
export function bankrupt() {
  if (game.worth >= 0) {
    return;
  }

  game.bankruptcies++;

  const [name, nerfType] = pickReward(
    game.gatchaRewards,
    game.gatchaRewardChanceModifier
  );
  if (game.bankruptcies < GatchaNames.length) {
    game.gatchaRewards = Gatcha.mkRewardTable(game.bankruptcies);
  }

  const divisor = getBankruptcyValue();

  game.divisors[name][nerfType] += divisor;
  const message = `${name} ${nerfType} reduced by ${ceil(divisor)}`;

  resetGameValues();
  Notify.create({
    message: `broke, broke again\n ${message}`,
    type: 'responseTier',
  });
}

export function prestigeCost(type: PrestigeType) {
  return sumOfPowers(
    game[type].base.cost,
    game[type].scale.cost,
    game[type].cnt
  );
}

export const PrestigeTypes = ['crisis', 'retirement'] as const;
export type PrestigeType = typeof PrestigeTypes[number];

export const PrestigeDescriptions = {
  crisis: 'Mid Life Crisis',
  retirement: 'Retire',
};

export function prestige(type: PrestigeType) {
  game[type].cnt++;

  for (let i = 0; i <= runLazy(game[type].rewardCnt); i++) {
    const [message, effect] = pickReward(game[type].rewards);
    effect();

    Notify.create({
      message: `${message}`,
      type: type,
    });
  }

  const prestige = { crisis, retirement }[type];
  prestige();
}

export function canPrestige(type: PrestigeType) {
  return game.worth > prestigeCost(type);
}

export function crisis() {
  resetGameValues();

  game.divisors = initialDivisors();
  game.multipliers = initialMultipliers();
}

export function retirement() {}

const tiers = [5, 10, 20, 40];
export function checkTiers(name: GatchaName, oldCnt: number, newCnt: number) {
  const reached = tiers
    .map((x, i) =>
      oldCnt < x && newCnt >= x
        ? { tier: i, message: gatchas[name].tierMessages[i] ?? 'TBD' }
        : false
    )
    .filter((x) => x != false);

  for (const t of reached) {
    if (t) {
      const maxTiers = gatchas[name].tierMessages.length - 2;
      console.log({ tier: t.tier, maxTiers });
      let message = '';

      const divisor = 1;
      if (t.tier === maxTiers) {
        game.multipliers[name].value = 0;
        message = `You no longer fall for ${name}`;
      } else if (t.tier > maxTiers) {
        game.multipliers[name].value -= divisor;
        message = `${name} me? No, ${name} you`;
      } else {
        game.divisors[name].value += divisor;
      }

      Notify.create({
        message: `${t.message} ${message}`,
        type: 'tier',
      });
    }
  }

  return reached;
}

type PrestigeRewardTable = RewardTable<readonly [string, () => void]>;

function crisisRewards(): PrestigeRewardTable {
  return RewardTable([
    ['Extra Income', () => (game.baseIncome *= 1.1)] as const,
    [
      'Less likely to receive same rewards',
      () => (game.gatchaRewardChanceModifier *= 2),
    ] as const,
    [
      'More likely to receive same reward after getting all rewards',
      () => (game.gatchaRewardChanceModifierScaling *= 2),
    ] as const,
  ]);
}
function retirementRewards(): PrestigeRewardTable {
  return RewardTable([
    [
      'Rewards per Mid Life Crises',
      () => (game.crisis.rewardCnt = runLazy(game.crisis.rewardCnt) + 1),
    ],
    ['Mid Life Crisis cost reduced', () => (game.crisis.base.cost *= 0.9)],
    ['Mid Life Crisis scaling reduced', () => (game.crisis.scale.cost *= 0.95)],
    [
      'Mid Life Crisis income scaling increased',
      () => (game.crisis.scale.value *= 1.05),
    ],
  ]);
}

let usedTime = 0;
function gameLoop(time: number) {
  const deltaTime = time - usedTime;
  if (deltaTime > 500) {
    usedTime += deltaTime;
    game.worth += getIncome();
    detectLock();
  }

  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

const TickLimit = 10000;
export function detectLock() {
  const [name, cost] = [
    ...PrestigeTypes.map((name) => [name, prestigeCost(name)] as const),
    ...GatchaNames.map(
      (name) => [name, getScaledGatcha(name, 'cost')] as const
    ),
  ].reduce((a, b) => (b[1] < a[1] ? b : a));

  if (cost <= game.worth) {
    return 0;
  }

  const income = getIncome();
  if (income === 0) {
    zeroIncome(name, cost);
  } else if (income < 0) {
    const ticksNeeded = (-1 * game.worth) / income;
    if (ticksNeeded < TickLimit) {
      return Math.max(ticksNeeded,0);
    }
    TODO('handle too long until bankrupt');
    game.worth = 0;
  } else {
    const moneyNeeded = cost - game.worth;
    const ticksNeeded = moneyNeeded / income;

    if (ticksNeeded < TickLimit) {
      return ticksNeeded;
    }
    TODO('handle too long until buyable');
    game.worth = cost;
  }
  return 0;
}

function zeroIncome(name: string, cost: number) {
  TODO('handle zero income');
  game.worth = cost;
}
