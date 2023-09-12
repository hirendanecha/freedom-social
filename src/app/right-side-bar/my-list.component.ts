import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { CommunityService } from '../services/community.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss'],
})
export class MyListComponent implements OnInit {
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

  goToCommunityDetails(community): void {
    const communityName = community.CommunityName.replaceAll(
      ' ',
      '-'
    ).toLowerCase();
    console.log(communityName);
    this.router.navigate(['community', communityName]);
  }
}
