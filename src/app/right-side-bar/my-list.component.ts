import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AddCommunityComponent } from '../community/add-community/add-community.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenStorageService } from '../services/token-storage.service';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss'],
})
export class MyListComponent implements OnInit {
  isEXpand = false;
  isShow = false;
  user: any;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private tokenStorageService: TokenStorageService,
    private customerService: CustomerService
  ) {
    this.router.events.subscribe((event: RouterEvent | any) => {
      if (event instanceof NavigationEnd) {
        this.isShow = event.url.includes('/people') || false;
      }
    });
  }

  ngOnInit(): void {
    const id = window.sessionStorage.user_id;
    if (id) {
      this.customerService.getCustomer(id).subscribe(
        (data: any) => {
          if (data[0]) {
            this.user = data[0];
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  openToggle() {
    this.isEXpand = !this.isEXpand;
  }

  createCommunity() {
    if (this.user.AccountType === 'user') {
      this.router.navigateByUrl('community/community-registration');
    } else {
      this.router.navigateByUrl('local-community');
    }
  }
}
