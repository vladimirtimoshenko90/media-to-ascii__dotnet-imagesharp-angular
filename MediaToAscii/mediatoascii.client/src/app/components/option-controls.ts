import { Component, inject, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DEFAULT_CONVERT_OPTIONS } from '../constants/default-convert-options';
import {
  AsciiCharsetOption,
  ConfigurationApiService,
} from '../services/configuration-api.service';
import { ConvertOptions } from '../services/convert-api.service';
import { CharsetPickerComponent } from './charset-picker';

@Component({
  selector: 'app-option-controls',
  imports: [FormsModule, CharsetPickerComponent],
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

      <app-charset-picker
        [options]="charsets"
        [value]="charsetId"
        (valueChange)="onCharsetChange($event)"
      />
    </div>
  `,
  styles: `
    .opt-row {
      display: grid;
      gap: 0.85rem;

      label.form-label,
      .form-check-label {
        color: var(--fg);
        font-size: 0.9rem;
      }
    }
  `,
})
export class OptionControlsComponent implements OnInit {
  private readonly configurationApi = inject(ConfigurationApiService);

  readonly optionsChange = output<ConvertOptions>();

  charsets: AsciiCharsetOption[] = [];
  width = DEFAULT_CONVERT_OPTIONS.width;
  invert = DEFAULT_CONVERT_OPTIONS.invert;
  charsetId = DEFAULT_CONVERT_OPTIONS.charset;

  ngOnInit(): void {
    this.configurationApi.getConvertOptions().subscribe((data) => (this.charsets = data));
  }

  onCharsetChange(id: string): void {
    this.charsetId = id;
    this.emitOptions();
  }

  emitOptions(): void {
    this.optionsChange.emit({
      width: this.width,
      invert: this.invert,
      charset: this.charsetId,
    });
  }
}
