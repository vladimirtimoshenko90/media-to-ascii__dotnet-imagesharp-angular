import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConvertOptions } from './convert-options';

@Injectable({ providedIn: 'root' })
export class ConvertApiService {
  convertImage(file: File, options: ConvertOptions): Observable<string> {
    throw new Error('Not implemented');
  }

  convertVideo(file: File, options: ConvertOptions): Observable<string> {
    throw new Error('Not implemented');
  }
}
