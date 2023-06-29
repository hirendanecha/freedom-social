import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
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
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        }
      ]

    },
    {
      bgImg: '/assets/images/avtar/bg-community.png',
      profilePic: '/assets/images/avtar/fashion.png',
      name: 'Car Legend Community',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        }
      ]

    },
    {
      bgImg: '/assets/images/avtar/bg-community.png',
      profilePic: '/assets/images/avtar/fashion.png',
      name: 'Beatty Community',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
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
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        }
      ]

    },
    {
      bgImg: '/assets/images/avtar/bg-community.png',
      profilePic: '/assets/images/avtar/fashion.png',
      name: 'Car Legend Community',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        }
      ]

    },
    {
      bgImg: '/assets/images/avtar/bg-community.png',
      profilePic: '/assets/images/avtar/fashion.png',
      name: 'Beatty Community',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
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
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        }
      ]

    },
    {
      bgImg: '/assets/images/avtar/bg-community.png',
      profilePic: '/assets/images/avtar/fashion.png',
      name: 'Car Legend Community',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        }
      ]

    },
    {
      bgImg: '/assets/images/avtar/bg-community.png',
      profilePic: '/assets/images/avtar/fashion.png',
      name: 'Beatty Community',
      communityType: 'Public Group',
      members: '30k',
      membersJoin: [
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        }
      ]

    },
  ];
  constructor(
    private modalService: NgbModal
  ) {

  }
  
}
