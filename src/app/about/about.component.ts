import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: true,
  imports: []
})
export class AboutComponent {
  name: string = 'Krish Chadha';
  description: string = 'I am a DevOps Engineer passionate about creating efficient and scalable software solutions.';
  skills: string[] = ['JavaScript', 'Angular', 'Node.js', 'Docker', 'Kubernetes'];
  education: string = 'Bachelor of Science in Computer Science';
  
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
