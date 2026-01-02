import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  private apiUrl = 'http://localhost:6000/api/ocr';

  constructor(private http: HttpClient, private authService: AuthService) {}

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
    return this.http.post(`${this.apiUrl}/upload`, formData, {
      headers: this.getHeaders()
    });
  }

  getHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history`, {
      headers: this.getHeaders()
    });
  }

  downloadFile(fileId: string, type: string) {
    window.open(`${this.apiUrl}/download/${fileId}/${type}`, '_blank');
  }
}