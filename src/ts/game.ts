/* eslint-disable @typescript-eslint/no-empty-function */
import { reactive, nextTick } from 'vue';
import { Notify } from 'quasar';
import { ceil, tuple, runLazy, TODO, power, sumOfPowers, floor } from './util';
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
    base: { cost: 1000, value: 1 },
    scale: { cost: 1.5, value: 2 },
    cnt: 0,
    rewards: crisisRewards(),
    rewardCnt: 1,
  },
  retirement: {
    base: { cost: 100000, value: 1.5 },
    scale: { cost: 1.5, value: 1.5 },
    cnt: 0,
    rewards: retirementRewards(),
    rewardCnt: () => game.retirement.cnt,
  },
  gatchaRewards: Gatcha.mkRewardTable(1),
  gatchaRewardChanceModifier: 1,
  gatchaRewardChanceModifierScaling: 2,
});

//@ts-expect-error// makes cheating easier
window.game = game;

export function nextBuy(name: GatchaName): [number, number] {
  const curr = game.responses[name];
  const next = tiers.find((n) => n > curr) ?? false;

  if (!next) {
    return [0, 0];
  }

  const diff = next - curr;

  // const base =
  //   (gatchas[name].cost.base / game.divisors[name].cost) *
  //   game.multipliers[name].cost;
  // const growth = gatchas[name].cost.growth;

  // const spent = sumOfPowers(base, growth, curr - 1);
  // const totalCost = sumOfPowers(base, growth, next);
  // const costDiff = floor(totalCost - spent);

  let costDiff = 0;
  for (let i = 0; i < diff; i++) {
    costDiff += getScaledGatcha(name, 'cost', curr + i);
  }

  return [diff, costDiff];
}

export function getScaledGatcha(
  name: GatchaName,
  type: 'cost' | 'value',
  _cnt = game.responses[name]
) {
  const params = gatchas[name][type];
  const cnt = _cnt + (type === 'value' ? -1 : 0);
  return (
    (power(params.base, params.growth, cnt) / game.divisors[name][type]) *
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
    power(game.crisis.base.value, game.crisis.scale.value, game.crisis.cnt);

  for (const name of GatchaNames) {
    income -= getScaledGatcha(name, 'value');
  }

  return income;
}

export function respond(
  name: GatchaName,
  next: false | [number, number] = false
) {
  const [amt, cost] = next ? next : [1, affordable(name)];
  if (cost) {
    const oldCnt = game.responses[name];
    const newCnt = (game.responses[name] += amt);
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

  const GatchaCnt = GatchaNames.length;

  let responseModifier = 0;
  for (let i = 0; i < GatchaCnt; i++) {
    const cnt = responses[i] ?? 0;
    if (cnt <= 0) {
      continue;
    }
    responseModifier += (400 / Math.max(cnt, 40)) * (i + 1);
  }

  const logBase = 100 - responseModifier;

  return Math.log(worth * -1) / Math.log(logBase);
}

export function bankrupt() {
  if (game.worth >= 0) {
    return;
  }

  const oldAvailable = availableGatchas();
  game.bankruptcies++;
  const available = availableGatchas();

  const [name, nerfType] = pickReward(
    game.gatchaRewards,
    game.gatchaRewardChanceModifier
  );
  if (available != oldAvailable && available <= GatchaNames.length) {
    game.gatchaRewards = Gatcha.mkRewardTable(availableGatchas() - 1);
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
  return power(game[type].base.cost, game[type].scale.cost, game[type].cnt);
}

export const PrestigeTypes = ['crisis', 'retirement'] as const;
export type PrestigeType = typeof PrestigeTypes[number];

export const PrestigeDescriptions = {
  crisis: 'Mid Life Crisis',
  retirement: 'Retire',
};

export function prestige(type: PrestigeType) {
  game[type].cnt++;

  game.bankruptcies = 0;

  for (let i = 0; i < runLazy(game[type].rewardCnt); i++) {
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
    if (mercyTicks === 0) {
      mercyEffect();
      mercyTicks--;
    } else if (mercyTicks > 0) {
      mercyTicks--;
    } else {
      detectLock(true);
    }
  }

  nextTick(() => requestAnimationFrame(gameLoop));
}
requestAnimationFrame(gameLoop);

export let mercyTicks = -1;
let mercyEffect = () => {};

const TickLimit = 60;
export function detectLock(doSetMercy: boolean) {
  const [name, cost] = [
    ...PrestigeTypes.map((name) => [name, prestigeCost(name)] as const),
    ...GatchaNames.slice(0, availableGatchas()).map(
      (name) => [name, getScaledGatcha(name, 'cost')] as const
    ),
  ].reduce((a, b) => (b[1] < a[1] ? b : a));

  if (cost <= game.worth) {
    return 0;
  }

  const income = getIncome();
  if (income === 0) {
    setMercy(doSetMercy, 'handle zero income', () => {
      game.worth = cost;
    });
  } else if (income < 0) {
    const ticksNeeded = (-1 * game.worth) / income;

    if (ticksNeeded >= TickLimit) {
      setMercy(doSetMercy, 'handle too long until bankrupt', () => {
        game.worth = 0;
      });
    }
  } else {
    const moneyNeeded = cost - game.worth;
    const ticksNeeded = moneyNeeded / income;

    if (ticksNeeded >= TickLimit) {
      setMercy(doSetMercy, 'handle too long until buyable', () => {
        game.worth = cost;
      });
    }

    return Math.max(ticksNeeded, 0);
  }
  return 0;
}

function setMercy(doSetMercy: boolean, msg: string, effect: () => void) {
  if (!doSetMercy) {
    return;
  }
  mercyTicks = 30;
  TODO(msg);
  mercyEffect = effect;
}

export function availableGatchas() {
  return Math.min(game.bankruptcies, game.retirement.cnt) + 1;
}
