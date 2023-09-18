import { Component, HostListener, OnInit } from '@angular/core';
import { SharedService } from './@shared/services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showButton = false;

  constructor(
    private sharedService: SharedService
  ) {
    this.onWindowScroll();
  }

  ngOnInit(): void {
    this.sharedService.getUserDetails();
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
