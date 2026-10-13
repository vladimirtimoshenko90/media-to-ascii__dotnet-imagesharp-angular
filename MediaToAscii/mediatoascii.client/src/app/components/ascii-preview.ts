import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ascii-preview',
  template: `
    <div class="ascii-preview">
      @if (loading()) {
        <p class="loading-msg">
          <span class="spinner-border spinner-border-sm"></span>
          Converting…
        </p>
      } @else if (error()) {
        <p class="error-msg">{{ error() }}</p>
      } @else if (text()) {
        <pre>{{ text() }}</pre>
      } @else {
        <p class="hint">ASCII output will appear here.</p>
      }
    </div>
  `,
  styles: `
    .ascii-preview {
      min-height: 280px;
      max-height: 520px;
      overflow: auto;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      padding: 0.75rem;
    }

    .ascii-preview pre {
      margin: 0;
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1;
      white-space: pre;
      color: var(--fg);
    }

    .ascii-preview .hint,
    .ascii-preview .error-msg,
    .ascii-preview .loading-msg {
      color: var(--muted);
      font-size: 0.9rem;
      margin: 0;
      font-family: var(--font-body);
      line-height: 1.45;
    }

    .ascii-preview .error-msg {
      color: var(--error);
    }

    .ascii-preview .loading-msg {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .spinner-border-sm {
      width: 0.9rem;
      height: 0.9rem;
      border-width: 0.12em;
      color: var(--muted);
    }
  `,
})
export class AsciiPreviewComponent {
  readonly text = input<string | null>(null);
  readonly loading = input(false);
  readonly error = input<string | null>(null);
}
