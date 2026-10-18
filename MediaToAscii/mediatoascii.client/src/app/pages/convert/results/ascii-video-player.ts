import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsciiFrame, AsciiVideo } from '@services/convert-api.service';
import { AsciiFrameViewerComponent } from './ascii-frame-viewer';

@Component({
  selector: 'app-ascii-video-player',
  imports: [FormsModule, AsciiFrameViewerComponent],
  template: `
    <div class="ascii-video-player">
      <app-ascii-frame-viewer [frame]="currentFrame()" />

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
            [class.transport-btn--active]="doubleSpeed()"
            (click)="toggleDoubleSpeed()"
          >
            <i class="bi bi-fast-forward-fill"></i>
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
    }

    .ascii-video-player {
      display: flex;
      flex-direction: column;
      width: max-content;
      max-width: none;
    }

    /* Join frame + transport into one stack (no gap, no double border). */
    .ascii-video-player > app-ascii-frame-viewer {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;
    }

    .transport {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
      padding: 0.75rem 1rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 0 0 0.25rem 0.25rem;

      .transport-btn {
        display: inline-flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        padding: 0;
        line-height: 1;

        .bi {
          font-size: 1rem;
        }

        &--active {
          border-color: var(--fg);
          background: color-mix(in srgb, var(--fg) 8%, var(--surface));
        }
      }

      .transport-seek {
        flex: 1 1 auto;
        min-width: 0;
        margin: 0;
      }
    }
  `,
})
export class AsciiVideoPlayerComponent {
  readonly video = input.required<AsciiVideo>();
  readonly frameChange = output<number>();
  readonly playing = signal(false);
  readonly doubleSpeed = signal(false);

  readonly frameCount = computed(() => this.video().frames.length);
  readonly currentFrameIndex = signal(0);
  readonly currentFrame = computed<AsciiFrame>(
    () => this.video().frames[this.currentFrameIndex()] ?? { ascii: '' },
  );

  constructor() {
    effect(() => {
      this.video();
      this.currentFrameIndex.set(0);
      this.doubleSpeed.set(false);
      this.playing.set(this.frameCount() > 0);
    });

    effect(() => this.frameChange.emit(this.currentFrameIndex()));

    effect((onCleanup) => {
      if (this.playing()) {
        const delayMs =
          this.video().frameDelayMs / (this.doubleSpeed() ? 2 : 1);
        const intervalId = setInterval(() => {
          if (this.currentFrameIndex() >= this.frameCount() - 1) {
            this.playing.set(false);
          } else {
            this.currentFrameIndex.update((i) => i + 1);
          }
        }, delayMs);
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

  toggleDoubleSpeed(): void {
    this.doubleSpeed.update((on) => !on);
  }
}
