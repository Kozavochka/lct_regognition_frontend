import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadModalComponent } from '../upload-modal/upload-modal.component'; // путь к модалке
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recognition',
  standalone: true,
  imports: [CommonModule, UploadModalComponent, RouterModule], // добавляем сюда
  templateUrl: './recognition.component.html',
  styleUrl: './recognition.component.scss'
})
export class RecognitionComponent implements OnInit {
  data: RecognitionRow[] = [
    { id: 1, date: '2025-09-22', photo_url: 'photo', lat: 55.661346, lot: 37.55602 },
    { id: 2, date: '2025-09-21', photo_url: 'photo', lat: null, lot: null }
  ];

  showModal = false;
  handleFile(res: any) {
    console.log('Ответ от API:', res);
    this.showModal = false;
  }

  getAddress(lat: number, lon: number): Promise<string> {
  return fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
    .then(res => res.json())
    .then(data => data.display_name || 'Адрес не найден')
    .catch(() => 'Ошибка получения адреса');
  }

    ngOnInit() {
    this.data.forEach(async (row) => {
      if (row.lat && row.lot) {
        row.address = await this.getAddress(row.lat, row.lot);
      } else {
        row.address = '—';
      }
    });
  }

}

interface RecognitionRow {
  id: number;
  date: string;
  photo_url: string;
  lat: number | null;
  lot: number | null;
  address?: string;
}

