import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css']
})
export class OnlineComponent {
  onlineEventsList = [
    {
      eventName: 'Online Game Event Festival',
      eventImg: '/assets/images/avtar/game.png',
      eventLocation: 'Alaska,CA',
      eventDate: '11 AUG 2022'
    },
    {
      eventName: 'Quiz Compition Event Festival',
      eventImg: '/assets/images/avtar/quiz.png',
      eventLocation: 'Alaska,CA',
      eventDate: '11 July 2023'
    },
    {
      eventName: 'Dance Audition Event Festival',
      eventImg: '/assets/images/avtar/dance.png',
      eventLocation: 'Alaska,CA',
      eventDate: '15 AUG 2023'
    },
    {
      eventName: 'Online Game Event Festival',
      eventImg: '/assets/images/avtar/game.png',
      eventLocation: 'Alaska,CA',
      eventDate: '11 AUG 2022'
    },
    {
      eventName: 'Quiz Compition Event Festival',
      eventImg: '/assets/images/avtar/quiz.png',
      eventLocation: 'Alaska,CA',
      eventDate: '11 July 2023'
    },
    {
      eventName: 'Dance Audition Event Festival',
      eventImg: '/assets/images/avtar/dance.png',
      eventLocation: 'Alaska,CA',
      eventDate: '15 AUG 2023'
    },
    {
      eventName: 'Online Game Event Festival',
      eventImg: '/assets/images/avtar/game.png',
      eventLocation: 'Alaska,CA',
      eventDate: '11 AUG 2022'
    },
    {
      eventName: 'Quiz Compition Event Festival',
      eventImg: '/assets/images/avtar/quiz.png',
      eventLocation: 'Alaska,CA',
      eventDate: '11 July 2023'
    },
    {
      eventName: 'Dance Audition Event Festival',
      eventImg: '/assets/images/avtar/dance.png',
      eventLocation: 'Alaska,CA',
      eventDate: '15 AUG 2023'
    },
  ];
  constructor(
    private modalService: NgbModal
  ) {

  }

}
