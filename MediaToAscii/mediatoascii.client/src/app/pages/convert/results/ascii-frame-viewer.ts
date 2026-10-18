import { Component, computed, input } from '@angular/core';
import { AsciiFrame } from '@services/convert-api.service';

@Component({
  selector: 'app-ascii-frame-viewer',
  template: `
    <button
      type="button"
      class="btn btn-sm btn-secondary-action copy-btn"
      title="Copy"
      [disabled]="!canCopy()"
      (click)="copy()"
    >
      <i class="bi bi-copy"></i>
    </button>
    <div class="ascii-frame-viewer h-scroll">
      <pre class="ascii-frame-viewer__pre">{{ frame().ascii }}</pre>
    </div>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      box-sizing: border-box;
      width: max-content;
      max-width: 100%;
      min-width: 0;
      padding: 1rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      overflow: hidden;
    }

    .copy-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      padding: 0;
      line-height: 1;
    }

    .copy-btn .bi {
      font-size: 1rem;
    }

    .ascii-frame-viewer {
      overflow-x: auto;
      overflow-y: hidden;
      max-width: 100%;
    }

    .ascii-frame-viewer__pre {
      display: block;
      margin: 0;
      width: max-content;
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1;
      white-space: pre;
      color: var(--fg);
      overflow: visible;
    }
  `,
})
export class AsciiFrameViewerComponent {
  readonly frame = input.required<AsciiFrame>();

  readonly canCopy = computed(() => this.frame().ascii.length > 0);

  async copy(): Promise<void> {
    const value = this.frame().ascii;
    if (!value) {
      return;
    }
    await navigator.clipboard.writeText(value);
  }
}
