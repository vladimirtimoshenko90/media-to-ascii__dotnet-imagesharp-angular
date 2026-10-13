import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AsciiCharsets,
  AsciiCharsetName,
} from '../constants/ascii-charsets';
import { DEFAULT_CONVERT_OPTIONS } from '../constants/default-convert-options';
import { ConvertOptions } from '../services/convert-api.service';

@Component({
  selector: 'app-option-controls',
  imports: [FormsModule],
  template: `
    <div class="opt-row">
      <div>
        <div class="d-flex justify-content-between align-items-baseline mb-1">
          <label class="form-label mb-0" for="convert-width">Width</label>
          <span class="opt-meta">{{ width }}</span>
        </div>
        <input
          id="convert-width"
          type="range"
          class="form-range"
          min="40"
          max="200"
          [(ngModel)]="width"
          (ngModelChange)="emitOptions()"
        />
      </div>

      <div class="form-check">
        <input
          id="convert-invert"
          type="checkbox"
          class="form-check-input"
          [(ngModel)]="invert"
          (ngModelChange)="emitOptions()"
        />
        <label class="form-check-label" for="convert-invert">Invert</label>
      </div>

      <div>
        <label class="form-label" for="convert-charset">Character set</label>
        <select
          id="convert-charset"
          class="form-select form-select-sm"
          [(ngModel)]="charsetName"
          (ngModelChange)="emitOptions()"
        >
          @for (name of charsetNames; track name) {
            <option [value]="name">{{ name }}</option>
          }
        </select>
      </div>
    </div>
  `,
  styles: `
    .opt-row {
      display: grid;
      gap: 0.85rem;
    }

    .opt-row label.form-label,
    .opt-row .form-check-label {
      color: var(--fg);
      font-size: 0.9rem;
    }
  `,
})
export class OptionControlsComponent {
  readonly optionsChange = output<ConvertOptions>();

  readonly charsetNames = Object.keys(AsciiCharsets) as AsciiCharsetName[];

  width = DEFAULT_CONVERT_OPTIONS.width;
  invert = DEFAULT_CONVERT_OPTIONS.invert;
  charsetName: AsciiCharsetName = 'Classic';

  emitOptions(): void {
    this.optionsChange.emit({
      width: this.width,
      invert: this.invert,
      charset: AsciiCharsets[this.charsetName],
    });
  }
}
