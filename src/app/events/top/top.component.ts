import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent {
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
  ];
  constructor(
    private modalService: NgbModal
  ) {

  }

}
