import {
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

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
        <div class="fit-host" #host>
          <pre #content [style.transform]="'scale(' + scale() + ')'">{{
            text()
          }}</pre>
        </div>
      } @else {
        <p class="hint">ASCII output will appear here.</p>
      }
    </div>
  `,
  styles: `
    .ascii-preview {
      box-sizing: border-box;
      height: 520px;
      overflow: hidden;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      padding: 0.75rem;
    }

    .fit-host {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .ascii-preview pre {
      position: absolute;
      top: 0;
      left: 0;
      margin: 0;
      width: max-content;
      transform-origin: top left;
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
export class AsciiPreviewComponent implements OnDestroy {
  readonly text = input<string | null>(null);
  readonly loading = input(false);
  readonly error = input<string | null>(null);

  private readonly host = viewChild<ElementRef<HTMLElement>>('host');
  private readonly content = viewChild<ElementRef<HTMLPreElement>>('content');
  private readonly injector = inject(Injector);

  readonly scale = signal(1);

  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    effect(() => {
      const hasText = !!this.text();
      const loading = this.loading();
      const error = this.error();

      this.teardownObserver();

      if (!hasText || loading || error) {
        this.scale.set(1);
        return;
      }

      afterNextRender(() => this.setupFit(), { injector: this.injector });
    });
  }

  ngOnDestroy(): void {
    this.teardownObserver();
  }

  private setupFit(): void {
    this.teardownObserver();

    const hostEl = this.host()?.nativeElement;
    const contentEl = this.content()?.nativeElement;
    if (!hostEl || !contentEl) {
      return;
    }

    const measure = () => {
      const availW = hostEl.clientWidth;
      const availH = hostEl.clientHeight;
      const contentW = contentEl.offsetWidth;
      const contentH = contentEl.offsetHeight;

      if (contentW <= 0 || contentH <= 0 || availW <= 0 || availH <= 0) {
        this.scale.set(1);
        return;
      }

      this.scale.set(Math.min(1, availW / contentW, availH / contentH));
    };

    this.resizeObserver = new ResizeObserver(measure);
    this.resizeObserver.observe(hostEl);
    measure();
  }

  private teardownObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }
}
