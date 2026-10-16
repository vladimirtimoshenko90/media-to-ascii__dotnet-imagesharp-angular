import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-toggle-switch',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleSwitchComponent),
      multi: true,
    },
  ],
  template: `
    <button
      type="button"
      class="toggle-switch"
      [class.is-on]="value()"
      [disabled]="disabled()"
      (click)="toggle()"
      (blur)="onTouched()"
    >
      <span>{{ label() }}</span>
      <span class="toggle-track">
        <span class="toggle-knob"></span>
      </span>
    </button>
  `,
  styles: `
    .toggle-switch {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      width: 100%;
      margin: 0;
      padding: 0.55rem 0.7rem;
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      background: var(--surface);
      color: var(--fg);
      font-size: 0.9rem;
      line-height: 1.2;
      text-align: left;
      cursor: pointer;
      user-select: none;
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease;

      &:hover:not(:disabled) {
        border-color: color-mix(in srgb, var(--fg) 35%, var(--border));
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--focus) 28%, transparent);
        border-color: var(--focus);
      }

      &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      &.is-on {
        background: color-mix(in srgb, var(--accent) 8%, var(--surface));
        border-color: color-mix(in srgb, var(--accent) 45%, var(--border));

        .toggle-track {
          background: var(--accent);
          border-color: var(--accent);
        }

        .toggle-knob {
          transform: translateX(0.85rem);
        }
      }
    }

    .toggle-track {
      position: relative;
      flex-shrink: 0;
      width: 1.85rem;
      height: 1rem;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--bg);
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease;
    }

    .toggle-knob {
      position: absolute;
      top: 1px;
      left: 1px;
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 50%;
      background: var(--surface);
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--fg) 12%, transparent);
      transition: transform 0.15s ease;
    }
  `,
})
export class ToggleSwitchComponent implements ControlValueAccessor {
  readonly label = input.required<string>();

  readonly value = signal(false);
  readonly disabled = signal(false);

  private onChange: (value: boolean) => void = () => undefined;
  onTouched: () => void = () => undefined;

  writeValue(value: boolean | null): void {
    this.value.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  toggle(): void {
    if (this.disabled()) {
      return;
    }

    const next = !this.value();
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
  }
}
