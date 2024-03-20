/* eslint-disable @typescript-eslint/no-empty-function */

import { reactive, nextTick, ref } from 'vue';
import { Notify } from 'quasar';
import { ceil, tuple, TODO, power, defined } from './util';
import { CostValue, Gatcha, GatchaName, GatchaNames, gatchas } from './gatcha';
import { pickReward, RewardTable } from './random';
import { deepGet, deepSet, keyPath, KeyPathT } from './keyPath';

const SaveKey = 'gatha-fool';

export type Game = {
  retirement: {
    base: Record<CostValue, number>;
    scale: Record<CostValue, number>;
    cnt: number;
    rewards: PrestigeRewardTable;
    rewardCnt: number | KeyPathT<Game>;
  };
  crisis: {
    base: Record<CostValue, number>;
    scale: Record<CostValue, number>;
    cnt: number;
    rewards: PrestigeRewardTable;
    rewardCnt: number | KeyPathT<Game>;
  };
  responses: Record<GatchaName, number>;
  baseIncome: number;
  worth: number;
  bankruptcies: number;
  tmpDivisors: Record<GatchaName, Record<CostValue, number>>;
  divisors: Record<GatchaName, Record<CostValue, number>>;
  multipliers: Record<GatchaName, Record<CostValue, number>>;
  gatchaRewards: RewardTable<readonly [GatchaName, CostValue]>;
  gatchaRewardChanceModifier: number;
  gatchaRewardChanceModifierScaling: number;
  tutorialFlags: Record<
    'SplashScreen' | 'DummyTutorial',
    { conditionMet: boolean; shown: boolean }
  >;
  currentTutorial?: keyof Game['tutorialFlags'];
};

const setters = {
  '+=': (a: number, b: number) => a + b,
  '-=': (a: number, b: number) => a - b,
  '*=': (a: number, b: number) => a * b,
  '/=': (a: number, b: number) => a / b,
} as const;
type Setter = keyof typeof setters;

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

//const gameGetter = mkGetter(game);
export const game: Game = (() => {
  const ret: Game = reactive({
    responses: Object.fromEntries(tuple(GatchaNames.map((x) => [x, 0]))),
    baseIncome: 1,
    worth: 0,
    bankruptcies: 0,
    divisors: initialDivisors(),
    tmpDivisors: initialDivisors(),
    multipliers: initialMultipliers(),
    crisis: {
      base: { cost: 1000, value: 1 },
      scale: { cost: 1.5, value: 2 },
      cnt: 0,
      rewards: undefined as never, //crisisRewards(),
      rewardCnt: 1,
    },
    retirement: {
      base: { cost: 100000, value: 1.5 },
      scale: { cost: 1.5, value: 1.5 },
      cnt: 0,
      rewards: undefined as never, // retirementRewards(),
      rewardCnt: 1,
    },
    gatchaRewards: Gatcha.mkRewardTable(1),
    gatchaRewardChanceModifier: 1,
    gatchaRewardChanceModifierScaling: 2,
    tutorialFlags: {
      SplashScreen: {
        conditionMet: true,
        shown: false,
      },
      DummyTutorial: {
        conditionMet: false,
        shown: false,
      },
    },
    currentTutorial: undefined,
  });
  ret.retirement.rewardCnt = keyPath(ret, 'retirement', 'cnt');
  ret.crisis.rewards = crisisRewards(ret);
  ret.retirement.rewards = retirementRewards(ret);
  return ret;
})();

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

export function getDivisor(name: GatchaName, type: CostValue) {
  return game.divisors[name][type] * game.tmpDivisors[name][type];
}

export function getScaledGatcha(
  name: GatchaName,
  type: 'cost' | 'value',
  _cnt = game.responses[name],
) {
  const params = gatchas[name][type];
  const cnt = _cnt + (type === 'value' ? -1 : 0);
  return (
    (power(params.base, params.growth, cnt) / getDivisor(name, type)) *
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
  next: false | [number, number] = false,
) {
  const [amt, cost] = next ? next : [1, affordable(name)];
  if (cost) {
    const oldCnt = game.responses[name];
    const newCnt = (game.responses[name] += amt);
    checkTiers(name, oldCnt, newCnt);
    game.worth -= cost;
  }
}

// function getBuyAmt(name: GatchaName) {
//   return 1;
// }

function resetGameValues() {
  game.worth = 0;
  for (const name of GatchaNames) {
    game.responses[name] = 0;
  }
  game.tmpDivisors = initialDivisors();
  resetTutorials();
}

function resetTutorials() {
  for (const key in game.tutorialFlags) {
    const tutorial = key as keyof Game['tutorialFlags'];
    game.tutorialFlags[tutorial] = { conditionMet: false, shown: false };
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
    game.gatchaRewardChanceModifier,
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
export type PrestigeType = (typeof PrestigeTypes)[number];

export const PrestigeDescriptions = {
  crisis: 'Mid Life Crisis',
  retirement: 'Retire',
};

export function prestige(type: PrestigeType) {
  game[type].cnt++;

  game.bankruptcies = 0;

  game.tmpDivisors = initialDivisors();

  for (let i = 0; i < runLazy(game[type].rewardCnt); i++) {
    const [message, effects] = pickReward(game[type].rewards);
    for (const [path, op, arg] of effects) {
      // WARNING: whole lot of casting here
      deepSet(
        game,
        path as never,
        setters[op](deepGet(game, path as never) as number, arg),
      );
    }

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

const tiers = [5, 12, 25, 30, 50];
export function checkTiers(name: GatchaName, oldCnt: number, newCnt: number) {
  const reached = tiers
    .map((x, i) =>
      oldCnt < x && newCnt >= x
        ? { tier: i, message: gatchas[name].tierMessages[i] ?? 'TBD' }
        : false,
    )
    .filter((x) => x != false);

  for (const t of reached) {
    if (t) {
      const maxTiers = gatchas[name].tierMessages.length - 1;
      console.log({ tier: t.tier, maxTiers });
      let message = '';

      const divisor = 1;
      if (t.tier === maxTiers) {
        game.multipliers[name].cost += 1000000;
        message = `${name} is no longer interested in you`;
      } else if (t.tier === maxTiers - 1) {
        game.multipliers[name].value -= divisor / 10000;
        message = `${name} me? No, ${name} you`;
      } else if (t.tier === maxTiers - 2) {
        game.multipliers[name].value = 0;
        message = `You no longer fall for ${name}`;
      } else {
        game.tmpDivisors[name].value += divisor;
      }

      Notify.create({
        message: `${t.message} ${message}`,
        type: 'tier',
      });
    }
  }

  return reached;
}

type PrestigeRewardTable = RewardTable<
  readonly [string, [KeyPathT<Game>, Setter, number][]]
>;

function crisisRewards(game: Game): PrestigeRewardTable {
  return RewardTable([
    ['Extra Income', [[keyPath(game, 'baseIncome'), '*=', 1.1]]],
    [
      'Less likely to receive same rewards',
      [[keyPath(game, 'gatchaRewardChanceModifier'), '+=', 1]],
    ],
    [
      'More likely to receive same reward after getting all rewards',
      [[keyPath(game, 'gatchaRewardChanceModifierScaling'), '*=', 2]],
    ],
  ]);
}

function retirementRewards(game: Game): PrestigeRewardTable {
  return RewardTable([
    [
      'Rewards per Mid Life Crises',
      [[keyPath(game, 'crisis', 'rewardCnt'), '+=', 1]],
    ],
    [
      'Mid Life Crisis cost reduced',
      [[keyPath(game, 'crisis', 'base', 'cost'), '*=', 0.9]],
    ],
    [
      'Mid Life Crisis scaling reduced',
      [[keyPath(game, 'crisis', 'scale', 'cost'), '*=', 0.95]],
    ],
    [
      'Mid Life Crisis income scaling increased',
      [[keyPath(game, 'crisis', 'scale', 'value'), '*=', 1.05]],
    ],
  ]);
}

let pause = false;
let usedTime = 0;
function gameLoop(time: number) {
  const deltaTime = time - usedTime;
  if (!pause && deltaTime > 500) {
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
    save();
  }

  nextTick(() => requestAnimationFrame(gameLoop));
}

export const loaded = ref(false);
load();
requestAnimationFrame(gameLoop);

export let mercyTicks = -1;
let mercyEffect = () => {};

const TickLimit = 60;
export function detectLock(doSetMercy: boolean) {
  const [_name, cost] = [
    ...PrestigeTypes.map((name) => [name, prestigeCost(name)] as const),
    ...GatchaNames.slice(0, availableGatchas()).map(
      (name) => [name, getScaledGatcha(name, 'cost')] as const,
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
    return Math.max(ticksNeeded, 0);
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
  return Math.min(game.bankruptcies, game.crisis.cnt) + 1;
}

function save() {
  const saveStr = JSON.stringify(game);
  window.localStorage.setItem(SaveKey, saveStr);
}

function load() {
  const saveStr = window.localStorage.getItem(SaveKey);
  if (defined(saveStr)) {
    const loadedGame = JSON.parse(saveStr);
    resetTutorials();
    Object.assign(game, loadedGame);
    game.currentTutorial ??= game.tutorialFlags.SplashScreen.shown
      ? undefined
      : 'SplashScreen';
    loaded.value = true;
  }
}

let resetSafety = 6;
export function hardReset() {
  resetSafety--;
  if (resetSafety <= 0) {
    pause = true;
    window.localStorage.removeItem(SaveKey);
    window.location.reload();
  }
  Notify.create({
    type: 'reset',
    message: `Click ${resetSafety} more times to wipe all progress`,
  });
  return resetSafety;
}

export type Lazy = number | KeyPathT<Game>;
export function runLazy(t: Lazy): number {
  // WARNING: casting
  return typeof t === 'number' ? t : (deepGet(game, t as never) as number);
}

export function doTutorial(tutorial: keyof Game['tutorialFlags']) {
  const flags = game.tutorialFlags[tutorial];
  if (flags.shown) return;
  flags.conditionMet = true;
  game.currentTutorial = tutorial;
}

export function finishTutorial(onFinish: (...args: any[]) => void) {
  if (!game.currentTutorial) return;
  game.tutorialFlags[game.currentTutorial].shown = true;
  game.currentTutorial = undefined;
  onFinish();
  save();
}
