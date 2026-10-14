import { Component, input } from '@angular/core';

@Component({
  selector: 'app-result-actions',
  template: `
    <div class="result-actions">
      <button
        type="button"
        class="btn btn-sm btn-secondary-action"
        [disabled]="!hasText"
        (click)="copy()"
      >
        <i class="bi bi-clipboard"></i>
        Copy
      </button>
      <button
        type="button"
        class="btn btn-sm btn-secondary-action"
        [disabled]="!hasText"
        (click)="download()"
      >
        <i class="bi bi-download"></i>
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
