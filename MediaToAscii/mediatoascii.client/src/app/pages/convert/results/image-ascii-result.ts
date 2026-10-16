import { Component, input } from '@angular/core';
import { AsciiFrame } from '@services/convert-api.service';
import { AsciiFrameViewerComponent } from './ascii-frame-viewer';

@Component({
  selector: 'app-image-ascii-result',
  imports: [AsciiFrameViewerComponent],
  template: `
    <div class="image-ascii-result">
      <app-ascii-frame-viewer [frame]="frame()" />
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: max-content;
      max-width: none;
      height: auto;
      max-height: none;
      overflow: visible;
    }

    .image-ascii-result {
      width: max-content;
      max-width: none;
      height: auto;
      max-height: none;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      padding: 0.75rem;
      overflow: visible;
    }
  `,
})
export class ImageAsciiResultComponent {
  readonly frame = input.required<AsciiFrame>();
}
