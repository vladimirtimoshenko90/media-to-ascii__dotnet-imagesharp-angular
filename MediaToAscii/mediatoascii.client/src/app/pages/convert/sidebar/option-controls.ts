import {
  Component,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';
import { ToggleSwitchComponent } from '@components/toggle-switch';
import { AsciiCharsetOption } from '@services/configuration-api.service';
import { ConvertOptions } from '@services/convert-api.service';
import { CharsetPickerComponent } from './charset-picker';

@Component({
  selector: 'app-option-controls',
  imports: [FormsModule, CharsetPickerComponent, ToggleSwitchComponent],
  template: `
    <div class="opt-row">
      <div>
        <div class="d-flex justify-content-between align-items-baseline mb-1">
          <label class="form-label mb-0" for="convert-width">Width</label>
          <span class="opt-meta">{{ liveWidth() }}</span>
        </div>
        <input
          id="convert-width"
          type="range"
          class="form-range"
          min="40"
          max="200"
          [ngModel]="liveWidth()"
          (ngModelChange)="liveWidth.set(+$event)"
        />
      </div>

      <app-toggle-switch
        label="Invert"
        [ngModel]="options().invert"
        (ngModelChange)="emitPatch({ invert: $event })"
      />

      <app-charset-picker
        [options]="charsets()"
        [value]="options().charset"
        (valueChange)="emitPatch({ charset: $event })"
      />
    </div>
  `,
  styles: `
    .opt-row {
      display: grid;
      gap: 0.85rem;

      .form-label {
        color: var(--fg);
        font-size: 0.9rem;
      }
    }
  `,
})
export class OptionControlsComponent {
  readonly charsets = input.required<AsciiCharsetOption[]>();

  readonly options = input.required<ConvertOptions>();
  readonly optionsChange = output<ConvertOptions>();

  readonly liveWidth = linkedSignal(() => this.options().width);

  constructor() {
    toObservable(this.liveWidth)
      .pipe(
        debounceTime(400),
        filter((width) => width !== this.options().width),
        takeUntilDestroyed(),
      )
      .subscribe((width) => this.emitPatch({ width }));
  }

  emitPatch(patch: Partial<ConvertOptions>): void {
    this.optionsChange.emit({
      ...this.options(),
      width: this.liveWidth(),
      ...patch,
    });
  }
}
