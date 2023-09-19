import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { SharedService } from './@shared/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  showButton = false;

  constructor(
    private sharedService: SharedService,
    private spinner: NgxSpinnerService
  ) {
    this.onWindowScroll();
  }

  ngOnInit(): void {
    this.sharedService.getUserDetails();
  }

  ngAfterViewInit(): void {
    this.spinner.hide();
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
