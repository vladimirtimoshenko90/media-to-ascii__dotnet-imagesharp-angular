import { Component, computed, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsciiVideo } from '../services/convert-api.service';

@Component({
  selector: 'app-ascii-video-player',
  imports: [FormsModule],
  template: `
    <div class="ascii-video-player">
      <div class="frame-pane">
        <pre>{{ currentFrame() }}</pre>
      </div>

      @if (frameCount()) {
        <div class="transport">
          <div class="transport-buttons">
            <button
              type="button"
              class="btn btn-sm btn-secondary-action"
              (click)="togglePlay()"
            >
              <i
                class="bi"
                [class.bi-pause-fill]="playing()"
                [class.bi-play-fill]="!playing()"
              ></i>
              {{ playing() ? 'Pause' : 'Play' }}
            </button>
            <button
              type="button"
              class="btn btn-sm btn-secondary-action"
              (click)="currentFrameIndex.set(0)"
            >
              <i class="bi bi-skip-start-fill"></i>
              Restart
            </button>
          </div>

          <input
            type="range"
            class="form-range"
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
    .ascii-video-player {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      min-height: 280px;
      max-height: 520px;
    }

    .frame-pane {
      flex: 1;
      min-height: 0;
      overflow: auto;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      padding: 0.75rem;

      pre {
        margin: 0;
        font-family: var(--font-mono);
        font-size: 11px;
        line-height: 1;
        white-space: pre;
        color: var(--fg);
      }
    }

    .transport {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .transport-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  `,
})
export class AsciiVideoPlayerComponent {
  readonly video = input.required<AsciiVideo>();
  readonly playing = signal(false);

  readonly frameCount = computed(() => this.video().frames.length);
  readonly currentFrameIndex = signal(0);
  readonly currentFrame = computed(
    () => this.video().frames[this.currentFrameIndex()]?.ascii ?? '',
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
}
