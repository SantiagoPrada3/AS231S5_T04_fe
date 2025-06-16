import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Translation } from '../interfaces/translation';

interface TranslationRequest {
  text: string;
  sourceLang?: string;
  targetLang?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly apiUrl = 'http://localhost:8080/api/translate';

  constructor(private readonly http: HttpClient) { }

  // Create translation
  createTranslation(request: TranslationRequest): Observable<Translation> {
    const payload = {
      text: request.text,
      sourceLang: request.sourceLang || 'en',
      targetLang: request.targetLang || 'es'
    };
    return this.http.post<Translation>(this.apiUrl, payload);
  }

  // Get all translations
  getAllTranslations(): Observable<Translation[]> {
    return this.http.get<Translation[]>(`${this.apiUrl}/all`);
  }

  // Get active translations
  getActiveTranslations(): Observable<Translation[]> {
    return this.http.get<Translation[]>(`${this.apiUrl}/active`);
  }

  // Get inactive translations
  getInactiveTranslations(): Observable<Translation[]> {
    return this.http.get<Translation[]>(`${this.apiUrl}/inactive`);
  }

  // Get translation by ID
  getTranslationById(id: string): Observable<Translation> {
    return this.http.get<Translation>(`${this.apiUrl}/${id}`);
  }

  // Update translation
  updateTranslation(id: string, translation: Partial<Translation>): Observable<Translation> {
    return this.http.put<Translation>(`${this.apiUrl}/${id}`, translation);
  }

  // Delete translation (logical delete)
  deleteTranslation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Restore translation
  restoreTranslation(id: string): Observable<Translation> {
    return this.http.patch<Translation>(`${this.apiUrl}/${id}/restore`, {});
  }
} 