import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [RouterLink]
})
export class HomeComponent {
  constructor(private router: Router) {}
  toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (menu && icon) { // Null check
      menu.classList.toggle("open");
      icon.classList.toggle("open");
    }
  }
  goToSection(section: string) {
    this.router.navigate(['/' + section]);
  }
}
