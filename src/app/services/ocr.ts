import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class OcrService {

  private apiUrl = 'http://localhost:8001/api/ocr';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

 uploadImages(files: FileList): Observable<any> {
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  const token = this.authService.getToken();

  return this.http.post(`${this.apiUrl}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`  
    }
  });
}

  getHistory(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/history`, {
    headers: {
      Authorization: `Bearer ${this.authService.getToken()}`
    }
  });
  }
 
downloadFile(fileId: string, type: string) {
  const token = this.authService.getToken();

  this.http.get(
    `${this.apiUrl}/download/${fileId}/${type}`,
    {
      headers: {
        Authorization: `Bearer ${token}`   // ✅ THIS WAS MISSING
      },
      responseType: 'blob',
      observe: 'response'
    }
  ).subscribe({
    next: (response) => {
      const blob = new Blob(
        [response.body!],
        { type: response.headers.get('Content-Type') || 'application/octet-stream' }
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `ocr_result_${fileId}.${type === 'text' ? 'txt' : type}`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Download failed:', err);
      alert('Could not download file. Please check your session.');
    }
  });
}

}