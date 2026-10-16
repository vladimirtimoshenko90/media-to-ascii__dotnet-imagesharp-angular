import {
  Component,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';
import { RangeSliderComponent } from '@components/range-slider';
import { ToggleSwitchComponent } from '@components/toggle-switch';
import { ASCII_WIDTH } from '@constants/ascii-width';
import { AsciiCharsetOption } from '@services/configuration-api.service';
import { ConvertOptions } from '@services/convert-api.service';
import { CharsetPickerComponent } from './charset-picker';

@Component({
  selector: 'app-option-controls',
  imports: [
    FormsModule,
    CharsetPickerComponent,
    RangeSliderComponent,
    ToggleSwitchComponent,
  ],
  template: `
    <div class="opt-row">
      <app-range-slider
        label="Resolution"
        [min]="ASCII_WIDTH.MIN"
        [max]="ASCII_WIDTH.MAX"
        [ngModel]="liveWidth()"
        (ngModelChange)="liveWidth.set($event)"
      />

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
    }
  `,
})
export class OptionControlsComponent {
  readonly ASCII_WIDTH = ASCII_WIDTH;

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
