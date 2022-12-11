import { reactive } from 'vue';
import { Notify } from 'quasar';
import { sumOfPowers, ceil, tuple } from './util';
import { CostValue, Gatcha, GatchaName, GatchaNames, gatchas } from './gatcha';
import { pickReward, RewardTable } from './random';

export type Game = {
  prestige: {
    base: Record<CostValue, number>;
    scale: Record<CostValue, number>;
  };
  responses: Record<GatchaName, number>;
  baseIncome: number;
  worth: number;
  bankruptcies: number;
  prestiges: number;
  divisors: Record<GatchaName, Record<CostValue, number>>;
  multipliers: Record<GatchaName, Record<CostValue, number>>;
  gatchaRewards: RewardTable<readonly [GatchaName, CostValue]>;
  gatchaRewardChanceModifier: number;
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
  prestiges: 0,
  divisors: initialDivisors(),
  multipliers: initialMultipliers(),
  prestigeMultiplier: 10,
  prestige: {
    base: { cost: 10, value: 1.5 },
    scale: { cost: 1.5, value: 1.5 },
  },
  gatchaRewards: Gatcha.mkRewardTable(0),
  gatchaRewardChanceModifier: 1
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
      game.prestige.base.value,
      game.prestige.scale.value,
      game.prestiges
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

  const [name, nerfType] = pickReward(game.gatchaRewards, game.gatchaRewardChanceModifier);
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

export function prestigeCost() {
  return sumOfPowers(
    game.prestige.base.cost,
    game.prestige.scale.cost,
    game.prestiges
  );
}

export function canPrestige() {
  return game.worth > prestigeCost();
}
export function prestige() {
  game.prestiges++;
  resetGameValues();

  game.divisors = initialDivisors();
  game.multipliers = initialMultipliers();

  Notify.create({
    message: `This doesn't do much yet, income * ${game.prestige.scale.value}`,
    type: 'prestige',
  });
}

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

let usedTime = 0;
function gameLoop(time: number) {
  const deltaTime = time - usedTime;
  if (deltaTime > 500) {
    usedTime += deltaTime;
    game.worth += getIncome();
  }

  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
