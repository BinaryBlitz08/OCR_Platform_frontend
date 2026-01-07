import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OcrService } from '../../services/ocr';
import { take, finalize } from 'rxjs';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class History implements OnInit {

  history: any[] = [];
  loading = false;

  constructor(
    private ocrService: OcrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('History component initialized');
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;

    this.ocrService.getHistory()
      .pipe(
        take(1), 
        finalize(() => {
          console.log('History finalize → loading false');
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          console.log('History API response:', res);
          this.history = res || [];
        },
        error: (err) => {
          console.error('History error:', err);
          this.history = [];
        }
      });
  }
}
