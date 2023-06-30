import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  constructor(
    private modalService: NgbModal
  ) {
    // if (localStorage.getItem('theme') === 'dark') {
    //   document.body.classList.toggle('dark-ui');
    // } else {
    //   document.body.classList.remove('dark-ui');
    // }
  }
}
