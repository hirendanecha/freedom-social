import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.css'],
})
export class PopularComponent implements OnInit {
  popularCommunityList = [
    // {
    //   bgImg: '/assets/images/avtar/bg-community.png',
    //   profilePic: '/assets/images/avtar/fashion.png',
    //   name: 'Travel Moon',
    //   communityType: 'Public Group',
    //   members: '30k',
    //   membersJoin: [
    //     {
    //       profilePic: '/assets/images/avtar/avatar-2.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-3.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-4.png',
    //     },
    //   ],
    // },
    // {
    //   bgImg: '/assets/images/avtar/car.png',
    //   profilePic: '/assets/images/avtar/car-profile.png',
    //   name: 'Car Legend Community',
    //   communityType: 'Public Group',
    //   members: '30k',
    //   membersJoin: [
    //     {
    //       profilePic: '/assets/images/avtar/avatar-2.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-3.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-4.png',
    //     },
    //   ],
    // },
    // {
    //   bgImg: '/assets/images/avtar/travel.png',
    //   profilePic: '/assets/images/avtar/travel-profile.png',
    //   name: 'Beatty Community',
    //   communityType: 'Public Group',
    //   members: '30k',
    //   membersJoin: [
    //     {
    //       profilePic: '/assets/images/avtar/avatar-2.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-3.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-4.png',
    //     },
    //   ],
    // },
    // {
    //   bgImg: '/assets/images/avtar/travel.png',
    //   profilePic: '/assets/images/avtar/travel-profile.png',
    //   name: 'Travel Moon',
    //   communityType: 'Public Group',
    //   members: '30k',
    //   membersJoin: [
    //     {
    //       profilePic: '/assets/images/avtar/avatar-2.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-3.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-4.png',
    //     },
    //   ],
    // },
    // {
    //   bgImg: '/assets/images/avtar/car.png',
    //   profilePic: '/assets/images/avtar/car-profile.png',
    //   name: 'Car Legend Community',
    //   communityType: 'Public Group',
    //   members: '30k',
    //   membersJoin: [
    //     {
    //       profilePic: '/assets/images/avtar/avatar-2.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-3.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-4.png',
    //     },
    //   ],
    // },
    // {
    //   bgImg: '/assets/images/avtar/travel.png',
    //   profilePic: '/assets/images/avtar/travel-profile.png',
    //   name: 'Beatty Community',
    //   communityType: 'Public Group',
    //   members: '30k',
    //   membersJoin: [
    //     {
    //       profilePic: '/assets/images/avtar/avatar-2.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-3.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-4.png',
    //     },
    //   ],
    // },
    // {
    //   bgImg: '/assets/images/avtar/bg-community.png',
    //   profilePic: '/assets/images/avtar/fashion.png',
    //   name: 'Travel Moon',
    //   communityType: 'Public Group',
    //   members: '30k',
    //   membersJoin: [
    //     {
    //       profilePic: '/assets/images/avtar/avatar-2.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-3.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-4.png',
    //     },
    //   ],
    // },
    // {
    //   bgImg: '/assets/images/avtar/car.png',
    //   profilePic: '/assets/images/avtar/car-profile.png',
    //   name: 'Car Legend Community',
    //   communityType: 'Public Group',
    //   members: '30k',
    //   membersJoin: [
    //     {
    //       profilePic: '/assets/images/avtar/avatar-2.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-3.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-4.png',
    //     },
    //   ],
    // },
    // {
    //   bgImg: '/assets/images/avtar/travel.png',
    //   profilePic: '/assets/images/avtar/travel-profile.png',
    //   name: 'Beatty Community',
    //   communityType: 'Public Group',
    //   members: '30k',
    //   membersJoin: [
    //     {
    //       profilePic: '/assets/images/avtar/avatar-2.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-3.png',
    //     },
    //     {
    //       profilePic: '/assets/images/avtar/avatar-4.png',
    //     },
    //   ],
    // },
  ];
  constructor(
    private communityService: CommunityService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCommunityList();
  }

  getCommunityList(): void {
    this.spinner.show();
    const userId = window.sessionStorage.user_id;
    this.communityService.getCommunity(userId).subscribe(
      (res: any) => {
        if (res.data) {
          this.spinner.hide();
          this.popularCommunityList = res.data;
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  joinCommunity(id): void {
    const userId = window.sessionStorage.user_id;
    const data = {
      userId: userId,
      communityId: id,
      IsActive: 'Y',
    };
    this.communityService.createCommunityAdmin(data).subscribe(
      (res: any) => {
        if (res) {
          console.log(res);
          this.router.navigate(['/favorite']);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
