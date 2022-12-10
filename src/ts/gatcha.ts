import { RewardTable } from './random';
import { tuple } from './util';

export const CostValue = ['cost', 'value'] as const;
export type CostValue = typeof CostValue[number];

export function Gatcha(
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

export const GatchaNames = ['Prank', 'Punk', 'Scam', 'Phishing'] as const;

export type GatchaName = typeof GatchaNames[number];

export type Gatcha = {
  name: GatchaName;
  cost: { base: number; growth: number };
  value: { base: number; growth: number };
  tierMessages: [string, string, string, string];
};

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

Gatcha.mkRewardTable = (
  bankruptcies: number
): RewardTable<readonly [GatchaName, CostValue]> => {
  const n = bankruptcies + 1;
  const cnt = Math.min(Math.max(1, n), GatchaNames.length);
  const names = GatchaNames.slice(0, cnt);
  const rewards = names
    .map((name) => CostValue.map((type) => [name, type] as const))
    .flat(1);
  return RewardTable(rewards);
};
