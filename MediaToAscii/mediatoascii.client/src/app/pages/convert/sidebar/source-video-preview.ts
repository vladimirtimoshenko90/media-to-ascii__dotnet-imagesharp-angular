import { Component, effect, ElementRef, input, viewChild } from '@angular/core';

@Component({
  selector: 'app-source-video-preview',
  template: `
    <div class="source-video-preview">
      <video
        #video
        [src]="videoUrl()"
        muted
        playsinline
        preload="metadata"
        (loadeddata)="sync()"
      ></video>
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
  /** Offset in ms from ASCII player (`frameIndex * frameDelayMs`). */
  readonly currentTime = input(0);

  private readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('video');

  constructor() {
    effect(() => {
      this.currentTime();
      this.videoUrl();
      this.sync();
    });
  }

  sync(): void {
    const el = this.videoRef()?.nativeElement;
    if (!el) {
      return;
    }
    el.pause();
    el.currentTime = this.currentTime() / 1000;
  }
}
