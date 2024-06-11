import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  standalone: true,
  imports: []
})
export class ProjectsComponent {
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
