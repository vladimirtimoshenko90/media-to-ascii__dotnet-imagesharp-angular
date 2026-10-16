import { Component, computed, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsciiFrame, AsciiVideo } from '@services/convert-api.service';
import { AsciiFrameViewerComponent } from './ascii-frame-viewer';

@Component({
  selector: 'app-ascii-video-player',
  imports: [FormsModule, AsciiFrameViewerComponent],
  template: `
    <div class="ascii-video-player">
      <div class="frame-pane">
        <app-ascii-frame-viewer [frame]="currentFrame()" />
      </div>

      @if (frameCount()) {
        <div class="transport">
          <button
            type="button"
            class="btn btn-sm btn-secondary-action transport-btn"
            (click)="togglePlay()"
          >
            <i
              class="bi"
              [class.bi-pause-fill]="playing()"
              [class.bi-play-fill]="!playing()"
            ></i>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-secondary-action transport-btn"
            (click)="restart()"
          >
            <i class="bi bi-arrow-clockwise"></i>
          </button>
          <input
            type="range"
            class="form-range transport-seek"
            min="0"
            [max]="frameCount() - 1"
            [ngModel]="currentFrameIndex()"
            (ngModelChange)="currentFrameIndex.set(+$event)"
          />
        </div>
      }
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

    .ascii-video-player {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: max-content;
      height: auto;
      max-height: none;
    }

    .frame-pane {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      padding: 0.75rem;
      overflow: visible;
      height: auto;
      max-height: none;
    }

    .transport {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      min-width: 16rem;
      max-width: 100%;
    }

    .transport-btn {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      padding: 0;
      line-height: 1;
    }

    .transport-btn .bi {
      font-size: 1rem;
    }

    .transport-seek {
      flex: 1 1 auto;
      min-width: 0;
      margin: 0;
    }
  `,
})
export class AsciiVideoPlayerComponent {
  readonly video = input.required<AsciiVideo>();
  readonly playing = signal(false);

  readonly frameCount = computed(() => this.video().frames.length);
  readonly currentFrameIndex = signal(0);
  readonly currentFrame = computed<AsciiFrame>(
    () => this.video().frames[this.currentFrameIndex()] ?? { ascii: '' },
  );

  constructor() {
    effect(() => {
      this.video();
      this.currentFrameIndex.set(0);
      this.playing.set(this.frameCount() > 0);
    });

    effect((onCleanup) => {
      if (this.playing()) {
        const intervalId = setInterval(() => {
          if (this.currentFrameIndex() >= this.frameCount() - 1) {
            this.playing.set(false);
          } else {
            this.currentFrameIndex.update((i) => i + 1);
          }
        }, this.video().frameDelayMs);
        onCleanup(() => clearInterval(intervalId));
      }
    });
  }

  togglePlay(): void {
    if (this.playing()) {
      this.playing.set(false);
    } else {
      if (this.currentFrameIndex() >= this.frameCount() - 1) {
        this.currentFrameIndex.set(0);
      }
      this.playing.set(true);
    }
  }

  restart(): void {
    this.currentFrameIndex.set(0);
    this.playing.set(true);
  }
}
