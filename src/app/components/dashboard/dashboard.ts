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
export class DashboardComponent {
  selectedFiles: FileList | null = null;
  results: any[] = [];
  loading = false;
  message = '';
  error = '';

  constructor(private ocrService: OcrService) {
    console.log('DASHBOARD CONSTRUCTOR CALLED');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = input.files;
  }

  upload() {
    console.log('Upload button clicked');
    console.log('Selected files count:', this.selectedFiles?.length);

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
        this.error = err.error?.message || 'Upload failed';
        this.loading = false;
      }
    });
  }

  download(fileId: string, type: string) {
    this.ocrService.downloadFile(fileId, type);
  }
}