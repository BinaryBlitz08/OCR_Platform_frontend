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

  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  const token = this.authService.getToken();

  return this.http.post(`${this.apiUrl}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`  // ← Plain object — never stripped
    }
  });
}

  // Get user-specific history
  getHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history`, {
      headers: this.getHeaders()
    });
  }

  // Download file (opens in new tab)
  // ocr.service.ts
// ocr.service.ts
downloadFile(fileId: string, type: string) {
  // Use HttpClient to include authentication headers automatically
  this.http.get(`${this.apiUrl}/download/${fileId}/${type}`, {
    responseType: 'blob', // Critical: tells Angular to handle binary data
    observe: 'response'
  }).subscribe({
    next: (response) => {
      // Create a local blob URL for the file data
      const blob = new Blob([response.body!], { type: response.headers.get('Content-Type')! });
      const url = window.URL.createObjectURL(blob);
      
      // Create a hidden anchor element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `ocr_result_${fileId}.${type === 'text' ? 'txt' : type}`;
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Download failed:', err);
      // This matches the "Could not download file" alert in your screenshot
      alert('Could not download file. Please check your session.');
    }
  });
}
}