// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  isDark = false;
  constructor(
    // private http: HttpClient,
    // private router: Router,
    public modalService: NgbModal
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
}
