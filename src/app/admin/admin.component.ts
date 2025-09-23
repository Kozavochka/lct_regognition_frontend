import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUserModalComponent } from './create-user-modal/create-user-modal.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, CreateUserModalComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  showModal = false;
  users: any[] = [];

  handleUserCreated(user: any) {
    console.log('Пользователь создан', user);
    this.showModal = false;
  }
}
