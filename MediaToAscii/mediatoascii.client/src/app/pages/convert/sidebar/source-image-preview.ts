import { Component, input } from '@angular/core';

@Component({
  selector: 'app-source-image-preview',
  template: `
    <div class="source-image-preview">
      <img [src]="imageUrl()" alt="" />
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-width: 0;
    }

    .source-image-preview {
      display: block;
      width: 100%;
      margin: 0;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: 0;
      overflow: hidden;
      background: transparent;
    }

    img {
      display: block;
      width: 100%;
      height: auto;
      margin: 0;
      padding: 0;
    }
  `,
})
export class SourceImagePreviewComponent {
  readonly imageUrl = input.required<string>();
}
