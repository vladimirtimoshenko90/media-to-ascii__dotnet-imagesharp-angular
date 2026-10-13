import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AsciiCharsetOption {
  id: string;
  characters: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigurationApiService {
  private readonly http = inject(HttpClient);

  getConvertOptions(): Observable<AsciiCharsetOption[]> {
    return this.http.get<AsciiCharsetOption[]>('/api/config/convert-options');
  }
}
