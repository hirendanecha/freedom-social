import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css']
})
export class ShellComponent {
  isShow = false;
  constructor(
    private router: Router
  ) {
    this.router.events.subscribe((event: RouterEvent | any) => {
      if (event instanceof NavigationEnd) {
        this.isShow = event.url.includes('/people') ||
          event.url.includes('/events') ||
          event.url.includes('/community') ||
          event.url.includes('/settings') || false;
      }
    })
  }
}
