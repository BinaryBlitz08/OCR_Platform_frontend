import { Component, OnInit } from '@angular/core';
import { OcrService } from '../../services/ocr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule,FormsModule],
  selector: 'app-history',
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class History implements OnInit {
  history: any[] = [];
  loading = false;

  constructor(private ocrService: OcrService) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.loading = true;
    this.ocrService.getHistory().subscribe({
      next: (res) => {
        this.history = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
