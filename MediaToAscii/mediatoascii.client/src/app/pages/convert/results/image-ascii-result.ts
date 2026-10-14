import { Component, input } from '@angular/core';
import { AsciiFrame } from '@services/convert-api.service';
import { AsciiFrameViewerComponent } from './ascii-frame-viewer';

@Component({
  selector: 'app-image-ascii-result',
  imports: [AsciiFrameViewerComponent],
  template: `
    <div class="image-ascii-result">
      <div class="pane pane-original">
        <img [src]="imageUrl()" />
      </div>
      <div class="pane pane-ascii">
        <app-ascii-frame-viewer [frame]="frame()" />
      </div>
    </div>
  `,
  styles: `
    .image-ascii-result {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      min-height: 280px;
      max-height: 520px;

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
        max-height: none;
      }
    }

    .pane {
      min-height: 0;
      min-width: 0;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      overflow: auto;
    }

    .pane-original {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;

      img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      @media (max-width: 640px) {
        max-height: 280px;
      }
    }

    .pane-ascii {
      padding: 0.75rem;

      @media (max-width: 640px) {
        max-height: 320px;
      }
    }
  `,
})
export class ImageAsciiResultComponent {
  readonly imageUrl = input.required<string>();
  readonly frame = input.required<AsciiFrame>();
}
