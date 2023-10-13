import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  mobileMenuToggle: boolean = false;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef,
    private tokenService: TokenStorageService
  ) {
    if (this.tokenService.getToken()) {
      this.router.navigate(['/home']);
    }
  }

  openLoginPage(): void {
    this.closeMenu();
    this.router.navigate(['/login']);
  }
  openSignPage(): void {
    this.closeMenu();
    this.router.navigate(['/register']);
  }
  mobileMenu(): void {
    this.mobileMenuToggle = !this.mobileMenuToggle;
    this.renderer.setStyle(this.el.nativeElement.ownerDocument.body, 'overflow', 'hidden');
  }
  closeMenu() {
    this.mobileMenuToggle = false;
    this.renderer.removeStyle(this.el.nativeElement.ownerDocument.body, 'overflow');
  }
}
