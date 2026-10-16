import { Component, input } from '@angular/core';

@Component({
  selector: 'app-source-video-preview',
  template: `
    <div class="source-video-preview">
      <video [src]="videoUrl()" muted playsinline preload="metadata"></video>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-width: 0;
    }

    .source-video-preview {
      display: block;
      width: 100%;
      margin: 0;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: 0;
      overflow: hidden;
      background: transparent;
      pointer-events: none;
    }

    video {
      display: block;
      width: 100%;
      height: auto;
      margin: 0;
      padding: 0;
    }
  `,
})
export class SourceVideoPreviewComponent {
  readonly videoUrl = input.required<string>();
}
