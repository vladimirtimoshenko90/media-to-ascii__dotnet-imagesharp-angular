import { Component, computed, effect, input, signal } from '@angular/core';
import { AsciiVideo } from '../services/convert-api.service';

@Component({
  selector: 'app-ascii-video-player',
  template: `
    <div class="ascii-video-player">
      <div class="frame-pane">
        <pre>{{ currentFrame() }}</pre>
      </div>
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
  `,
})
export class AsciiVideoPlayerComponent {
  readonly video = input.required<AsciiVideo>();

  /** Owned by the player; transport (6.3) will advance this. */
  readonly currentIndex = signal(0);

  readonly currentFrame = computed(() => {
    const frames = this.video().frames;
    const i = this.currentIndex();
    if (i < 0 || i >= frames.length) {
      return '';
    }
    return frames[i]?.ascii ?? '';
  });

  constructor() {
    effect(() => {
      this.video();
      this.currentIndex.set(0);
    });
  }
}
