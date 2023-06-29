import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-block-list',
  templateUrl: './block-list.component.html',
  styleUrls: ['./block-list.component.css']
})
export class BlockListComponent {

  blockList = [
    {
      name: 'Jerome Bell',
      profilePic: '/assets/images/avtar/avatar-2.png',
      blockDate: '27/08/2022'
    },
    {
      name: 'Piter Maio',
      profilePic: '/assets/images/avtar/avatar-4.png',
      blockDate: '07/02/2023'
    },
    { 
      name: 'Floyd Miles',
      profilePic: '/assets/images/avtar/avatar-3.png',
      blockDate: '14/02/2020'
    },
    {
      name: 'Devon Lane',
      profilePic: '/assets/images/avtar/avatar-4.png',
      blockDate: '22/02/2023'
    },
    {
      name: 'Arlene McCoy',
      profilePic: '/assets/images/avtar/avatar-3.png',
      blockDate: '24/11/2021'
    },
    {
      name: 'Darlene Robertson',
      profilePic: '/assets/images/avtar/avatar-2.png',
      blockDate: '01/01/2020'
    },

  ];
  constructor(
    private modalService: NgbModal
  ) {

  }

}
