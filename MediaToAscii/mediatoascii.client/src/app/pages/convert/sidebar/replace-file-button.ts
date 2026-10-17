import { Component, output } from '@angular/core';

@Component({
  selector: 'app-replace-file-button',
  template: `
    <button
      type="button"
      class="btn btn-sm btn-secondary-action replace-file-btn"
      (click)="fileInput.click()"
    >
      <i class="bi bi-folder2-open"></i>
    </button>
    <input
      #fileInput
      type="file"
      class="d-none"
      accept="image/*,video/*"
      (change)="onFileInput($event)"
    />
  `,
  styles: `
    :host {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      z-index: 1;
    }

    .replace-file-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      padding: 0;
      line-height: 1;
    }

    .replace-file-btn .bi {
      font-size: 1.15rem;
    }
  `,
})
export class ReplaceFileButtonComponent {
  readonly fileSelected = output<File>();

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (
      !file ||
      (!file.type.startsWith('image/') && !file.type.startsWith('video/'))
    ) {
      return;
    }
    this.fileSelected.emit(file);
  }
}
