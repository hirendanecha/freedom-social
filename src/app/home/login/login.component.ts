import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLike = false;
  isExpand = false;
  constructor(
    private modalService: NgbModal
  ) {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.toggle('dark-ui');
    } else {
      document.body.classList.remove('dark-ui');
    }

  }
}
