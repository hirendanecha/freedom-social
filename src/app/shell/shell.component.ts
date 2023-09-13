import { Location } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent, Scroll } from '@angular/router';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.route.data.subscribe(v => console.log(v));

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd || event instanceof Scroll) {
        const url = this.location.path();
        // const url = this.route.snapshot.url.toString();
        console.log('url : ', url);


        if (url === '/') {
          this.isShow = true;
          this.isShowMyProfile = true;
          this.isLoginPgae = true;
          this.isResetPasswordPage = true;
        } else {
          this.isShow =
            url.includes('/communities') ||
            url.includes('/settings') ||
            url.includes('/login') ||
            url.includes('/reset-password') ||
            url.includes('/register') ||
            url.includes('/notifications') ||
            url.includes('/pages') ||
            false;
          this.isLoginPgae = url.includes('/login') || false;
          this.isShowMyProfile =
            url.includes('/edit-profile') ||
            url.includes('/view-profile') ||
            url.includes('/login') ||
            url.includes('/register') ||
            url.includes('/reset-password') ||
            url.includes('/notifications') ||
            url.includes('/research') ||
            false;
        }
      }
    });
  }
}
