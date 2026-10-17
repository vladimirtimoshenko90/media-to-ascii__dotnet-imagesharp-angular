import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UploadZoneComponent } from '@components/upload-zone';
import { ASCII_WIDTH } from '@constants/ascii-width';
import {
  AsciiCharsetOption,
  ConfigurationApiService,
} from '@services/configuration-api.service';
import {
  AsciiFrame,
  AsciiVideo,
  ConvertApiService,
  ConvertOptions,
} from '@services/convert-api.service';
import { AsciiVideoPlayerComponent } from './results/ascii-video-player';
import { ImageAsciiResultComponent } from './results/image-ascii-result';
import { OptionControlsComponent } from './sidebar/option-controls';
import { ReplaceFileButtonComponent } from './sidebar/replace-file-button';
import { SourceImagePreviewComponent } from './sidebar/source-image-preview';
import { SourceVideoPreviewComponent } from './sidebar/source-video-preview';

@Component({
  selector: 'app-convert-page',
  imports: [
    UploadZoneComponent,
    OptionControlsComponent,
    SourceImagePreviewComponent,
    SourceVideoPreviewComponent,
    ReplaceFileButtonComponent,
    ImageAsciiResultComponent,
    AsciiVideoPlayerComponent,
  ],
  template: `
    @if (!selectedFile) {
      <div class="welcome">
        <div class="welcome-card region">
          <app-upload-zone (fileSelected)="onFileSelected($event)" />
        </div>
      </div>
    } @else {
      <div class="tool-layout">
        <div class="sidebar-column">
          @if (imageUrl || videoUrl) {
            <app-replace-file-button (fileSelected)="onFileSelected($event)" />
          }
          @if (imageUrl) {
            <app-source-image-preview [imageUrl]="imageUrl" />
          } @else if (videoUrl) {
            <app-source-video-preview
              [videoUrl]="videoUrl"
              [currentTime]="videoTimestamp"
            />
          }
          <div class="region">
            <app-option-controls
              [charsets]="charsets"
              [options]="options"
              (optionsChange)="onOptionsChange($event)"
            />
          </div>
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
          } @else if (imageResult) {
            <app-image-ascii-result [frame]="imageResult" />
          } @else if (videoResult) {
            <app-ascii-video-player
              [video]="videoResult"
              (frameChange)="onAsciiFrameChange($event)"
            />
          }
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .welcome {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 2rem);
      box-sizing: border-box;
      padding: 1rem;
    }

    .welcome-card {
      width: min(28rem, 100%);
    }

    .sidebar-column {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      min-width: 0;
    }

    .result-status {
      min-height: 360px;
      min-width: 24rem;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      padding: 0.75rem;
    }

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
    width: ASCII_WIDTH.DEFAULT,
    invert: false,
    charset: '',
  };
  loading = false;
  error: string | null = null;
  imageUrl: string | null = null;
  videoUrl: string | null = null;
  videoTimestamp = 0;
  imageResult: AsciiFrame | null = null;
  videoResult: AsciiVideo | null = null;

  ngOnInit(): void {
    this.configurationApi.getConvertOptions().subscribe((data) => {
      this.charsets = data;
      this.options = { ...this.options, charset: data[0].id };
      if (this.selectedFile) {
        this.convert();
      }
    });
  }

  ngOnDestroy(): void {
    this.cancelConvert$.next();
    this.cancelConvert$.complete();
    this.revokeMediaUrls();
  }

  onFileSelected(file: File): void {
    this.selectedFile = file;
    this.error = null;
    this.imageResult = null;
    this.videoResult = null;
    this.videoTimestamp = 0;
    this.revokeMediaUrls();
    if (file.type.startsWith('image/')) {
      this.imageUrl = URL.createObjectURL(file);
    } else if (file.type.startsWith('video/')) {
      this.videoUrl = URL.createObjectURL(file);
    }
    this.convert();
  }

  onAsciiFrameChange(index: number): void {
    this.videoTimestamp = index * (this.videoResult?.frameDelayMs ?? 0);
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

    if (isImage) {
      this.convertApi
        .convertImage(file, this.options)
        .pipe(takeUntil(this.cancelConvert$))
        .subscribe({
          next: (frame) => {
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
    this.imageResult = null;
    this.videoResult = null;
    this.error = this.errorMessage(err);
  }

  private revokeMediaUrls(): void {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
      this.imageUrl = null;
    }
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl);
      this.videoUrl = null;
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
