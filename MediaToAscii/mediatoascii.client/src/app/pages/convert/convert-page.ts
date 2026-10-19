import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
    @if (!file()) {
      <div class="welcome">
        <div class="welcome-card region">
          <app-upload-zone (fileSelected)="onFileSelected($event)" />
        </div>
      </div>
    } @else {
      <div class="tool-layout">
        <div class="sidebar-column">
          @if (fileUrl(); as url) {
            <app-replace-file-button (fileSelected)="onFileSelected($event)" />
            @if (fileType() === 'image') {
              <app-source-image-preview [imageUrl]="url" />
            } @else if (fileType() === 'video') {
              <app-source-video-preview
                [videoUrl]="url"
                [playback]="videoPlayback()"
              />
            }
          }
          <div class="region">
            <app-option-controls
              [charsets]="charsets()"
              [options]="options()"
              (optionsChange)="onOptionsChange($event)"
            />
          </div>
        </div>

        @if (loading()) {
          <div class="region">
            <div class="result-status">
              <p class="loading-msg">
                <span class="spinner-border spinner-border-sm"></span>
                Converting…
              </p>
            </div>
          </div>
        } @else if (error(); as err) {
          <div class="region">
            <div class="result-status">
              <p class="error-msg">{{ err }}</p>
            </div>
          </div>
        } @else if (imageResult(); as frame) {
          <app-ascii-frame-viewer [frame]="frame" />
        } @else if (videoResult(); as video) {
          <app-ascii-video-player
            [video]="video"
            (playback)="videoPlayback.set($event)"
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

  readonly file = signal<File | null>(null);
  readonly fileType = signal<'image' | 'video' | 'unknown'>('unknown');
  readonly fileUrl = signal<string | null>(null);

  readonly charsets = signal<AsciiCharsetOption[]>([]);
  readonly options = signal<ConvertOptions>({
    width: ASCII_WIDTH.DEFAULT,
    invert: false,
    charset: '',
  });
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly videoPlayback = signal<VideoPlayback>({ ...INITIAL_VIDEO_PLAYBACK });
  readonly imageResult = signal<AsciiFrame | null>(null);
  readonly videoResult = signal<AsciiVideo | null>(null);

  ngOnInit(): void {
    this.configurationApi.getConvertOptions().subscribe((data) => {
      this.charsets.set(data);
      this.options.update((o) => ({ ...o, charset: data[0].id }));
      if (this.file()) {
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
    const fileType = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
        ? 'video'
        : 'unknown';

    this.file.set(file);
    this.fileType.set(fileType);
    this.error.set(null);
    this.imageResult.set(null);
    this.videoResult.set(null);
    this.videoPlayback.set({ ...INITIAL_VIDEO_PLAYBACK });
    this.revokeFileUrl();
    if (fileType !== 'unknown') {
      this.fileUrl.set(URL.createObjectURL(file));
    }
    this.convert();
  }

  onOptionsChange(options: ConvertOptions): void {
    this.options.set(options);
    this.convert();
  }

  private convert(): void {
    const file = this.file();
    const options = this.options();
    const fileType = this.fileType();
    if (!file || !options.charset || fileType === 'unknown') {
      return;
    }

    this.cancelConvert$.next();
    this.loading.set(true);
    this.error.set(null);

    if (fileType === 'image') {
      this.convertApi
        .convertImage(file, options)
        .pipe(takeUntil(this.cancelConvert$))
        .subscribe({
          next: (frame) => {
            this.imageResult.set(frame);
            this.loading.set(false);
          },
          error: (message: string) => this.onConvertError(message),
        });
      return;
    }

    this.convertApi
      .convertVideo(file, options)
      .pipe(takeUntil(this.cancelConvert$))
      .subscribe({
        next: (video) => {
          this.videoResult.set(video);
          this.loading.set(false);
        },
        error: (message: string) => this.onConvertError(message),
      });
  }

  private onConvertError(message: string): void {
    this.loading.set(false);
    this.imageResult.set(null);
    this.videoResult.set(null);
    this.error.set(message);
  }

  private revokeFileUrl(): void {
    const url = this.fileUrl();
    if (url) {
      URL.revokeObjectURL(url);
      this.fileUrl.set(null);
    }
  }
}
