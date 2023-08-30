import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunityService } from 'src/app/services/community.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-local-community',
  templateUrl: './local-community.component.html',
  styleUrls: ['./local-community.component.scss'],
})
export class LocalCommunityComponent implements OnInit {
  communityList = [];
  constructor(
    private socketService: SocketService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private communityService: CommunityService
  ) {}

  ngOnInit(): void {
    this.getCommunityList();
  }

  getCommunityList(): void {
    this.spinner.show();
    const profileId = sessionStorage.getItem('profileId');
    this.communityService.getCommunity(profileId).subscribe(
      (res: any) => {
        if (res.data) {
          this.spinner.hide();
          this.communityList = res.data;
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
    // this.socketService.getCommunity({ id: profileId }, (data) => {
    //   return data;
    // });
    // this.socketService.socket.on(
    //   'new-community',
    //   (data) => {
    //     this.spinner.hide();
    //     this.communityList = data;
    //   },
    //   (error) => {
    //     this.spinner.hide();
    //     console.log(error);
    //   }
    // );
  }

  goToCommunityDetails(community): void {
    const communityName = community.CommunityName.replaceAll(
      ' ',
      '-'
    ).toLowerCase();
    console.log(communityName);
    this.router.navigate([`community/${communityName}`], {
      state: {
        data: { id: community.Id },
      },
    });
    // this.router.navigateByUrl(`community/c/${communityName}`, {
    //   query: community.Id,
    // });
  }

  joinCommunity(id): void {
    const profileId = sessionStorage.getItem('profileId');
    const data = {
      profileId: profileId,
      communityId: id,
      IsActive: 'Y',
    };
    this.communityService.joinCommunity(data).subscribe(
      (res: any) => {
        if (res) {
          this.router.navigate(['communities-post']);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
