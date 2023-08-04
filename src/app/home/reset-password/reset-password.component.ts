import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import Utils from 'src/app/constant/utils';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  @ViewChild('changePassword') changePassword: NgForm | any;
  showPassword = false;
  loading = false;
  submitted = false;
  msg = '';
  type = '';
  userAccessToken: any;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    console.log(this.route)
    this.route.queryParams.subscribe((params) => {
      this.userAccessToken = params['accesstoken'];
    });
  }

  mustMatch() {
    if (
      this.changePassword.form.controls['newPassword'].value !== '' &&
      this.changePassword.form.controls['confirmPassword'].value !== ''
    ) {
      if (
        this.changePassword.form.controls['newPassword'].value !==
        this.changePassword.form.controls['confirmPassword'].value
      ) {
        this.changePassword.form.controls['confirmPassword'].setErrors({
          mustmatch: true,
        });
      } else {
        this.changePassword.form.controls['confirmPassword'].setErrors(null);
      }
    }
  }

  forgotPasswordSubmit(form: NgForm) {
    this.submitted = true;
    if (form.form.invalid) {
      return;
    }
    this.loading = true;
    this.authService
      .setPassword({
        token: this.userAccessToken,
        password: this.changePassword.form.controls['confirmPassword'].value,
      })
      .subscribe(
        (result) => {
          this.submitted = false;
          this.loading = false;
          this.msg = 'New password set successfully';
          this.type = 'success';
          this.changePassword.reset();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2300);
        },
        (error) => {
          this.loading = false;
          this.submitted = false;
          this.msg = 'Something went wrong';
          this.type = 'danger';
        }
      );
  }
}
