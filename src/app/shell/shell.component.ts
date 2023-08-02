import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
})
export class ShellComponent {
  isShow = false;
  isShowMyProfile = false;
  isLoginPgae = false;
  isResetPasswordPage = false;
  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent | any) => {
      if (event instanceof NavigationEnd) {
        console.log(event.url);
        if (event.url === '/') {
          this.isShow = true;
          this.isShowMyProfile = true;
          this.isLoginPgae = true;
          this.isResetPasswordPage = true;
        } else {
          this.isShow =
            event.url.includes('/people') ||
            event.url.includes('/events') ||
            event.url.includes('/community') ||
            event.url.includes('/settings') ||
            event.url.includes('/login') ||
            event.url.includes('/reset-password') ||
            event.url.includes('/register') ||
            // event.url.includes('/favorite') ||
            false;
          this.isLoginPgae = event.url.includes('/login') || false;
          this.isShowMyProfile =
            event.url.includes('/edit-profile') ||
            event.url.includes('/view-profile') ||
            event.url.includes('/login') ||
            event.url.includes('/register') ||
            event.url.includes('/reset-password') ||
            event.url.includes('/community') ||
            false;
        }
      }
    });
  }
}
