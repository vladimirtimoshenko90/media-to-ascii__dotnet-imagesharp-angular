import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsciiPreviewComponent } from './components/ascii-preview';
import { OptionControlsComponent } from './components/option-controls';
import { ResultActionsComponent } from './components/result-actions';
import { UploadZoneComponent } from './components/upload-zone';
import {
  ConvertApiService,
  ConvertOptions,
  DEFAULT_CONVERT_OPTIONS,
} from './services/convert-api.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    UploadZoneComponent,
    OptionControlsComponent,
    AsciiPreviewComponent,
    ResultActionsComponent,
  ],
  template: `
    <main class="container py-4">
      <header class="mb-4">
        <h1>{{ title }}</h1>
        <p class="text-secondary mb-0">Convert images and video to ASCII art.</p>
      </header>

      <section class="mb-4">
        <app-upload-zone (fileSelected)="onFileSelected($event)" />
      </section>

      <section class="mb-4">
        <app-option-controls (optionsChange)="onOptionsChange($event)" />
      </section>

      <section class="mb-4">
        <button
          type="button"
          class="btn btn-primary"
          [disabled]="!canConvert"
          (click)="convert()"
        >
          Convert
        </button>
      </section>

      <section class="mb-4">
        <app-ascii-preview
          [text]="asciiText"
          [loading]="loading"
          [error]="error"
        />
      </section>

      <section class="mb-4">
        <app-result-actions [text]="asciiText ?? ''" />
      </section>

      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  private readonly convertApi = inject(ConvertApiService);

  title = 'media-to-ascii';
  selectedFile: File | null = null;
  options: ConvertOptions = { ...DEFAULT_CONVERT_OPTIONS };
  asciiText: string | null = null;
  loading = false;
  error: string | null = null;

  get canConvert(): boolean {
    return (
      !!this.selectedFile &&
      this.selectedFile.type.startsWith('image/') &&
      !this.loading
    );
  }

  onFileSelected(file: File): void {
    this.selectedFile = file;
    this.asciiText = null;
    this.error = null;
  }

  onOptionsChange(options: ConvertOptions): void {
    this.options = options;
  }

  convert(): void {
    const file = this.selectedFile;
    if (!file || !file.type.startsWith('image/') || this.loading) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.asciiText = null;

    this.convertApi.convertImage(file, this.options).subscribe({
      next: (text) => {
        this.asciiText = text;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.loading = false;
        this.asciiText = null;
        this.error = this.errorMessage(err);
      },
    });
  }

  private errorMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (typeof err.error === 'string' && err.error.trim()) {
        return err.error;
      }
      return err.message || 'Conversion failed.';
    }
    return 'Conversion failed.';
  }
}
