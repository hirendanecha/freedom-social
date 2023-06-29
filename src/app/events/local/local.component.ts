import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css']
})
export class LocalComponent {
  localEventsList = [
    {
      eventName: 'Martio Music Event Festival',
      eventImg: '/assets/images/avtar/music.png',
      eventLocation: 'Alaska,CA',
      eventDate: '2 DEC 2022'
    },
    {
      eventName: 'Crypto Seminar Event Festival',
      eventImg: '/assets/images/avtar/seminar.png',
      eventLocation: 'Alaska,CA',
      eventDate: '11 July 2023'
    },
    {
      eventName: 'Apple Business Event Festival',
      eventImg: '/assets/images/avtar/business.png',
      eventLocation: 'Alaska,CA',
      eventDate: '15 AUG 2023'
    },
    {
      eventName: 'Martio Music Festival',
      eventImg: '/assets/images/avtar/music.png',
      eventLocation: 'Alaska,CA',
      eventDate: '2 DEC 2022'
    },
    {
      eventName: 'Crypto Seminar Event Festival',
      eventImg: '/assets/images/avtar/seminar.png',
      eventLocation: 'Alaska,CA',
      eventDate: '11 July 2023'
    },
    {
      eventName: 'Apple Business Event Festival',
      eventImg: '/assets/images/avtar/business.png',
      eventLocation: 'Alaska,CA',
      eventDate: '15 AUG 2023'
    },
    {
      eventName: 'Martio Music Festival',
      eventImg: '/assets/images/avtar/music.png',
      eventLocation: 'Alaska,CA',
      eventDate: '2 DEC 2022'
    },
    {
      eventName: 'Crypto Seminar Event Festival',
      eventImg: '/assets/images/avtar/seminar.png',
      eventLocation: 'Alaska,CA',
      eventDate: '11 July 2023'
    },
    {
      eventName: 'Apple Business Event Festival',
      eventImg: '/assets/images/avtar/business.png',
      eventLocation: 'Alaska,CA',
      eventDate: '15 AUG 2023'
    },
  ];
  constructor(
    private modalService: NgbModal
  ) {

  }

}
