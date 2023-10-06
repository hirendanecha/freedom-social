import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  mobileMenuToggle: boolean = false

  constructor(private router: Router) { }

  openLoginPage(): void {
    this.mobileMenuToggle = false;
    this.router.navigate(['/login']);
  }
  openSignPage(): void {
    this.mobileMenuToggle = false;
    this.router.navigate(['/register']);
  }
  mobileMenu():void{
  this.mobileMenuToggle = !this.mobileMenuToggle;
  }
  closeMenu(){
    this.mobileMenuToggle = false;
  }
}
