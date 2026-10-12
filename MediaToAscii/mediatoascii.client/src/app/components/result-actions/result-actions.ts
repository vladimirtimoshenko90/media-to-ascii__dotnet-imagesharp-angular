import { Component, input } from '@angular/core';

@Component({
  selector: 'app-result-actions',
  template: `
    <div class="d-flex gap-2">
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        [disabled]="!hasText"
        (click)="copy()"
      >
        <i class="bi bi-clipboard me-1" aria-hidden="true"></i>
        Copy
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        [disabled]="!hasText"
        (click)="download()"
      >
        <i class="bi bi-download me-1" aria-hidden="true"></i>
        Download
      </button>
    </div>
  `,
})
export class ResultActionsComponent {
  readonly text = input<string>('');

  get hasText(): boolean {
    return this.text().length > 0;
  }

  async copy(): Promise<void> {
    const value = this.text();
    if (!value) {
      return;
    }
    await navigator.clipboard.writeText(value);
  }

  download(): void {
    const value = this.text();
    if (!value) {
      return;
    }

    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ascii.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
