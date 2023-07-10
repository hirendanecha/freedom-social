import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  @Input() cancelButtonLabel: string | undefined;
  @Input() confirmButtonLabel: string | undefined;
  @Input() closeIcon: boolean | undefined;
  @ViewChild('verifyEmail') verifyEmail: NgForm | any;
  submitted = false;
  loading = false;
  msg = '';
  type = 'danger';
  EMAIL_REGEX = '[A-Za-z0-9._%-+-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,}';
  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  verifyEmailSend(form: NgForm) {
    this.spinner.show();
    this.submitted = true;
    if (form.form.invalid) {
      return;
    }
    this.loading = true;
    console.log(this.verifyEmail.form.controls['email'].value);
    this.authService
      .setPassword({
        username: this.verifyEmail.form.controls['email'].value,
        password: this.verifyEmail.form.controls['password'].value,
      })
      .subscribe(
        (result: any) => {
          this.spinner.hide();
          this.submitted = false;
          if (!result.error) {
            this.activeModal.close('success');
            this.loading = false;
          } else {
            this.msg = result.message;
            this.type = 'danger';
            this.loading = false;
          }
        },
        (error) => {
          this.spinner.hide();
          this.loading = false;
        }
      );
  }
}
