import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadModalComponent } from '../upload-modal/upload-modal.component'; // путь к модалке

@Component({
  selector: 'app-recognition',
  standalone: true,
  imports: [CommonModule, UploadModalComponent], // добавляем сюда
  templateUrl: './recognition.component.html',
  styleUrl: './recognition.component.scss'
})
export class RecognitionComponent {
  data = [
    { id: 1, date: '2025-09-22' },
    { id: 2, date: '2025-09-21' }
  ];

  showModal = false;
  handleFile(res: any) {
    console.log('Ответ от API:', res);
    this.showModal = false;
  }
}
