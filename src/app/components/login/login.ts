import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  credentials = { email: '', password: '' };
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {
    console.log('LOGIN CONSTRUCTOR CALLED');
  }

  login() {
      console.log('Upload button clicked');
    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}