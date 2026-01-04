import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8001/api/auth';
  private tokenKey = 'auth_token';

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ---------- REGISTER ----------
  register(user: any) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, user)
      .pipe(tap(res => this.handleAuthSuccess(res)));
  }

  // ---------- LOGIN ----------
  login(credentials: { email: string; password: string }) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap(res => this.handleAuthSuccess(res)));
  }

  // ---------- AUTH SUCCESS ----------
  private handleAuthSuccess(res: AuthResponse) {
    localStorage.setItem(this.tokenKey, res.token);
    this.currentUserSubject.next(res.user);
  }

  // ---------- LOGOUT ----------
  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ---------- TOKEN ----------
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // ---------- AUTH CHECK (GUARD SAFE) ----------
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
