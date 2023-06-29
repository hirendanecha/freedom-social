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
      profilePic: '/assets/images/avtar/confirm-friend-1.png',
      mutualFriends: [
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
      name: 'Cody Fisher',
      profilePic: '/assets/images/avtar/confirm-friend-2.png',
      mutualFriends: [
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
      name: 'Leslie Alexander',
      profilePic: '/assets/images/avtar/confirm-friend-3.png',
      mutualFriends: [
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
      name: 'Jerome Bell',
      profilePic: '/assets/images/avtar/confirm-friend-3.png',
      mutualFriends: [
        {
          profilePic: '/assets/images/avtar/avatar-2.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-3.png'
        }
      ]
    },
    {
      name: 'Darlene Robertson',
      profilePic: '/assets/images/avtar/confirm-friend-2.png',
      mutualFriends: [
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
      name: 'Kathryn Murphy',
      profilePic: '/assets/images/avtar/confirm-friend-2.png',
      mutualFriends: [
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
      name: 'Savannah Nguyen',
      profilePic: '/assets/images/avtar/confirm-friend-1.png',
      mutualFriends: [
        {
          profilePic: '/assets/images/avtar/avatar-2.png'
        }
      ]
    },

    {
      name: 'Arlene McCoy',
      profilePic: '/assets/images/avtar/confirm-friend-1.png',
      mutualFriends: [
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
      name: 'Darlene Robertson',
      profilePic: '/assets/images/avtar/confirm-friend-2.png',
      mutualFriends: [
        {
          profilePic: '/assets/images/avtar/avatar-2.png'
        },
        {
          profilePic: '/assets/images/avtar/avatar-3.png'
        }
      ]
    },
    {
      name: 'Bessie Cooper',
      profilePic: '/assets/images/avtar/confirm-friend-1.png',
      mutualFriends: [
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
      name: 'Bessie Cooper',
      profilePic: '/assets/images/avtar/confirm-friend-1.png',
      mutualFriends: [
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
      name: 'Arlene McCoy',
      profilePic: '/assets/images/avtar/confirm-friend-3.png',
      mutualFriends: [
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
  ]
  constructor(
    private modalService: NgbModal
  ) {

  }

}
