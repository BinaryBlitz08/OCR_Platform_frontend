import { Component, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { OcrService } from '../../services/ocr';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  selectedFiles: FileList | null = null;
  results: any[] = [];
  loading = false;
  message = '';
  error = '';

  constructor(
    private ocrService: OcrService,
    private cdr: ChangeDetectorRef 
  ) {
    console.log('DEBUG: Dashboard Component Initialized');
  }

  onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const newFiles = Array.from(input.files);

  if (!this.selectedFiles) {
    const dataTransfer = new DataTransfer();
    newFiles.forEach(f => dataTransfer.items.add(f));
    this.selectedFiles = dataTransfer.files;
  } else {
    const dataTransfer = new DataTransfer();
    Array.from(this.selectedFiles).forEach(f => dataTransfer.items.add(f));
    newFiles.forEach(f => dataTransfer.items.add(f));
    this.selectedFiles = dataTransfer.files;
  }

  console.log('Files selected:', this.selectedFiles.length);
}

  upload() {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      this.error = 'Please select at least one image';
      return;
    }

    console.log('DEBUG: Upload Starting. Setting loading = true');
    this.loading = true;
    this.message = '';
    this.error = '';
    this.results = [];

    this.ocrService.uploadImages(this.selectedFiles)
      .pipe(
        finalize(() => {
          console.log('DEBUG: Finalize reached. Setting loading = false');
          this.loading = false;
          this.cdr.detectChanges(); 
        })
      )
      .subscribe({
        next: (res: any) => {
          console.log('DEBUG: Backend Raw Response:', res);
          
          if (res && res.results) {
            this.results = res.results;
            console.log('DEBUG: Results assigned to array. Length:', this.results.length);
          } else {
            console.warn('DEBUG: Response received but "results" field is missing!', res);
          }
          
          this.message = res.message || 'OCR processing complete!';
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('DEBUG: Upload Error Caught:', err);
          this.error = err.error?.message || 'Upload failed';
          this.cdr.detectChanges();
        }
      });
  }

  download(fileId: string, type: string) {
    console.log(`DEBUG: Initiating download for ID: ${fileId}, Type: ${type}`);
    this.ocrService.downloadFile(fileId, type);
  }
}