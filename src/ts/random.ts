import { sumOn } from './util';

export type RewardTable<T> = [number, T][];

export function RewardTable<T>(
  rewards: T[],
  defaultSize = 100
): RewardTable<T> {
  return rewards.map((x) => [defaultSize, x]);
}

export function pickReward<T>(from: RewardTable<T>) {
  const totalSize = sumOn(from, ([x]) => x);
  let r = Math.random() * totalSize;

  for (const i in from) {
    const option = from[i];
    const [size, reward] = option;
    if (r < size) {
      if (size > 1) {
        option[0]--;
      }
      return reward;
    }

    r -= size;
  }

  throw 'pickReward exhausted all rewards';
}
