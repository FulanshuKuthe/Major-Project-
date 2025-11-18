import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  // Save token
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }

  // Remove token
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Check login status
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  // Save user info
  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get user info
  getUser() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  // LOGIN API
  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, data);
  }

  // GET PROFILE API
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`);
  }

  // REGISTER API
  register(data: any) {
  console.log("📡 REGISTER URL =", `${this.apiUrl}/auth/register`);
  return this.http.post(`${this.apiUrl}/register`, data);
}

}
