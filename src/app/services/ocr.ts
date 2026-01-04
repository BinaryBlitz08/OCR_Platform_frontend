// src/app/services/ocr.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  // Your Node.js backend URL
  private apiUrl = 'http://localhost:8001/api/ocr';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get JWT token for protected routes
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Upload multiple images (batch)
  uploadImages(files: FileList): Observable<any> {
    const formData = new FormData();

    // Use "files" plural — matches backend multer.array('files')
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    return this.http.post(`${this.apiUrl}/upload`, formData, {
      headers: this.getHeaders()
    });
  }

  // Get user-specific history
  getHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history`, {
      headers: this.getHeaders()
    });
  }

  // Download file (opens in new tab)
  downloadFile(fileId: string, type: string): void {
    const url = `${this.apiUrl}/download/${fileId}/${type}`;
    window.open(url, '_blank');
  }
}