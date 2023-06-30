import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  @Input() cancelButtonLabel: string | undefined;
  @Input() confirmButtonLabel: string | undefined;
  @Input() closeIcon: boolean | undefined;

  constructor(
    public activeModal: NgbActiveModal
  ) {

  }
}
