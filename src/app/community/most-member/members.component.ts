import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent {
  mostCommunityList = [
    {
      bgImg: '/assets/images/avtar/bg-community.png',
      profilePic: '/assets/images/avtar/fashion.png',
      name: 'Travel Moon',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/avatar-2.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-3.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-4.png'
        }
      ]

    },
    {
      bgImg: '/assets/images/avtar/car.png',
      profilePic: '/assets/images/avtar/car-profile.png',
      name: 'Car Legend Community',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/avatar-2.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-3.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-4.png'
        }
      ]
    },
    {
      bgImg: '/assets/images/avtar/travel.png',
      profilePic: '/assets/images/avtar/travel-profile.png',
      name: 'Beatty Community',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/avatar-2.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-3.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-4.png'
        }
      ]
    },
    {
      bgImg: '/assets/images/avtar/travel.png',
      profilePic: '/assets/images/avtar/travel-profile.png',
      name: 'Travel Moon',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/avatar-2.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-3.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-4.png'
        }
      ]

    },
    {
      bgImg: '/assets/images/avtar/car.png',
      profilePic: '/assets/images/avtar/car-profile.png',
      name: 'Car Legend Community',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/avatar-2.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-3.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-4.png'
        }
      ]
    },
    {
      bgImg: '/assets/images/avtar/travel.png',
      profilePic: '/assets/images/avtar/travel-profile.png',
      name: 'Beatty Community',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/avatar-2.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-3.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-4.png'
        }
      ]
    },
    {
      bgImg: '/assets/images/avtar/bg-community.png',
      profilePic: '/assets/images/avtar/fashion.png',
      name: 'Travel Moon',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/avatar-2.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-3.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-4.png'
        }
      ]

    },
    {
      bgImg: '/assets/images/avtar/car.png',
      profilePic: '/assets/images/avtar/car-profile.png',
      name: 'Car Legend Community',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/avatar-2.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-3.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-4.png'
        }
      ]
    },
    {
      bgImg: '/assets/images/avtar/travel.png',
      profilePic: '/assets/images/avtar/travel-profile.png',
      name: 'Beatty Community',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/avatar-2.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-3.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-4.png'
        }
      ]
    },
  ];
  constructor(
    private modalService: NgbModal
  ) {

  }
  
}
