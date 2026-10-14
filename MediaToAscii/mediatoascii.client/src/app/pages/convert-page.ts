import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AsciiPreviewComponent } from '../components/ascii-preview';
import { OptionControlsComponent } from '../components/option-controls';
import { ResultActionsComponent } from '../components/result-actions';
import { UploadZoneComponent } from '../components/upload-zone';
import {
  AsciiCharsetOption,
  ConfigurationApiService,
} from '../services/configuration-api.service';
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
          [charsets]="charsets"
          [options]="options"
          (optionsChange)="onOptionsChange($event)"
        />
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
export class ConvertPage implements OnInit, OnDestroy {
  private readonly convertApi = inject(ConvertApiService);
  private readonly configurationApi = inject(ConfigurationApiService);
  private readonly cancelConvert$ = new Subject<void>();

  selectedFile: File | null = null;
  charsets: AsciiCharsetOption[] = [];
  options: ConvertOptions = {
    width: 100,
    invert: false,
    charset: '',
  };
  asciiText: string | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.configurationApi.getConvertOptions().subscribe((data) => {
      this.charsets = data;
      this.options = { ...this.options, charset: data[0].id };
    });
  }

  ngOnDestroy(): void {
    this.cancelConvert$.next();
    this.cancelConvert$.complete();
  }

  onFileSelected(file: File): void {
    this.selectedFile = file;
    this.asciiText = null;
    this.error = null;
    this.convert();
  }

  onOptionsChange(options: ConvertOptions): void {
    this.options = options;
    this.convert();
  }

  private convert(): void {
    const file = this.selectedFile;
    if (!file || !this.options.charset) {
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      return;
    }

    this.cancelConvert$.next();
    this.loading = true;
    this.error = null;
    this.asciiText = null;

    if (isImage) {
      this.convertApi
        .convertImage(file, this.options)
        .pipe(takeUntil(this.cancelConvert$))
        .subscribe({
          next: (frame) => {
            this.asciiText = frame.ascii;
            this.loading = false;
          },
          error: (err: unknown) => this.onConvertError(err),
        });
      return;
    }

    this.convertApi
      .convertVideo(file, this.options)
      .pipe(takeUntil(this.cancelConvert$))
      .subscribe({
        next: (video) => {
          this.asciiText = video.frames[0]?.ascii ?? null;
          this.loading = false;
        },
        error: (err: unknown) => this.onConvertError(err),
      });
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
