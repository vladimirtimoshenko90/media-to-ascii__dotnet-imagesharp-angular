import { Component, input } from '@angular/core';

@Component({
  selector: 'app-image-compare',
  template: `
    <div class="image-compare">
      <div class="pane pane-original">
        <img [src]="imageUrl()" />
      </div>
      <div class="pane pane-ascii">
        <pre>{{ ascii() }}</pre>
      </div>
    </div>
  `,
  styles: `
    .image-compare {
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

      pre {
        margin: 0;
        font-family: var(--font-mono);
        font-size: 11px;
        line-height: 1;
        white-space: pre;
        color: var(--fg);
      }

      @media (max-width: 640px) {
        max-height: 320px;
      }
    }
  `,
})
export class ImageCompareComponent {
  readonly imageUrl = input.required<string>();
  readonly ascii = input.required<string>();
}
