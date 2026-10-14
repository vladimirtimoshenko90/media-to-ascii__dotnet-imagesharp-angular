import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AsciiVideoPlayerComponent } from '../components/ascii-video-player';
import { ImageCompareComponent } from '../components/image-compare';
import { OptionControlsComponent } from '../components/option-controls';
import { ResultActionsComponent } from '../components/result-actions';
import { UploadZoneComponent } from '../components/upload-zone';
import {
  AsciiCharsetOption,
  ConfigurationApiService,
} from '../services/configuration-api.service';
import {
  AsciiFrame,
  AsciiVideo,
  ConvertApiService,
  ConvertOptions,
} from '../services/convert-api.service';

@Component({
  selector: 'app-convert-page',
  imports: [
    UploadZoneComponent,
    OptionControlsComponent,
    ImageCompareComponent,
    AsciiVideoPlayerComponent,
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
        @if (loading) {
          <div class="result-status">
            <p class="loading-msg">
              <span class="spinner-border spinner-border-sm"></span>
              Converting…
            </p>
          </div>
        } @else if (error) {
          <div class="result-status">
            <p class="error-msg">{{ error }}</p>
          </div>
        } @else if (imageUrl && imageResult) {
          <app-image-compare [imageUrl]="imageUrl" [frame]="imageResult" />
        } @else if (videoResult) {
          <app-ascii-video-player [video]="videoResult" />
        } @else {
          <div class="result-status">
            <p class="hint">ASCII output will appear here.</p>
          </div>
        }
        <app-result-actions [text]="exportText" />
      </div>
    </div>
  `,
  styles: `
    .result-status {
      min-height: 280px;
      max-height: 520px;
      overflow: auto;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      padding: 0.75rem;
    }

    .hint,
    .error-msg,
    .loading-msg {
      color: var(--muted);
      font-size: 0.9rem;
      margin: 0;
      font-family: var(--font-body);
      line-height: 1.45;
    }

    .error-msg {
      color: var(--error);
    }

    .loading-msg {
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
  loading = false;
  error: string | null = null;
  imageUrl: string | null = null;
  imageResult: AsciiFrame | null = null;
  videoResult: AsciiVideo | null = null;

  get exportText(): string {
    if (this.imageResult) {
      return this.imageResult.ascii;
    }
    if (this.videoResult) {
      return this.videoResult.frames
        .map((frame) => frame.ascii)
        .join('\n\n----\n\n');
    }
    return '';
  }

  ngOnInit(): void {
    this.configurationApi.getConvertOptions().subscribe((data) => {
      this.charsets = data;
      this.options = { ...this.options, charset: data[0].id };
    });
  }

  ngOnDestroy(): void {
    this.cancelConvert$.next();
    this.cancelConvert$.complete();
    this.revokeImageUrl();
  }

  onFileSelected(file: File): void {
    this.selectedFile = file;
    this.error = null;
    this.clearResult();
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
    this.clearResult();

    if (isImage) {
      this.convertApi
        .convertImage(file, this.options)
        .pipe(takeUntil(this.cancelConvert$))
        .subscribe({
          next: (frame) => {
            this.imageUrl = URL.createObjectURL(file);
            this.imageResult = frame;
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
          this.videoResult = video;
          this.loading = false;
        },
        error: (err: unknown) => this.onConvertError(err),
      });
  }

  private onConvertError(err: unknown): void {
    this.loading = false;
    this.clearResult();
    this.error = this.errorMessage(err);
  }

  private clearResult(): void {
    this.revokeImageUrl();
    this.imageResult = null;
    this.videoResult = null;
  }

  private revokeImageUrl(): void {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
      this.imageUrl = null;
    }
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
