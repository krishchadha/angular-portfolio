import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css'],
  standalone: true,
  imports: []
})
export class ExperienceComponent {
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
