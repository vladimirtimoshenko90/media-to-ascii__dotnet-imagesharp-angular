import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ConvertOptions {
  width: number;
  invert: boolean;
  charset: string;
}

@Injectable({ providedIn: 'root' })
export class ConvertApiService {
  private readonly http = inject(HttpClient);

  convertImage(file: File, options: ConvertOptions): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    form.append('width', String(options.width));
    form.append('invert', String(options.invert));
    form.append('charset', options.charset);
    return this.http.post('/api/convert/image', form, { responseType: 'text' });
  }

  convertVideo(file: File, options: ConvertOptions): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    form.append('width', String(options.width));
    form.append('invert', String(options.invert));
    form.append('charset', options.charset);
    return this.http.post('/api/convert/video', form, { responseType: 'text' });
  }
}
