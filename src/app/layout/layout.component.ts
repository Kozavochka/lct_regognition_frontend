import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  usernameFirstLetter = '';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.me().subscribe({
      next: (res: any) => {
        if (res?.username) {
          this.usernameFirstLetter = res.username.charAt(0).toUpperCase();
        }
      },
      error: () => {
        this.usernameFirstLetter = '?';
      }
    });
  }

  logout() {
    // если у тебя есть refresh в localStorage
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      this.auth.logout(refresh).subscribe({
        next: () => {
          localStorage.clear();
          location.href = '/login';
        },
        error: () => {
          localStorage.clear();
          location.href = '/login';
        }
      });
    } else {
      localStorage.clear();
      location.href = '/login';
    }
  }
}
