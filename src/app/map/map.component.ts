import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule], // ← добавляем сюда
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  private map: any;
  private isBrowser: boolean;
  selectedCoords: { lat: number; lng: number } | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit(): Promise<void> {
    if (this.isBrowser) {
      const L = await import('leaflet');
      this.map = L.map('map', {
        zoomControl: true,
        attributionControl: false,
      }).setView([55.751244, 37.618423], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

      setTimeout(() => this.map.invalidateSize(), 0);

      this.map.on('click', (e: any) => {
        this.selectedCoords = e.latlng;
        L.popup()
          .setLatLng(e.latlng)
          .setContent(`Lat: ${e.latlng.lat.toFixed(5)}, Lng: ${e.latlng.lng.toFixed(5)}`)
          .openOn(this.map);
      });
    }
  }
}
