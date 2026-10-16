import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-range-slider',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSliderComponent),
      multi: true,
    },
  ],
  template: `
    <div class="range-slider" [class.is-disabled]="disabled()">
      <div class="range-slider__header">
        <label class="range-slider__label" [attr.for]="inputId">{{ label() }}</label>
        <span class="range-slider__value">{{ value() }}</span>
      </div>
      <input
        [id]="inputId"
        type="range"
        class="range-slider__input"
        [min]="min()"
        [max]="max()"
        [value]="value()"
        [disabled]="disabled()"
        (input)="onInput($event)"
        (change)="onTouched()"
        (blur)="onTouched()"
      />
    </div>
  `,
  styles: `
    .range-slider {
      display: grid;
      gap: 0.55rem;
      padding: 0.55rem 0.7rem 0.7rem;
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      background: var(--surface);
      transition: border-color 0.15s ease;

      &:hover:not(.is-disabled) {
        border-color: color-mix(in srgb, var(--fg) 35%, var(--border));
      }

      &.is-disabled {
        opacity: 0.55;
      }
    }

    .range-slider__header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .range-slider__label {
      margin: 0;
      color: var(--fg);
      font-size: 0.9rem;
      line-height: 1.2;
      cursor: pointer;
    }

    .range-slider__value {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--muted);
      white-space: nowrap;
    }

    .range-slider__input {
      appearance: none;
      width: 100%;
      height: 0.35rem;
      margin: 0;
      border-radius: 999px;
      background: var(--bg);
      outline: none;
      cursor: pointer;

      &:disabled {
        cursor: not-allowed;
      }

      &:focus-visible {
        box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--focus) 28%, transparent);
      }

      &::-webkit-slider-thumb {
        appearance: none;
        width: 1rem;
        height: 1rem;
        border: 1px solid color-mix(in srgb, var(--accent) 70%, var(--fg));
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--fg) 8%, transparent);
        cursor: pointer;
      }

      &::-moz-range-thumb {
        width: 1rem;
        height: 1rem;
        border: 1px solid color-mix(in srgb, var(--accent) 70%, var(--fg));
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--fg) 8%, transparent);
        cursor: pointer;
      }

      &::-moz-range-track {
        height: 0.35rem;
        border-radius: 999px;
        background: var(--bg);
      }
    }
  `,
})
export class RangeSliderComponent implements ControlValueAccessor {
  private static nextId = 0;

  readonly label = input.required<string>();
  readonly min = input.required<number>();
  readonly max = input.required<number>();

  readonly value = signal(0);
  readonly disabled = signal(false);
  readonly inputId = `range-slider-${RangeSliderComponent.nextId++}`;

  private onChange: (value: number) => void = () => undefined;
  onTouched: () => void = () => undefined;

  writeValue(value: number | null): void {
    this.value.set(value ?? this.min());
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onInput(event: Event): void {
    if (this.disabled()) {
      return;
    }

    const next = +(event.target as HTMLInputElement).value;
    this.value.set(next);
    this.onChange(next);
  }
}
