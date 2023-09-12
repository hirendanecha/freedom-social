import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-local-community',
  templateUrl: './local-community.component.html',
  styleUrls: ['./local-community.component.scss'],
})
export class LocalCommunityComponent implements OnInit {
  communityList = [];

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
            this.communityList = res.data;
          }
        },
        error:
          (error) => {
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
    // this.router.navigateByUrl(`community/c/${communityName}`, {
    //   query: community.Id,
    // });
  }

  joinCommunity(community): void {
    const profileId = sessionStorage.getItem('profileId');
    const data = {
      profileId: profileId,
      communityId: community.Id,
      IsActive: 'Y',
    };
    this.communityService.joinCommunity(data).subscribe(
      {
        next: (res: any) => {
          if (res) {
            this.goToCommunityDetails(community);
          }
        },
        error:
          (error) => {
            console.log(error);
          }
      });
  }
}
