import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AsciiCharsets,
  AsciiCharsetName,
} from '../constants/ascii-charsets';
import {
  ConvertOptions,
  DEFAULT_CONVERT_OPTIONS,
} from '../services/convert-api.service';

@Component({
  selector: 'app-option-controls',
  imports: [FormsModule],
  template: `
    <div class="option-controls d-flex flex-column gap-3">
      <div>
        <label class="form-label" for="convert-width">
          Width: {{ width }}
        </label>
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
        <label class="form-label" for="convert-charset">Charset</label>
        <select
          id="convert-charset"
          class="form-select"
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
