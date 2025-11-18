import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {

  user: any = null;

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getUser();
  }
}
