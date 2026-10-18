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
import { AsciiFrameViewerComponent } from './results/ascii-frame-viewer';
import { AsciiVideoPlayerComponent } from './results/ascii-video-player';
import {
  INITIAL_VIDEO_PLAYBACK,
  VideoPlayback,
} from '@constants/video-playback';
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
    AsciiFrameViewerComponent,
    AsciiVideoPlayerComponent,
  ],
  template: `
    @if (!file) {
      <div class="welcome">
        <div class="welcome-card region">
          <app-upload-zone (fileSelected)="onFileSelected($event)" />
        </div>
      </div>
    } @else {
      <div class="tool-layout">
        <div class="sidebar-column">
          @if (fileUrl) {
            <app-replace-file-button (fileSelected)="onFileSelected($event)" />
            @if (fileType === 'image') {
              <app-source-image-preview [imageUrl]="fileUrl" />
            } @else if (fileType === 'video') {
              <app-source-video-preview [videoUrl]="fileUrl" [playback]="videoPlayback" />
            }
          }
          <div class="region">
            <app-option-controls
              [charsets]="charsets"
              [options]="options"
              (optionsChange)="onOptionsChange($event)"
            />
          </div>
        </div>

        @if (loading) {
          <div class="region">
            <div class="result-status">
              <p class="loading-msg">
                <span class="spinner-border spinner-border-sm"></span>
                Converting…
              </p>
            </div>
          </div>
        } @else if (error) {
          <div class="region">
            <div class="result-status">
              <p class="error-msg">{{ error }}</p>
            </div>
          </div>
        } @else if (imageResult) {
          <app-ascii-frame-viewer [frame]="imageResult" />
        } @else if (videoResult) {
          <app-ascii-video-player
            [video]="videoResult"
            (playback)="videoPlayback = $event"
          />
        }
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
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 360px;
      min-width: 24rem;
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

  file: File | null = null;
  fileType: 'image' | 'video' | 'unknown' = 'unknown';
  fileUrl: string | null = null;

  charsets: AsciiCharsetOption[] = [];
  options: ConvertOptions = {
    width: ASCII_WIDTH.DEFAULT,
    invert: false,
    charset: '',
  };
  loading = false;
  error: string | null = null;
  videoPlayback: VideoPlayback = { ...INITIAL_VIDEO_PLAYBACK };
  imageResult: AsciiFrame | null = null;
  videoResult: AsciiVideo | null = null;

  ngOnInit(): void {
    this.configurationApi.getConvertOptions().subscribe((data) => {
      this.charsets = data;
      this.options = { ...this.options, charset: data[0].id };
      if (this.file) {
        this.convert();
      }
    });
  }

  ngOnDestroy(): void {
    this.cancelConvert$.next();
    this.cancelConvert$.complete();
    this.revokeFileUrl();
  }

  onFileSelected(file: File): void {
    this.file = file;
    this.fileType = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
        ? 'video'
        : 'unknown';
    this.error = null;
    this.imageResult = null;
    this.videoResult = null;
    this.videoPlayback = { ...INITIAL_VIDEO_PLAYBACK };
    this.revokeFileUrl();
    if (this.fileType !== 'unknown') {
      this.fileUrl = URL.createObjectURL(file);
    }
    this.convert();
  }

  onOptionsChange(options: ConvertOptions): void {
    this.options = options;
    this.convert();
  }

  private convert(): void {
    if (!this.file || !this.options.charset || this.fileType === 'unknown') {
      return;
    }

    this.cancelConvert$.next();
    this.loading = true;
    this.error = null;

    if (this.fileType === 'image') {
      this.convertApi
        .convertImage(this.file, this.options)
        .pipe(takeUntil(this.cancelConvert$))
        .subscribe({
          next: (frame) => {
            this.imageResult = frame;
            this.loading = false;
          },
          error: (message: string) => this.onConvertError(message),
        });
      return;
    }

    this.convertApi
      .convertVideo(this.file, this.options)
      .pipe(takeUntil(this.cancelConvert$))
      .subscribe({
        next: (video) => {
          this.videoResult = video;
          this.loading = false;
        },
        error: (message: string) => this.onConvertError(message),
      });
  }

  private onConvertError(message: string): void {
    this.loading = false;
    this.imageResult = null;
    this.videoResult = null;
    this.error = message;
  }

  private revokeFileUrl(): void {
    if (this.fileUrl) {
      URL.revokeObjectURL(this.fileUrl);
      this.fileUrl = null;
    }
  }
}
