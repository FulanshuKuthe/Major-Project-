import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "/api/auth";
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  register(
    name: string,
    email: string,
    password: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password })
      .pipe(
        tap((response: AuthResponse) => {
          if (response.token) {
            localStorage.setItem("token", response.token);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response: AuthResponse) => {
          if (response.token) {
            localStorage.setItem("token", response.token);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem("token");
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  private loadCurrentUser(): void {
    const token = this.getToken();
    if (token) {
      this.http.get<User>(`${this.apiUrl}/me`).subscribe(
        (user: User) => this.currentUserSubject.next(user),
        (_err: any) => {
          localStorage.removeItem("token");
          this.currentUserSubject.next(null);
        }
      );
    }
  }
}
