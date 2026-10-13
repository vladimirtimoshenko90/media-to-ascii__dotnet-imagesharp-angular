import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ConvertOptions {
  width: number;
  invert: boolean;
  charset: string;
}

export interface AsciiFrame {
  ascii: string;
}

export interface AsciiVideo {
  frames: AsciiFrame[];
  durationMs: number;
  frameDelayMs: number;
}

@Injectable({ providedIn: 'root' })
export class ConvertApiService {
  private readonly http = inject(HttpClient);

  convertImage(file: File, options: ConvertOptions): Observable<AsciiFrame> {
    return this.http.post<AsciiFrame>('/api/convert/image', this.toFormData(file, options));
  }

  convertVideo(file: File, options: ConvertOptions): Observable<AsciiVideo> {
    return this.http.post<AsciiVideo>('/api/convert/video', this.toFormData(file, options));
  }

  private toFormData(file: File, options: ConvertOptions): FormData {
    const form = new FormData();
    form.append('file', file);
    form.append('width', String(options.width));
    form.append('invert', String(options.invert));
    form.append('charset', options.charset);
    return form;
  }
}
