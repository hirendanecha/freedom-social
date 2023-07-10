import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'freedom';
  isLoginPgae = false;
  isSignUpPgae = false;
  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent | any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          this.isLoginPgae = true;
        } else {
          this.isLoginPgae = event.url.includes('/login') || false;
          this.isSignUpPgae = event.url.includes('/register') || false;
        }
      }
    });
  }
}
