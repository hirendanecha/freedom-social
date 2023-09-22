import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/@shared/services/auth.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { SharedService } from 'src/app/@shared/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
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
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private sharedService: SharedService
  ) {
    const isVerify = this.route.snapshot.queryParams.isVerify;
    if (isVerify === 'false') {
      this.msg =
        'Please check your email and click the activation link to activate your account.';
      this.type = 'success';
      // this.toastService.success(this.msg);
    } else if (isVerify === 'true') {
      this.msg = 'Account activated'
      this.type = 'success';
    }
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.router.navigate([`/home`]);
    }

    this.loginForm = this.fb.group({
      Email: [null, [Validators.required]],
      Password: [null, [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
  }

  onSubmit(): void {
    this.spinner.show();
    this.authService.customerlogin(this.loginForm.value).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        if (!data.error) {
          this.tokenStorage.saveToken(data?.accessToken);
          this.tokenStorage.saveUser(data.user);
          sessionStorage.setItem('profileId', data.user.profileId);
          sessionStorage.setItem('communityId', data.user.communityId);
          window.sessionStorage.user_level_id = 2;
          window.sessionStorage.user_id = data.user.Id;
          window.sessionStorage.user_country = data.user.Country;
          window.sessionStorage.user_zip = data.user.ZipCode;
          this.sharedService.getUserDetails();
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.toastService.success('Logged in successfully');
          this.router.navigate([`/home`]);
        } else {
          this.loginMessage = data.mesaage;
          this.spinner.hide();
          this.errorMessage =
            'Invalid Email and Password. Kindly try again !!!!';
          this.isLoginFailed = true;
          // this.toastService.danger(this.errorMessage);
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.log(err.error);
        this.errorMessage = err.error.message; //err.error.message;
        // this.toastService.danger(this.errorMessage);
        this.isLoginFailed = true;
        this.errorCode = err.error.errorCode;
      }
    });
  }

  resend() {
    this.authService
      .userVerificationResend({ username: this.loginForm.value.login_email })
      .subscribe(
        {
          next: (result: any) => {
            this.msg = result.message;
            // this.toastService.success(this.msg);
            this.type = 'success';
          },
          error:
            (error) => {
              this.msg = error.message;
              // this.toastService.danger(this.msg);
              this.type = 'danger';
            }
        });
  }

  forgotPasswordOpen() {
    const modalRef = this.modalService.open(ForgotPasswordComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Submit';
    modalRef.componentInstance.closeIcon = true;
    // modelRef.result.then(res => {
    //   return res = user_id
    // });
  }
}
