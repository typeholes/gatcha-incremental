import { reactive } from 'vue';
import { Notify } from 'quasar';

export const GatchaNames = ['Prank', 'Punk', 'Scam', 'Phishing'] as const;

export type GatchaName = typeof GatchaNames[number];

export type Gatcha = {
  name: GatchaName;
  cost: { base: number; growth: number };
  value: { base: number; growth: number };
  tierMessages: [string, string, string, string];
};

function Gatcha(
  name: GatchaName,
  costBase: number,
  costGrowth: number,
  valueBase: number,
  valueGrowth: number,
  tierMessages: [string, string, string, string]
): Gatcha {
  return {
    name,
    cost: { base: costBase, growth: costGrowth },
    value: { base: valueBase, growth: valueGrowth },
    tierMessages,
  };
}

export const gatchas: Record<GatchaName, Gatcha> = Object.fromEntries(
  tuple(
    [
      Gatcha('Prank', 1, 1.1, 1, 1.1, [
        "You've learned to hang up",
        'Just chillin and eating some jerky, boys',
        'Mayby don\'t answer "scam likely"',
        "s/jerky/beasty cool now I've got some old school beats",
      ]),
      Gatcha('Punk', 10, 1.15, 10, 1.15, ['TBD', 'TBD', 'TBD', 'TBD']),
      Gatcha('Scam', 100, 1.18, 100, 1.18, ['TBD', 'TBD', 'TBD', 'TBD']),
      Gatcha('Phishing', 1000, 1.2, 1000, 1.2, ['TBD', 'TBD', 'TBD', 'TBD']),
    ].map((x) => [x.name, x])
  )
);

export type Game = {
  prestigeBase: number;
  prestigeMultiplier: number;
  responses: Record<GatchaName, number>;
  baseIncome: number;
  worth: number;
  bankruptcies: number;
  prestiges: number;
  divisors: Record<GatchaName, Record<'cost' | 'value', number>>;
  multipliers: Record<GatchaName, Record<'cost' | 'value', number>>;
};

const initialDivisors: Record<
  GatchaName,
  Record<'cost' | 'value', number>
> = Object.fromEntries(
  tuple(GatchaNames.map((x) => [x, { cost: 1, value: 1 }]))
);

const initialMultipliers: Record<
  GatchaName,
  Record<'cost' | 'value', number>
> = Object.fromEntries(
  tuple(GatchaNames.map((x) => [x, { cost: 1, value: 1 }]))
);

export const game: Game = reactive({
  responses: Object.fromEntries(tuple(GatchaNames.map((x) => [x, 0]))),
  baseIncome: 1,
  worth: 0,
  bankruptcies: 0,
  prestiges: 0,
  divisors: initialDivisors,
  multipliers: initialMultipliers,
  prestigeMultiplier: 1.5,
  prestigeBase: 1000,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function tuple<Args extends any[]>(args: Args): Args {
  return args;
}

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
  let income = sumOfPowers(
    game.baseIncome,
    game.prestigeMultiplier,
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

export function getBankruptcyValue() {
  const worth = game.worth >= 0 ? -1 : game.worth;

  const responseMultiplier = Object.values(game.responses).reduce(
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

  const nerfIdx =
    ceil(Math.random() * 99999999, 0) %
    Math.min(game.bankruptcies, GatchaNames.length);
  const name = GatchaNames[nerfIdx];
  const divisor = getBankruptcyValue();

  if (!Number.isFinite(divisor)) {
    debugger;
  }
  const nerfType = Math.random() < 0.5 ? 'cost' : 'value';

  game.divisors[name][nerfType] += divisor;
  const message = `${name} ${nerfType} reduced by ${ceil(divisor)}`;

  resetGameValues();
  Notify.create({
    message: `broke, broke again\n ${message}`,
    type: 'responseTier',
  });
}

export function canPrestige() {
  return (
    game.worth >
    sumOfPowers(game.prestigeBase, game.prestigeMultiplier, game.prestiges)
  );
}
export function prestige() {
  game.prestiges++;
  resetGameValues();
  Notify.create({
    message: `This doesn't do much yet, income * ${game.prestigeMultiplier}`,
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

function sumOfPowers(base: number, multiplier: number, cnt: number) {
  if (cnt < 0) {
    return 0;
  }
  if (cnt === 0) {
    return base;
  }
  return ceil((base * multiplier ** (cnt + 1) - 1) / (multiplier - 1));
}

/*
function inverseSumOfPowers(base: number, total: number) {
  return Math.floor(Math.log((base - 1) * total + 1) / Math.log(base));
}
*/

export function ceil(n: number, digits = 2) {
  const mult = 10 ** digits;
  return Math.ceil(n * mult) / mult;
}
