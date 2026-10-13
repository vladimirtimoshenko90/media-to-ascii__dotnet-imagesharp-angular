import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AsciiPreviewComponent } from '../components/ascii-preview';
import { OptionControlsComponent } from '../components/option-controls';
import { ResultActionsComponent } from '../components/result-actions';
import { UploadZoneComponent } from '../components/upload-zone';
import {
  ConvertApiService,
  ConvertOptions,
} from '../services/convert-api.service';

@Component({
  selector: 'app-convert-page',
  imports: [
    UploadZoneComponent,
    OptionControlsComponent,
    AsciiPreviewComponent,
    ResultActionsComponent,
  ],
  template: `
    <div class="tool-layout">
      <div class="region region-stack">
        <app-upload-zone (fileSelected)="onFileSelected($event)" />
        <app-option-controls
          [options]="options"
          (optionsChange)="options = $event"
        />
        <button
          type="button"
          class="btn btn-convert w-100"
          [disabled]="!canConvert"
          (click)="convert()"
        >
          Convert
        </button>
      </div>

      <div class="region">
        <app-ascii-preview
          [text]="asciiText"
          [loading]="loading"
          [error]="error"
        />
        <app-result-actions [text]="asciiText ?? ''" />
      </div>
    </div>
  `,
})
export class ConvertPage {
  private readonly convertApi = inject(ConvertApiService);

  selectedFile: File | null = null;
  options: ConvertOptions = {
    width: 100,
    invert: false,
    charset: 'classic',
  };
  asciiText: string | null = null;
  loading = false;
  error: string | null = null;

  get canConvert(): boolean {
    const file = this.selectedFile;
    if (!file || this.loading) {
      return false;
    }
    return (
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
  }

  onFileSelected(file: File): void {
    this.selectedFile = file;
    this.asciiText = null;
    this.error = null;
  }

  convert(): void {
    const file = this.selectedFile;
    if (!file || this.loading) {
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.asciiText = null;

    if (isImage) {
      this.convertApi.convertImage(file, this.options).subscribe({
        next: (frame) => {
          this.asciiText = frame.ascii;
          this.loading = false;
        },
        error: (err: unknown) => this.onConvertError(err),
      });
    } else if (isVideo) {
      this.convertApi.convertVideo(file, this.options).subscribe({
        next: (video) => {
          this.asciiText = video.frames[0]?.ascii ?? null;
          this.loading = false;
        },
        error: (err: unknown) => this.onConvertError(err),
      });
    }
  }

  private onConvertError(err: unknown): void {
    this.loading = false;
    this.asciiText = null;
    this.error = this.errorMessage(err);
  }

  private errorMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (typeof err.error === 'string' && err.error.trim()) {
        return err.error;
      }
      return 'Conversion failed. Check the file and try again.';
    }
    return 'Conversion failed. Check the file and try again.';
  }
}
