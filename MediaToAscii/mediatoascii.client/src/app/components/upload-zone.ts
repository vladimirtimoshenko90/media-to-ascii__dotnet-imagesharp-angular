import { Component, ElementRef, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-upload-zone',
  template: `
    <div
      class="dropzone"
      [class.is-dragover]="dragOver"
      (click)="openPicker()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
    >
      <i class="bi bi-upload d-block mb-2"></i>
      <span>Drop an image or video here, or choose a file.</span>
    </div>
    <input
      #fileInput
      type="file"
      class="d-none"
      accept="image/*,video/*"
      (change)="onFileInput($event)"
      (click)="$event.stopPropagation()"
    />
  `,
  styles: `
    .dropzone {
      border: 1px dashed var(--border);
      background: color-mix(in srgb, var(--bg) 70%, var(--surface));
      border-radius: 0.25rem;
      padding: 2.5rem 1.5rem;
      text-align: center;
      color: var(--muted);
      cursor: pointer;
      font-size: 1.05rem;
    }

    .dropzone .bi {
      font-size: 1.75rem;
    }

    .dropzone:hover {
      border-color: var(--focus);
    }

    .dropzone.is-dragover {
      border-color: var(--focus);
      background: color-mix(in srgb, var(--focus) 8%, var(--surface));
      color: var(--fg);
    }
  `,
})
export class UploadZoneComponent {
  readonly fileSelected = output<File>();
  private readonly fileInput =
    viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  dragOver = false;

  openPicker(): void {
    this.fileInput().nativeElement.click();
  }

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
    this.fileSelected.emit(file);
  }
}
