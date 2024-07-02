import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  isMenuOpen = true;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;}
}
