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
    :host {
      display: block;
      width: max-content;
      max-width: none;
      height: auto;
      max-height: none;
      overflow: visible;
    }

    .image-ascii-result {
      display: grid;
      grid-template-columns: auto max-content;
      gap: 0.75rem;
      align-items: start;
      width: max-content;
      height: auto;
      max-height: none;

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
        width: 100%;
      }
    }

    .pane {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      overflow: visible;
      height: auto;
      max-height: none;
    }

    .pane-original {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 0.5rem;

      img {
        display: block;
        max-width: 280px;
        width: auto;
        height: auto;
      }

      @media (max-width: 640px) {
        img {
          max-width: 100%;
        }
      }
    }

    .pane-ascii {
      padding: 0.75rem;
    }
  `,
})
export class ImageAsciiResultComponent {
  readonly imageUrl = input.required<string>();
  readonly frame = input.required<AsciiFrame>();
}
