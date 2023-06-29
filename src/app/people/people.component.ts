import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent {

  allFriendsList = [
    {
      profilePic: 'assets/images/avtar/male-avtar.png',
      name: 'Guy Hawkins'
    },
    {
      profilePic: 'assets/images/avtar/female-avtar.png',
      name: 'Jerome Bell'
    },
    {
      profilePic: 'assets/images/avtar/male-avtar.png',
      name: 'Arlene McCoy'
    },
    {
      profilePic: 'assets/images/avtar/female-avtar.png',
      name: 'Darlene Robertson'
    },
    {
      profilePic: 'assets/images/avtar/male-avtar.png',
      name: 'Bessie Cooper'
    },
    {
      profilePic: 'assets/images/avtar/female-avtar.png',
      name: 'Courtney Henry'
    },
    {
      profilePic: 'assets/images/avtar/male-avtar.png',
      name: 'Cody Fisher'
    },
    {
      profilePic: 'assets/images/avtar/male-avtar.png',
      name: 'Ronald Richards'
    },
    {
      profilePic: 'assets/images/avtar/female-avtar.png',
      name: 'Kristin Watson'
    },
    {
      profilePic: 'assets/images/avtar/male-avtar.png',
      name: 'Darrell Steward'
    },
    {
      profilePic: 'assets/images/avtar/female-avtar.png',
      name: 'Annette Black'
    },
    {
      profilePic: 'assets/images/avtar/male-avtar.png',
      name: 'Devon Lane'
    },
    {
      profilePic: 'assets/images/avtar/female-avtar.png',
      name: 'Esther Howard'
    },
    {
      profilePic: 'assets/images/avtar/male-avtar.png',
      name: 'Kathryn Murphy'
    },
    {
      profilePic: 'assets/images/avtar/female-avtar.png',
      name: 'Ralph Edwards'
    },
    {
      profilePic: 'assets/images/avtar/male-avtar.png',
      name: 'Eleanor Pena'
    },
  ];
  constructor(
    private modalService: NgbModal
  ) {

  }

}
