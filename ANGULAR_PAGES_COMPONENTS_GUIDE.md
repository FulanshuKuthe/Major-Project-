# Angular Pages and Components Guide

A complete guide to creating and organizing pages and components in Angular (Standalone & Module-based).

---

## Table of Contents

1. [Understanding Pages vs Components](#understanding-pages-vs-components)
2. [Project Structure](#project-structure)
3. [Creating Components](#creating-components)
4. [Creating Pages](#creating-pages)
5. [Routing Setup](#routing-setup)
6. [Standalone vs Module-Based](#standalone-vs-module-based)
7. [Practical Examples](#practical-examples)
8. [Best Practices](#best-practices)

---

## Understanding Pages vs Components

### Components

- **Reusable UI blocks** (buttons, cards, forms, headers, footers)
- Smaller, focused, single-responsibility
- Can be used in multiple pages
- Example: `HeaderComponent`, `CardComponent`, `ButtonComponent`

### Pages

- **Full-screen views** tied to routes
- Combine multiple components
- Typically contain business logic and state management
- Example: `DashboardPage`, `LoginPage`, `UserProfilePage`

---

## Project Structure

### Recommended Folder Layout

```
src/
├── app/
│   ├── shared/                    # Shared across entire app
│   │   ├── components/            # Reusable components
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── navbar/
│   │   │   └── sidebar/
│   │   ├── services/              # Shared services
│   │   ├── interceptors/
│   │   ├── guards/
│   │   └── models/                # Interfaces & types
│   │
│   ├── pages/                     # Page components (one per route)
│   │   ├── home/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── user-profile/
│   │   └── not-found/
│   │
│   ├── features/                  # Feature modules (optional)
│   │   ├── products/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── pages/
│   │   └── orders/
│   │
│   ├── app.component.ts
│   ├── app.config.ts              # Providers & config
│   ├── app.routes.ts              # Route definitions
│   └── app.component.html
│
├── assets/
├── styles/
└── main.ts
```

---

## Creating Components

### Using Angular CLI

```bash
# Generate a component (standalone by default in Angular 17+)
ng generate component shared/components/header

# Generate with skip tests
ng generate component shared/components/footer --skip-tests

# Generate without inline template/style
ng generate component shared/components/card --skip-tests
```

### Manual Component Creation

#### Step 1: Create Folder Structure

```
src/app/shared/components/header/
├── header.component.ts
├── header.component.html
├── header.component.scss
└── header.component.spec.ts
```

#### Step 2: Create Component File

**header.component.ts**

```typescript
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  @Input() title: string = "My App";
  @Input() isLoggedIn: boolean = false;
  @Output() logoutClicked = new EventEmitter<void>();

  onLogout(): void {
    this.logoutClicked.emit();
  }
}
```

**header.component.html**

```html
<header class="app-header">
  <h1>{{ title }}</h1>
  <nav>
    <a routerLink="/">Home</a>
    <a routerLink="/dashboard">Dashboard</a>
    <button *ngIf="isLoggedIn" (click)="onLogout()">Logout</button>
  </nav>
</header>
```

**header.component.scss**

```scss
.app-header {
  background-color: #333;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: 0;
  }

  nav {
    display: flex;
    gap: 1rem;

    a,
    button {
      color: white;
      text-decoration: none;
      cursor: pointer;
      border: none;
      background: none;
      font-size: 1rem;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
```

---

## Creating Pages

### Step 1: Generate a Page Component

```bash
ng generate component pages/dashboard --skip-tests
```

### Step 2: Create Page File

**dashboard.component.ts**

```typescript
import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

// Import services
import { AuthService } from "../../services/auth.service";
import { DashboardService } from "./dashboard.service";

// Import shared components
import { HeaderComponent } from "../../shared/components/header/header.component";
import { CardComponent } from "../../shared/components/card/card.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, CardComponent],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  dashboardData: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.dashboardService
      .getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.dashboardData = data;
          this.loading = false;
        },
        (error) => {
          this.error = "Failed to load dashboard data";
          this.loading = false;
        }
      );
  }

  onLogout(): void {
    this.authService.logout();
  }
}
```

**dashboard.component.html**

```html
<app-header
  [title]="'Dashboard'"
  [isLoggedIn]="true"
  (logoutClicked)="onLogout()"
>
</app-header>

<main class="dashboard-container">
  <h2>Welcome to Dashboard</h2>

  <div *ngIf="loading" class="loading">Loading...</div>

  <div *ngIf="error" class="error">{{ error }}</div>

  <div class="dashboard-grid">
    <app-card
      *ngFor="let item of dashboardData"
      [title]="item.title"
      [content]="item.content"
    >
    </app-card>
  </div>
</main>
```

**dashboard.component.scss**

```scss
.dashboard-container {
  padding: 2rem;

  h2 {
    color: #333;
    margin-bottom: 1.5rem;
  }

  .loading,
  .error {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
  }

  .error {
    color: red;
    background-color: #fee;
    border-radius: 4px;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}
```

**dashboard.service.ts**

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private apiUrl = "/api/dashboard";

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
```

---

## Routing Setup

### app.routes.ts (Standalone Routing)

```typescript
import { Routes } from "@angular/router";
import { AuthGuard } from "./shared/guards/auth.guard";

// Import page components
import { HomePage } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";

export const routes: Routes = [
  // Public routes
  { path: "", component: HomePage },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },

  // Protected routes
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "profile",
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },

  // Lazy-loaded feature module (optional)
  {
    path: "products",
    loadComponent: () =>
      import("./features/products/products.component").then(
        (m) => m.ProductsComponent
      ),
    canActivate: [AuthGuard],
  },

  // Catch-all route (must be last)
  { path: "404", component: NotFoundComponent },
  { path: "**", redirectTo: "/404" },
];
```

### app.config.ts (Providers Setup)

```typescript
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    // Add other providers here
  ],
};
```

---

## Standalone vs Module-Based

### Standalone Components (Modern - Angular 14+)

**Pros:**

- No NgModule boilerplate
- Tree-shakeable
- Simpler dependency management
- Recommended for new projects

**Example:**

```typescript
@Component({
  selector: "app-card",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `...`,
  styles: [`...`],
})
export class CardComponent {}
```

### Module-Based (Legacy)

**Module File:**

```typescript
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardComponent } from "./card.component";

@NgModule({
  declarations: [CardComponent],
  imports: [CommonModule],
  exports: [CardComponent],
})
export class CardModule {}
```

---

## Practical Examples

### Example 1: User Profile Page

**user-profile.component.ts**

```typescript
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { UserService } from "./user.service";

@Component({
  selector: "app-user-profile",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserData();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  loadUserData(): void {
    this.userService.getUserProfile().subscribe((user) => {
      this.profileForm.patchValue(user);
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.updateUserProfile(this.profileForm.value).subscribe(
      () => {
        this.successMessage = "Profile updated successfully!";
        this.loading = false;
      },
      (error) => {
        this.errorMessage = "Failed to update profile.";
        this.loading = false;
      }
    );
  }
}
```

**user-profile.component.html**

```html
<div class="profile-container">
  <h1>User Profile</h1>

  <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="name">Name:</label>
      <input
        id="name"
        type="text"
        formControlName="name"
        class="form-control"
        [class.is-invalid]="profileForm.get('name')?.invalid && profileForm.get('name')?.touched"
      />
      <small
        class="error"
        *ngIf="profileForm.get('name')?.invalid && profileForm.get('name')?.touched"
      >
        Name is required and must be at least 2 characters.
      </small>
    </div>

    <div class="form-group">
      <label for="email">Email:</label>
      <input
        id="email"
        type="email"
        formControlName="email"
        class="form-control"
        [class.is-invalid]="profileForm.get('email')?.invalid && profileForm.get('email')?.touched"
      />
      <small
        class="error"
        *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched"
      >
        Valid email is required.
      </small>
    </div>

    <button type="submit" [disabled]="profileForm.invalid || loading">
      {{ loading ? 'Saving...' : 'Save Changes' }}
    </button>
  </form>

  <div *ngIf="successMessage" class="alert alert-success">
    {{ successMessage }}
  </div>
  <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
</div>
```

### Example 2: Reusable Card Component

**card.component.ts**

```typescript
import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div class="card-footer" *ngIf="showFooter">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        border: 1px solid #ddd;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .card-header {
        background-color: #f5f5f5;
        padding: 1rem;
        border-bottom: 1px solid #ddd;
      }

      .card-body {
        padding: 1rem;
      }

      .card-footer {
        background-color: #f9f9f9;
        padding: 1rem;
        border-top: 1px solid #ddd;
      }
    `,
  ],
})
export class CardComponent {
  @Input() title: string = "Card Title";
  @Input() showFooter: boolean = false;
}
```

**Usage in a page:**

```html
<app-card title="Product Details">
  <p>Product information goes here</p>
  <div card-footer>
    <button>Edit</button>
    <button>Delete</button>
  </div>
</app-card>
```

---

## Best Practices

### 1. **File Naming Conventions**

- **Components:** `feature-name.component.ts`
- **Services:** `feature-name.service.ts`
- **Interfaces:** `feature-name.model.ts` or `feature-name.interface.ts`
- **Guards:** `auth.guard.ts`
- **Interceptors:** `token.interceptor.ts`

### 2. **Single Responsibility Principle**

- One component = one purpose
- Keep pages light; move logic to services
- Extract reusable UI into shared components

### 3. **Component Composition**

```typescript
// ✅ Good: Composable, reusable
<app-header [user]="currentUser"></app-header>
<app-sidebar [menuItems]="items"></app-sidebar>
<app-content>...</app-content>

// ❌ Bad: Monolithic, hard to reuse
<div class="entire-layout"><!-- everything in one --></div>
```

### 4. **Service Organization**

```typescript
// Services in shared/services for app-wide use
src/app/shared/services/
├── auth.service.ts
├── api.service.ts
└── logger.service.ts

// Feature-specific services in feature folder
src/app/features/products/
└── product.service.ts
```

### 5. **Use OnDestroy for Cleanup**

```typescript
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.service.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.data = data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 6. **Route Guards for Protection**

```typescript
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }
    this.router.navigate(["/login"]);
    return false;
  }
}
```

### 7. **Use Trackby in \*ngFor**

```html
<!-- ✅ Good: Better performance -->
<div *ngFor="let item of items; trackBy: trackByFn">{{ item.name }}</div>

<!-- ❌ Bad: Recreates every item -->
<div *ngFor="let item of items">{{ item.name }}</div>
```

```typescript
trackByFn(index: number, item: any): any {
  return item.id;
}
```

### 8. **Lazy Load Feature Modules**

```typescript
// In app.routes.ts
{
  path: 'admin',
  loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
  canActivate: [AdminGuard],
}
```

---

## Summary Checklist

- ✅ Organize components in `shared/components/` for reusability
- ✅ Create pages in `pages/` folder tied to routes
- ✅ Use Standalone Components (Angular 14+)
- ✅ Implement proper routing with guards
- ✅ Extract business logic to services
- ✅ Follow naming conventions
- ✅ Clean up subscriptions with `takeUntil` and `destroy$`
- ✅ Use `trackBy` in loops for performance
- ✅ Implement lazy loading for feature modules
- ✅ Document components with JSDoc comments

---

## Quick Commands

```bash
# Generate a page component
ng generate component pages/my-page --skip-tests

# Generate a reusable component
ng generate component shared/components/my-component --skip-tests

# Generate a service
ng generate service services/my-service --skip-tests

# Generate a guard
ng generate guard shared/guards/auth --skip-tests

# Build for production
ng build

# Run development server
ng serve
```

---

**Happy building! 🚀**
