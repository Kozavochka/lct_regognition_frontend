import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageCropperComponent],
  templateUrl: './upload-modal.component.html',
  styleUrl: './upload-modal.component.scss'
})
export class UploadModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() fileReady = new EventEmitter<Blob>();

  imageChangedEvent: any = '';
  croppedImage: string | null = null;
  errorMessage = '';

  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Допустимые форматы: JPG, JPEG, PNG';
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (
        img.naturalWidth < 640 || img.naturalHeight < 420 ||
        img.naturalWidth > 5500 || img.naturalHeight > 3500
      ) {
        this.errorMessage = 'Размер изображения должен быть от 640x420 до 5500x3500';
      } else {
        this.errorMessage = '';
        this.imageChangedEvent = event;
      }
    };
    img.src = URL.createObjectURL(file);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64 ?? null;
  }

  submit() {
    if (this.croppedImage) {
      fetch(this.croppedImage)
        .then(res => res.blob())
        .then(blob => this.fileReady.emit(blob));
    }
  }
}
