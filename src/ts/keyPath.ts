/* eslint-disable @typescript-eslint/no-explicit-any */
import { defined } from './util';

export type KeyPath<
  T,
  A extends keyof T,
  B extends keyof T[A] = never,
  C extends keyof T[A][B] = never,
  D extends keyof T[A][B][C] = never
> = [A] | [A, B] | [A, B, C] | [A, B, C, D];

export type KeyPathT<T> = KeyPath<
T,
keyof T | never,
keyof T[any] | never,
keyof T[any][any] | never,
keyof T[any][any][any] | never
>

export function mkGetter<
  T,
  A extends keyof T,
  B extends keyof T[A] = never,
  C extends keyof T[A][B] = never,
  D extends keyof T[A][B][C] = never
  >(t: T) {

  return (a: A, b?: B, c?: C, d?: D) => keyPath(t,a,b,c,d);
  }

export function keyPath<
  T,
  A extends keyof T,
  B extends keyof T[A] = never,
  C extends keyof T[A][B] = never,
  D extends keyof T[A][B][C] = never
>(t: T, a: A, b?: B, c?: C, d?: D): KeyPath<T, A, B, C, D> {
  return defined(b)
    ? defined(c)
      ? defined(d)
        ? [a, b, c, d]
        : [a, b, c]
      : [a, b]
    : [a];
}



export function deepGet<
  T,
  A extends keyof T,
  >( t: T, p: KeyPath<T,A>) : T[A] ;

export function deepGet<
  T,
  A extends keyof T,
  B extends keyof T[A] ,
  >( t: T, p: KeyPath<T,A,B>) : T[A][B] ;

export function deepGet<
  T,
  A extends keyof T,
  B extends keyof T[A] ,
  C extends keyof T[A][B],
  >( t: T, p: KeyPath<T,A,B,C>) : T[A][B][C] ;

export function deepGet<
  T,
  A extends keyof T,
  B extends keyof T[A] ,
  C extends keyof T[A][B],
  D extends keyof T[A][B][C]>( t: T, p: KeyPath<T,A,B,C,D>) : T[A][B][C][D] ;

export function deepGet<
  T,
  A extends keyof T,
  B extends keyof T[A] = never,
  C extends keyof T[A][B] = never,
  D extends keyof T[A][B][C] = never>( t: T, p: KeyPath<T,A,B,C,D>) {
    const [a,b,c,d] = p;
  return defined(b)
    ? defined(c)
      ? defined(d)
        ? t[a][b][c][d]
        : t[a][b][c]
        : t[a][b]
        : t[a];
}

export function deepSet<
  T,
  V extends T[A][B][C][D],
  A extends keyof T,
  B extends keyof T[A],
  C extends keyof T[A][B],
  D extends keyof T[A][B][C],
  >(t: T, p: KeyPath<T,A,B,C,D>, v: V) : void ;

  export function deepSet<
  T,
  V extends T[A][B][C],
  A extends keyof T,
  B extends keyof T[A],
  C extends keyof T[A][B],
  >(t: T, p: KeyPath<T,A,B,C>, v: V) : void ;

  export function deepSet<
  T,
  V extends T[A][B],
  A extends keyof T,
  B extends keyof T[A],
  >(t: T, p: KeyPath<T,A,B>, v: V) : void ;

  export function deepSet<
  T,
  V extends T[A],
  A extends keyof T,
  >(t: T, p: KeyPath<T,A>, v: V) : void ;

export function deepSet<
  T,
  V extends T[A] | T[A][B] | T[A][B][C] | T[A][B][C][D],
  A extends keyof T,
  B extends keyof T[A] | never,
  C extends keyof T[A][B] | never,
  D extends keyof T[A][B][C] | never,
  >(t: T, p: KeyPath<T,A,B,C,D>, v: V) : void {
    const [a,b,c,d] = p;
  const [tgt, key] =  defined(b)
    ? defined(c)
      ? defined(d)
        ? [t[a][b][c],d]
        : [t[a][b],c]
        : [t[a],b]
        : [t,a];

        tgt[key as never] = v as never;
  }

const obj = { a: { b: {c : {dfff: 1}}}} as const;


export const foo = keyPath(obj, 'a', 'b', 'c'  );

const _bar = deepGet(obj, foo);

deepSet(obj, foo, { dfff: 1 })


