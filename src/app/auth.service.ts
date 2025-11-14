// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  register(payload: { email: string; password: string; role?: string }) {
    return this.http.post(`${this.base}/api/auth/register`, payload);
  }

  // expects ONE object argument
  login(payload: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.base}/api/auth/login`, payload);
  }

  saveToken(token: string) { localStorage.setItem('token', token); }
  getToken() { return localStorage.getItem('token'); }
  logout() { localStorage.removeItem('token'); }

  // ✅ used by the guard
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
