import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormsModule,CommonModule,RouterLink],
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  user = { name: '', email: '', password: '' };
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.loading = true;
    this.error = '';
    this.authService.register(this.user).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}