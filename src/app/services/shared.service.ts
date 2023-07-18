// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadFilesService } from './upload-files.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  isDark = false;
  profilePic: any = {};
  coverPic: any = {};
  constructor(
    // private http: HttpClient,
    // private router: Router,
    public modalService: NgbModal,
    private uploadService: UploadFilesService,
    private spinner: NgxSpinnerService
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
    document.body.classList.toggle('dark-ui');
    localStorage.setItem('theme', 'dark');
  }

  changeLightUi() {
    this.isDark = false;
    document.body.classList.remove('dark-ui');
    localStorage.setItem('theme', 'light');
  }

  getProfilePic() {
    this.uploadService.getProfilePic().subscribe(
      (res) => {
        if (res.length) {
          this.spinner.hide();
          this.profilePic = res[0];
          console.log(this.profilePic);
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
    this.uploadService.getCoverPic().subscribe(
      (res) => {
        if (res.length) {
          this.coverPic = res[0];
          console.log(this.profilePic);
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }
}
