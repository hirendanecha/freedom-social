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
  profilePic = '';
  coverPic = '';
  userData: any = {};
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

  // getProfilePic() {
  //   let id = window.sessionStorage.user_id;
  //   if (id) {
  //     this.uploadService.getProfilePic(id).subscribe(
  //       (res) => {
  //         if (res.length) {
  //           this.spinner.hide();
  //           this.profilePic = res[0];
  //         }
  //       },
  //       (error) => {
  //         this.spinner.hide();
  //         console.log(error);
  //       }
  //     );
  //     this.uploadService.getCoverPic(id).subscribe(
  //       (res) => {
  //         if (res.length) {
  //           this.coverPic = res[0];
  //         }
  //       },
  //       (error) => {
  //         this.spinner.hide();
  //         console.log(error);
  //       }
  //     );
  //   }
  // }

  getUserDetails() {
    this.spinner.show();
    const pid = sessionStorage.getItem('profileId');
    if (pid) {
      this.customerService.getProfile(pid).subscribe(
        (res: any) => {
          if (res.data) {
            this.spinner.hide();
            this.userData = res?.data[0];
            this.profilePic = res?.data[0]?.ProfilePicName;
            this.coverPic = res?.data[0]?.CoverPicName;
            return this.userData;
          }
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
    }
  }
}
