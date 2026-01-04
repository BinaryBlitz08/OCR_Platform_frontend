// src/app/components/dashboard/dashboard.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcrService } from '../../services/ocr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  selectedFiles: FileList | null = null;
  results: any[] = [];
  loading = false;
  message = '';
  error = '';

  constructor(private ocrService: OcrService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = input.files;
  }

  upload() {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      this.error = 'Please select at least one image';
      return;
    }

    this.loading = true;
    this.message = '';
    this.error = '';
    this.results = [];

    this.ocrService.uploadImages(this.selectedFiles).subscribe({
      next: (res: any) => {
        this.results = res.results || [];
        this.message = res.message || 'OCR processing complete!';
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Upload failed. Check backend and dummy API.';
        this.loading = false;
      }
    });
  }

  download(fileId: string, type: string) {
    this.ocrService.downloadFile(fileId, type);
  }
}