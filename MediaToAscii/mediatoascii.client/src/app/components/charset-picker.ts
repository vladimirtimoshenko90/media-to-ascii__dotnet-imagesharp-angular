import { Component, input, output } from '@angular/core';
import { AsciiCharsetOption } from '../services/configuration-api.service';

@Component({
  selector: 'app-charset-picker',
  template: `
    <div class="charset-grid">
      @for (option of options(); track option.id) {
        <button
          type="button"
          class="charset-sample"
          [class.is-selected]="option.id === value()"
          (click)="onSampleClick(option.id)"
        >
          {{ option.characters }}
        </button>
      }
    </div>
  `,
  styles: `
    .charset-grid {
      display: grid;
      gap: 0;
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      overflow: hidden;
      background: var(--bg);
    }

    .charset-sample {
      display: block;
      width: 100%;
      text-align: center;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      line-height: 1.35;
      color: var(--fg);
      background: transparent;
      border: 0;
      border-radius: 0;
      border-bottom: 1px solid var(--border);
      padding: 0.55rem 0.65rem;
      white-space: pre;
      overflow: hidden;
      text-overflow: ellipsis;

      &:last-of-type {
        border-bottom: 0;
      }

      &.is-selected {
        background: color-mix(in srgb, var(--accent) 8%, var(--surface));
        box-shadow: inset 2px 0 0 var(--accent);
      }
    }
  `,
})
export class CharsetPickerComponent {
  readonly options = input.required<AsciiCharsetOption[]>();
  readonly value = input.required<string>();
  readonly valueChange = output<string>();

  onSampleClick(id: string): void {
    if (id === this.value()) {
      return;
    }
    this.valueChange.emit(id);
  }
}
