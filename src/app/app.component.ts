import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'freedom';
  isLoginPage = false;
  isSignUpPage = false;
  isResetPasswordPage = false;
  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent | any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          this.isLoginPage = true;
        } else {
          this.isLoginPage = event.url.includes('/login') || false;
          this.isResetPasswordPage =
            event.url.includes('/reset-password') || false;
          this.isSignUpPage = event.url.includes('/register') || false;
        }
      }
    });
  }
}
