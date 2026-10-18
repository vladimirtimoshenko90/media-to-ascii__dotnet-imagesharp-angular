import { Component, computed, input } from '@angular/core';
import { AsciiFrame } from '@services/convert-api.service';

@Component({
  selector: 'app-ascii-frame-viewer',
  template: `
    <div class="ascii-frame-viewer">
      <button
        type="button"
        class="btn btn-sm btn-secondary-action copy-btn"
        title="Copy"
        [disabled]="!canCopy()"
        (click)="copy()"
      >
        <i class="bi bi-copy"></i>
      </button>
      <pre class="ascii-frame-viewer__pre">{{ frame().ascii }}</pre>
    </div>
  `,
  styles: `
    :host {
      display: block;
      box-sizing: border-box;
      width: max-content;
      max-width: none;
      padding: 1rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      overflow: visible;
    }

    .ascii-frame-viewer {
      position: relative;
      width: max-content;
      max-width: none;
    }

    /* Overlay — does not shift the ASCII layout */
    .copy-btn {
      position: absolute;
      top: 0;
      right: 0;
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

    /* Override Bootstrap reboot pre { overflow: auto } — never scroll here */
    .ascii-frame-viewer__pre {
      display: block;
      margin: 0;
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1;
      white-space: pre;
      color: var(--fg);
      overflow: visible;
      max-height: none;
      height: auto;
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
