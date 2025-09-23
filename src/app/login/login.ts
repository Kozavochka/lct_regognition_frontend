import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';

    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {
        if (res?.access) {
          localStorage.setItem('access_token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
          this.router.navigate(['/recognition']);
        } else {
          this.errorMessage = 'Неверный логин или пароль';
        }
      },
      error: (err) => {
        console.error('Ошибка авторизации', err);
        this.errorMessage = 'Ошибка при авторизации';
      }
    });
  }
}
