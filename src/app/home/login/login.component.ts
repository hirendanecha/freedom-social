import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import Utils from 'src/app/constant/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLike = false;
  isExpand = false;
  loginForm!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  errorCode = '';
  loginMessage = '';
  msg = '';
  type = 'danger';
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.router.navigate([`/home`]);
    }

    this.loginForm = this.fb.group({
      UserName: [null, [Validators.required, Validators.email]],
      Password: [null, [Validators.required]],
    });
  }

  goToHomePage(): void {
    this.router.navigate([`/home`]);
  }

  goToRegestration(): void {
    this.router.navigate([`/register`]);
  }

  onSubmit(): void {
    this.spinner.show();
    this.authService.customerlogin(this.loginForm.value).subscribe(
      (data: any) => {
        console.log(data);
        if (data != null) {
          this.spinner.hide();
          this.tokenStorage.saveToken(data?.accessToken);
          this.tokenStorage.saveUser(data.user);
          window.sessionStorage.user_level_id = 2;
          window.sessionStorage.user_id = data.user.Id;
          window.sessionStorage.user_country = data.user.Country;
          window.sessionStorage.user_zip = data.user.ZipCode;
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          let lastloc = Utils.getLastLoc();
          this.router.navigate([lastloc ? lastloc : 'home']);
        } else {
          this.loginMessage = data.mesaage;
          this.spinner.hide();
          this.errorMessage =
            'Invalid Email and Password. Kindly try again !!!!';
          this.isLoginFailed = true;
        }

        //this.reloadPage();
      },
      (err) => {
        this.spinner.hide();
        console.log(err.error);
        this.errorMessage = err.error.message; //err.error.message;
        this.isLoginFailed = true;
        this.errorCode = err.error.errorCode;
      }
    );
  }

  resend() {
    this.authService
      .userVerificationResend({ username: this.loginForm.value.login_email })
      .subscribe(
        (result: any) => {
          this.msg = result.message;
          this.type = 'success';
        },
        (error) => {
          this.msg = error.message;
          this.type = 'danger';
        }
      );
  }
}
