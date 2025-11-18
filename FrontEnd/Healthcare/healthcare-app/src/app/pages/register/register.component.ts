import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService) {}

  submit() {
    console.log("Register clicked");   // <--- DEBUG HERE

    this.auth.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        console.log("Registration Success", res);  // <--- DEBUG
        alert("Registration Successful");
      },
      error: err => {
        console.log("Registration Error", err);   // <--- DEBUG
        this.error = err.error?.message || 'Registration failed';
      }
    });
  }
}
