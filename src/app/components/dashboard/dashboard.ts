import { Component } from '@angular/core';
import { OcrService } from '../../services/ocr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule,FormsModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  selectedFiles: FileList | null = null;
  results: any[] = [];
  loading = false;
  message = '';

  constructor(private ocrService: OcrService) {}

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    if (!this.selectedFiles || this.selectedFiles.length === 0) return;

    this.loading = true;
    this.message = '';
    this.results = [];

    this.ocrService.uploadImages(this.selectedFiles).subscribe({
      next: (res) => {
        this.results = res.results || [];
        this.message = 'Upload successful!';
        this.loading = false;
      },
      error: (err) => {
        this.message = err.error.message || 'Upload failed';
        this.loading = false;
      }
    });
  }

  download(fileId: string, type: string) {
    this.ocrService.downloadFile(fileId, type);
  }
}