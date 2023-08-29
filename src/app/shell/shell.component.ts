import { animate, query, style } from '@angular/animations';
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  isShow = false;
  isShowMyProfile = false;
  isLoginPgae = false;
  isResetPasswordPage = false;
  showButton = false;
  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent | any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          this.isShow = true;
          this.isShowMyProfile = true;
          this.isLoginPgae = true;
          this.isResetPasswordPage = true;
        } else {
          this.isShow =
            event.url.includes('/people') ||
            event.url.includes('/events') ||
            event.url.includes('/local-community') ||
            event.url.includes('/settings') ||
            event.url.includes('/login') ||
            event.url.includes('/reset-password') ||
            event.url.includes('/register') ||
            event.url.includes('/notifications') ||
            false;
          this.isLoginPgae = event.url.includes('/login') || false;
          this.isShowMyProfile =
            event.url.includes('/edit-profile') ||
            event.url.includes('/view-profile') ||
            event.url.includes('/login') ||
            event.url.includes('/register') ||
            event.url.includes('/reset-password') ||
            event.url.includes('/community') ||
            event.url.includes('/notifications') ||
            false;
        }
      }
    });
    this.onWindowScroll();
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 300) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
