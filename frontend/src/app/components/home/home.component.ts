import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { ApiService, Gatto } from '../../services/api.service';

// Fix bug icone Leaflet con webpack/angular
const iconDefault = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {

  gatti: Gatto[] = [];
  mappa: L.Map | null = null;
  caricamento = true;
  errore = '';

  constructor(private apiService: ApiService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Carico i gatti dal backend
    this.caricaGatti();
  }

  ngAfterViewInit(): void {
    // Inizializzo la mappa dopo che il DOM è pronto
    // Uso setTimeout per evitare problemi di rendering
    setTimeout(() => {
      this.inizializzaMappa();
    }, 100);
  }

  // Carica tutti i gatti dal backend
  caricaGatti(): void {
    console.log('HomeComponent: carico gatti...');
    this.apiService.getGatti().subscribe({ // la funzione che recupera tutti i fatti e ne resituisce un array
      next: (risposta) => {
        this.gatti = risposta.gatti || []; // assegna la lista di gatti o un array vuoto se non ce ne sono
        console.log('Gatti caricati:', this.gatti.length);
        this.caricamento = false;
        this.cd.detectChanges(); //aggiorno per mostrare i gatto con cmabimanti dopo un operazione 
        // Aggiungo i marker sulla mappa (se già inizializzata)
        if (this.mappa) {
          this.aggiungiMarker(); // aggiunge solo i marker in corispondenza del gatto
        }
      },
      error: (err) => {
        console.error('Errore caricamento gatti:', err);
        this.errore = 'Errore nel caricamento dei gatti. Assicurati che il backend sia avviato.';
        this.caricamento = false;
        this.cd.detectChanges();
      }
    });
  }

  // Inizializza la mappa Leaflet centrata su Napoli
  inizializzaMappa(): void {
    console.log('HomeComponent: inizializzo mappa...');

    // Napoli: lat 40.8518, lng 14.2681
    this.mappa = L.map('mappa-home').setView([40.8518, 14.2681], 13);

    // Aggiungo i tile di OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.mappa);

    console.log('Mappa inizializzata su Napoli');

    // Se i gatti sono già stati caricati, aggiungo i marker
    if (this.gatti.length > 0) {
      this.aggiungiMarker();
    }
  }

  // Aggiunge un marker per ogni gatto sulla mappa
  aggiungiMarker(): void {
    if (!this.mappa) return;

    console.log('Aggiungo', this.gatti.length, 'marker sulla mappa');

    this.gatti.forEach(gatto => {
      // Costruisco l'URL dell'immagine
      const urlImmagine = this.apiService.getUrlImmagine(gatto.immagine);

      // Crea il contenuto del popup
      const popupHtml = `
        <div class="popup-gatto">
          <img src="${urlImmagine}" alt="${gatto.titolo}"
               style="width:80px;height:80px;object-fit:cover;border-radius:8px;display:block;margin-bottom:6px;"
               onerror="this.src='assets/no-image.png'">
          <strong>${gatto.titolo}</strong><br>
          <a onclick="window.location.assign('/dettaglio/${gatto.id}')"
             style="color:#2d6a4f;font-weight:bold;text-decoration:none;cursor:pointer;">
            Vedi dettaglio →
          </a>
        </div>
      `;

      // Aggiunge il marker con popup
      L.marker([gatto.latitudine, gatto.longitudine])
        .addTo(this.mappa!)
        .bindPopup(popupHtml);
    });
  }
}
