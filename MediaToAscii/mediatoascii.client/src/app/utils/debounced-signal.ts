import { effect, signal, Signal } from '@angular/core';

/** Readonly signal that lags `source` by `delayMs` (initial value is immediate). */
export function debouncedSignal<T>(source: Signal<T>, delayMs = 400): Signal<T> {
  const out = signal(source());
  effect((onCleanup) => {
    const value = source();
    const timer = setTimeout(() => out.set(value), delayMs);
    onCleanup(() => clearTimeout(timer));
  });
  return out.asReadonly();
}
