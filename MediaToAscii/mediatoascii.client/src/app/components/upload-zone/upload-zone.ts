import { Component, output } from '@angular/core';

@Component({
  selector: 'app-upload-zone',
  template: `
    <div
      class="upload-zone border rounded p-4 text-center"
      [class.border-primary]="dragOver"
      [class.bg-light]="dragOver"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
    >
      <p class="mb-2 text-secondary">
        @if (fileName) {
          Selected: {{ fileName }}
        } @else {
          Drop an image or video here, or choose a file.
        }
      </p>
      <label class="btn btn-outline-secondary btn-sm mb-0">
        <i class="bi bi-upload me-1" aria-hidden="true"></i>
        Choose file
        <input
          type="file"
          class="d-none"
          accept="image/*,video/*"
          (change)="onFileInput($event)"
        />
      </label>
    </div>
  `,
  styles: `
    .upload-zone {
      border-style: dashed !important;
    }
  `,
})
export class UploadZoneComponent {
  readonly fileSelected = output<File>();

  fileName: string | null = null;
  dragOver = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    const file = event.dataTransfer?.files?.[0];
    this.applyFile(file);
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.applyFile(file);
    input.value = '';
  }

  private applyFile(file: File | undefined): void {
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return;
    }
    this.fileName = file.name;
    this.fileSelected.emit(file);
  }
}
