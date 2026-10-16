import { Component, input } from '@angular/core';

@Component({
  selector: 'app-source-image-preview',
  template: `
    <div class="source-image-preview">
      <img [src]="imageUrl()" />
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-width: 0;
    }

    .source-image-preview {
      width: 100%;
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      overflow: hidden;
      background: var(--bg);
    }

    img {
      display: block;
      width: 100%;
      height: auto;
    }
  `,
})
export class SourceImagePreviewComponent {
  readonly imageUrl = input.required<string>();
}
