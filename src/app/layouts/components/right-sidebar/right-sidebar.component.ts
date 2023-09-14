import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { CustomerService } from '../../../@shared/services/customer.service';
import { CommunityService } from '../../../@shared/services/community.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
})
export class RightSidebarComponent implements OnInit {
  isEXpand = false;
  isShow = false;
  user: any;
  communityList = [];

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private communityService: CommunityService,
    private customerService: CustomerService
  ) {
    this.router.events.subscribe((event: RouterEvent | any) => {
      if (event instanceof NavigationEnd) {
        this.isShow = event.url.includes('/people') || false;
      }
    });

    this.getCommunityList();
  }

  ngOnInit(): void {
    const id = window.sessionStorage.user_id;
    if (id) {
      this.customerService.getCustomer(id).subscribe(
        {
          next: (data: any) => {
            if (data[0]) {
              this.user = data[0];
            }
          },
          error:
            (err) => {
              console.log(err);
            }
        });
    }
  }

  openToggle() {
    this.isEXpand = !this.isEXpand;
  }

  getCommunityList(): void {
    this.spinner.show();
    const profileId = sessionStorage.getItem('profileId');
    this.communityService.getCommunity(profileId).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.data) {
          this.communityList = res.data;
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      }
    });
  }

  goToCommunityDetails(community: any): void {
    this.router.navigate(['community', community?.slug]);
  }
}
