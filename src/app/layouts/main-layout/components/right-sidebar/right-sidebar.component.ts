import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { CustomerService } from '../../../../@shared/services/customer.service';
import { CommunityService } from '../../../../@shared/services/community.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreakpointService } from 'src/app/@shared/services/breakpoint.service';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
})
export class RightSidebarComponent implements OnInit {
  user: any;
  communities = [];

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private communityService: CommunityService,
    private customerService: CustomerService,
    private activeOffcanvas: NgbActiveOffcanvas,
    public breakpointService: BreakpointService,
  ) {
    this.breakpointService.screen.subscribe((res) => {
      if (res.xl.gatherThen) {
        this.getCommunityList();
      }
    });
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

  getCommunityList(): void {
    this.spinner.show();
    const profileId = sessionStorage.getItem('profileId');
    this.communityService.getCommunity(profileId).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.data) {
          this.communities = res.data;
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      }
    });
  }

  goToCommunityDetails(community: any): void {
    this.closeSidebar();
    this.router.navigate(['community', community?.slug]);
  }

  closeSidebar(): void {
    this.activeOffcanvas.dismiss('close');
  }
}
