import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../../../@shared/services/customer.service';
import { CommunityService } from '../../../../@shared/services/community.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreakpointService } from 'src/app/@shared/services/breakpoint.service';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UserRewardDetailsService } from 'src/app/@shared/services/user-reward-details.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
})
export class RightSidebarComponent implements OnInit {
  user: any;
  communities = [];
  isCommunitiesLoader: boolean = false;
  counts: any = {};

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private communityService: CommunityService,
    private customerService: CustomerService,
    private activeOffcanvas: NgbActiveOffcanvas,
    public breakpointService: BreakpointService,
    private userRewardDetailsService: UserRewardDetailsService
  ) {
    this.breakpointService.screen.subscribe((res) => {
      if (res.xl.gatherThen) {
        this.getCommunityList();
      } else {
        this.isCommunitiesLoader = false;
      }
    });
  }

  ngOnInit(): void {
    this.customerService.customerObs.subscribe((res: any) => {
      this.user = res;
    });

    this.getCountByProfileId();
  }

  getCountByProfileId(): void {
    const profileId = sessionStorage.getItem('profileId');
    this.userRewardDetailsService.getCountByProfileId(+profileId).subscribe((res: any) => {
      if (res?.data) {
        this.counts = res?.data || {};
      }
    });
  }

  getCommunityList(): void {
    this.spinner.show();
    const profileId = sessionStorage.getItem('profileId');
    this.isCommunitiesLoader = true;
    this.communityService.getCommunity(profileId, 'community').subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.data) {
          this.communities = res.data;
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
      complete: () => {
        this.isCommunitiesLoader = false;
      }
    });
  }

  goToCommunityDetails(community: any): void {
    this.closeSidebar();
    this.router.navigate(['communities', community?.slug]);
  }

  closeSidebar(): void {
    this.activeOffcanvas.dismiss('close');
  }
}
