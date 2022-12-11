import { sumOn } from './util';

export type RewardTable<T> = { defaultSize: number; table: [number, T][] };

export function RewardTable<T>(
  rewards: T[],
  defaultSize = 2
): RewardTable<T> {
  const table = {
    defaultSize,
    table: rewards.map((x) => [defaultSize, x] as [number, T]),
  };
  return table;
}

export function pickReward<T>(from: RewardTable<T>, chanceModifier: number) {
  const totalSize = sumOn(from.table, ([x]) => x);
  let r = Math.random() * totalSize;

  for (const i in from.table) {
    const option = from.table[i];
    const [size, reward] = option;
    if (r < size) {
      if (size > 1) {
        option[0] = Math.max(1, option[0] - chanceModifier);
      }

      resetWhenAllOne(from);
      return reward;
    }

    r -= size;
  }

  throw 'pickReward exhausted all rewards';
}

function resetWhenAllOne<T>(rewardTable: RewardTable<T>) {
  if (rewardTable.table.every(([x]) => x === 1)) {
    rewardTable.table.forEach((x) => (x[0] = rewardTable.defaultSize));
  }
}
