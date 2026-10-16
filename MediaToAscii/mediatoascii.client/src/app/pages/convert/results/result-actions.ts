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
}
