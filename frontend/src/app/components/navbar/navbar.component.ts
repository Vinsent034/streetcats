import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  // Controlla se il menu mobile è aperto
  menuAperto = false;

  constructor(public authService: AuthService, private router: Router) {}

  // Apre/chiude il menu hamburger su mobile
  toggleMenu(): void {
    this.menuAperto = !this.menuAperto;
    console.log('Menu mobile:', this.menuAperto ? 'aperto' : 'chiuso');
  }

  // Effettua il logout e naviga alla home
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.menuAperto = false;
  }

  // Chiude il menu mobile dopo aver cliccato un link
  chiudiMenu(): void {
    this.menuAperto = false;
  }
}
