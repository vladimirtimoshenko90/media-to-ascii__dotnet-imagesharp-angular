import { Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { VideoPlayback } from '@constants/video-playback';

@Component({
  selector: 'app-source-video-preview',
  template: `
    <div class="source-video-preview">
      <video
        #video
        [src]="videoUrl()"
        [muted]="true"
        playsinline
        preload="auto"
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
  readonly playback = input.required<VideoPlayback>();

  private readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('video');

  constructor() {
    effect(() => {
      this.videoUrl();
      this.playback();
      this.sync();
    });
  }

  /**
   * Follow ASCII transport via play/pause/rate — not by setting currentTime every frame
   * (that seeks the MP4 constantly and lags). Snap time only when paused, starting play,
   * or when clocks drift (scrub/restart).
   */
  sync(): void {
    const el = this.videoRef()?.nativeElement;
    if (!el || el.readyState < HTMLMediaElement.HAVE_METADATA) {
      return;
    }

    const { timeMs, playing, playbackRate } = this.playback();
    const targetSec = timeMs / 1000;
    el.muted = true;

    if (el.playbackRate !== playbackRate) {
      el.playbackRate = playbackRate;
    }

    if (!playing) {
      if (!el.paused) {
        el.pause();
      }
      if (Math.abs(el.currentTime - targetSec) > 0.05) {
        el.currentTime = targetSec;
      }
      return;
    }

    if (el.paused) {
      el.currentTime = targetSec;
      void el.play().catch(() => undefined);
      return;
    }

    if (Math.abs(el.currentTime - targetSec) > 0.2) {
      el.currentTime = targetSec;
    }
  }
}
