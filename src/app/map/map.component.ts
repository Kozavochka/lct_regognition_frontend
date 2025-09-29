import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  private map: any;
  private isBrowser: boolean;
  selectedPoints: { id: number; lat: number; lon: number; address: string }[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }


  async ngOnInit(): Promise<void> {
    if (this.isBrowser) {
      const L = await import('leaflet');
      this.map = L.map('map', {
        zoomControl: true,
        attributionControl: false,
      }).setView([55.751244, 37.618423], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

      setTimeout(() => this.map.invalidateSize(), 0);

      // Читаем state из history
      const statePoints = history.state?.points;

      if (statePoints) {
        this.selectedPoints = statePoints;
        this.selectedPoints.forEach(p => {
          const marker = L.marker([p.lat, p.lon]).addTo(this.map);
          marker.bindPopup(`ID: ${p.id}<br>${p.address || ''}`);
        });

        if (this.selectedPoints.length) {
          const group = L.featureGroup(
            this.selectedPoints.map(p => L.marker([p.lat, p.lon]))
          );
          this.map.fitBounds(group.getBounds().pad(0.2));
        }
      }
    }
  }


}
