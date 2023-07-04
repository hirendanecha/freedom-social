import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLike = false;
  isExpand = false;
  constructor(
    private modalService: NgbModal,
    private router: Router
  ) {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.toggle('dark-ui');
    } else {
      document.body.classList.remove('dark-ui');
    }

  }
  forgotPasswordOpen() {
    const modalRef = this.modalService.open(ForgotPasswordComponent, { centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Submit';
    modalRef.componentInstance.closeIcon = true;
    // modelRef.result.then(res => {
    //   return res = user_id
    // });  
  }

  toToHomePage(): void {
    this.router.navigate([`/home`])
  }
}
