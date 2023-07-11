import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

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
    private spinner: NgxSpinnerService,
    private tokenStorage: TokenStorageService
  ) {}

  verifyEmailSend(form: NgForm) {
    this.spinner.show();
    this.submitted = true;
    if (form.form.invalid) {
      this.spinner.hide();
      return;
    }
    this.loading = true;
    const user = this.tokenStorage.getUser();
    const password = this.verifyEmail.form.controls?.password?.value;
    const Cpassword = this.verifyEmail.form.controls?.confirmPassword?.value;
    if (this.validatepassword(password, Cpassword)) {
      this.authService
        .setPassword({
          userId: user?.Id,
          password: password,
        })
        .subscribe(
          (result: any) => {
            this.spinner.hide();
            this.submitted = false;
            if (!result.error) {
              this.activeModal.close(this.cancelButtonLabel);
              this.loading = false;
            } else {
              this.spinner.hide();
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

  validatepassword(password, cPassword) {
    const pattern =
      '(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[a-z])(?=.*[0-9].*[0-9]).{8}';
    if (!password.match(pattern)) {
      this.msg =
        'Password must be a minimum of 8 characters and include one uppercase letter, one lowercase letter and one special character';
      return false;
    }
    if (password !== cPassword) {
      this.msg = 'Passwords does not match.';
      return false;
    }

    return true;
  }
}
