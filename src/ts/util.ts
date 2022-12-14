import { Notify } from 'quasar';

export function power(base: number, multiplier: number, cnt: number) {
  if (cnt < 0) {
    return 0;
  }

  // if (cnt === 0) {
  //   return base;
  // }

  return base * multiplier ** cnt;
}

export function sumOfPowers(base: number, multiplier: number, cnt: number) {
  if (cnt < 0) {
    return 0;
  }
  if (cnt === 0) {
    return base;
  }

  //  const sum = ceil((base * multiplier) ** (cnt - 1 ) / (multiplier-1));

  let naive = base;
  let spent = 0;
  for (let i = 0; i < cnt; i++) {
    spent += naive;
    naive *= multiplier;
  }

  return spent;

  /*
  if (spent != sum) {
    console.log({ naive, sum, base, multiplier, cnt });
    // debugger;
  }

  return sum;
  */
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

export function floor(n: number, digits = 2) {
  const mult = 10 ** digits;
  return Math.floor(n * mult) / mult;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function tuple<Args extends any[]>(args: Args): Args {
  return args;
}

export function sumOn<T>(arr: T[], toNumber: (t: T) => number) {
  return arr.map((x) => toNumber(x)).reduce((a, b) => a + b, 0);
}

export function defined<T>(x: T | undefined): x is T {
  return typeof x !== 'undefined' && x !== null;
}

export const id = <T>(t: T) => t;

export type Lazy<T> = T | (() => T);
export function runLazy<T>(t: Lazy<T>): T {
  if (t instanceof Function) {
    return t();
  }
  return t;
}

export function TODO(msg: string) {
  Notify.create({
    message: 'Not implemented: ' + msg,
    type: 'TODO',
  });
}
