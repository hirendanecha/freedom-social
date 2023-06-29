import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-suggesation',
  templateUrl: './suggesation.component.html',
  styleUrls: ['./suggesation.component.css']
})
export class SuggesationComponent {
  suggestionList = [
    {
      name: 'Arest Liolestin',
      profilePic: '/assets/images/avtar/male-friend.png',
      mutualFriends: [
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
      name: 'Cody Fisher',
      profilePic: '/assets/images/avtar/female-friend.png',
      mutualFriends: [
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
      name: 'Leslie Alexander',
      profilePic: '/assets/images/avtar/female-friend.png',
      mutualFriends: [
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
      name: 'Jerome Bell',
      profilePic: '/assets/images/avtar/male-friend.png',
      mutualFriends: [
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        }
      ]
    },
    {
      name: 'Kathryn Murphy',
      profilePic: '/assets/images/avtar/male-friend.png',
      mutualFriends: [
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
      name: 'Savannah Nguyen',
      profilePic: '/assets/images/avtar/male-friend.png',
      mutualFriends: [
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        }
      ]
    },
    {
      name: 'Darlene Robertson',
      profilePic: '/assets/images/avtar/female-friend.png',
      mutualFriends: [
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
      name: 'Arlene McCoy',
      profilePic: '/assets/images/avtar/male-friend.png',
      mutualFriends: [
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
      name: 'Bessie Cooper',
      profilePic: '/assets/images/avtar/female-friend.png',
      mutualFriends: [
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
      name: 'Darlene Robertson',
      profilePic: '/assets/images/avtar/female-friend.png',
      mutualFriends: [
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        },
        {
          profilePic: '/assets/images/avtar/profile-icon.png'
        }
      ]
    },
    {
      name: 'Arlene McCoy',
      profilePic: '/assets/images/avtar/female-friend.png',
      mutualFriends: [
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
      name: 'Bessie Cooper',
      profilePic: '/assets/images/avtar/female-friend.png',
      mutualFriends: [
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
  ]
  constructor(
    private modalService: NgbModal
  ) {

  }
  
}
