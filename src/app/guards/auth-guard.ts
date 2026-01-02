import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

interface authResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

@Injectable({
  providedIn: 'root'
})
export class authGuard {
  private apiUrl = 'http://localhost:6000/api/auth';
  private tokenKey = 'auth_token';
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    if (token) {
      this.currentUserSubject.next({ loggedIn: true });
    }
  }

  register(user: any) {
    return this.http.post<authResponse>(`${this.apiUrl}/register`, user).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  login(credentials: any) {
    return this.http.post<authResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  private handleAuthSuccess(res: authResponse) {
    localStorage.setItem(this.tokenKey, res.token);
    this.currentUserSubject.next(res.user);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}