import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-page',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PageComponent implements OnInit {
  pageList = [];

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private communityService: CommunityService
  ) { }

  ngOnInit(): void {
    this.getCommunityList();
  }

  getCommunityList(): void {
    this.spinner.show();
    const profileId = sessionStorage.getItem('profileId');
    this.communityService.getCommunity(profileId).subscribe(
      {
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            this.pageList = res.data;
          }
        },
        error:
          (error) => {
            this.spinner.hide();
            console.log(error);
          }
      });
  }

  goToCommunityDetails(page): void {
    const pageName = page.CommunityName.replaceAll(
      ' ',
      '-'
    ).toLowerCase();
    this.router.navigate([`page/${pageName}`], {
      state: {
        data: { id: page.Id },
      },
    });
    // this.router.navigateByUrl(`community/c/${communityName}`, {
    //   query: community.Id,
    // });
  }

  joinCommunity(page): void {
    const profileId = sessionStorage.getItem('profileId');
    const data = {
      profileId: profileId,
      communityId: page.Id,
      IsActive: 'Y',
    };
    this.communityService.joinCommunity(data).subscribe(
      {
        next: (res: any) => {
          if (res) {
            this.goToCommunityDetails(page);
          }
        },
        error:
          (error) => {
            console.log(error);
          }
      });
  }
}
