import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ascii-preview',
  template: `
    <div class="ascii-preview border rounded p-3 bg-light" aria-live="polite">
      @if (loading()) {
        <p class="mb-0 text-secondary">
          <span
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          Converting…
        </p>
      } @else if (error()) {
        <p class="mb-0 text-danger">{{ error() }}</p>
      } @else if (text()) {
        <pre class="mb-0">{{ text() }}</pre>
      } @else {
        <p class="mb-0 text-secondary">ASCII output will appear here.</p>
      }
    </div>
  `,
  styles: `
    .ascii-preview {
      min-height: 12rem;
      overflow: auto;
    }

    .ascii-preview pre {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        'Liberation Mono', 'Courier New', monospace;
      font-size: 0.7rem;
      line-height: 1;
      white-space: pre;
    }
  `,
})
export class AsciiPreviewComponent {
  readonly text = input<string | null>(null);
  readonly loading = input(false);
  readonly error = input<string | null>(null);
}
