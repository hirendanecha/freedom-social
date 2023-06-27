import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.css']
})
export class MyListComponent {
  isEXpand = false;
  isShow = false;
  constructor(
    private router: Router
  ) {
    this.router.events.subscribe((event: RouterEvent | any) => {
      if (event instanceof NavigationEnd) {
        this.isShow = event.url.includes('/people') || false;
      }
    })
  }

  openToggle() {
    console.log('before', this.isEXpand);
    this.isEXpand = !this.isEXpand;
    console.log('after', this.isEXpand);
  }
}
