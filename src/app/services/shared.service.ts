// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadFilesService } from './upload-files.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  isDark = true;
  userData: any = {};
  notificationList: any = [];
  isNotify = false;
  constructor(
    // private http: HttpClient,
    // private router: Router,
    public modalService: NgbModal,
    private uploadService: UploadFilesService,
    private spinner: NgxSpinnerService,
    private customerService: CustomerService
  ) {
    if (localStorage.getItem('theme') === 'dark') {
      this.isDark = true;
      document.body.classList.toggle('dark-ui');
    } else {
      this.isDark = false;
      document.body.classList.remove('dark-ui');
    }
  }

  changeDarkUi() {
    this.isDark = true;
    document.body.classList.add('dark-ui');
    localStorage.setItem('theme', 'dark');
  }

  changeLightUi() {
    this.isDark = false;
    document.body.classList.remove('dark-ui');
    localStorage.setItem('theme', 'light');
  }

  toggleUi(): void {
    if (this.isDark) {
      this.changeLightUi();
    } else {
      this.changeDarkUi();
    }
  }

  getUserDetails() {
    const localUserData = JSON.parse(localStorage.getItem('userData'));
    if (localUserData?.ID) {
      this.userData = localUserData;
    }

    this.spinner.show();

    const profileId = sessionStorage.getItem('profileId');
    if (profileId) {
      this.customerService.getProfile(profileId).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          const data = res?.data?.[0];

          if (data) {
            this.userData = data;
            localStorage.setItem('userData', JSON.stringify(this.userData));
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
        }
      });
    }
  }

  getNotificationList() {
    const id = sessionStorage.getItem('profileId');
    this.customerService.getNotificationList(Number(id)).subscribe({
      next: (res: any) => {
        this.isNotify = false;
        console.log(res);
        this.notificationList = res?.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
