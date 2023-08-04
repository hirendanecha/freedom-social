import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AddCommunityComponent } from '../community/add-community/add-community.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenStorageService } from '../services/token-storage.service';

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
    private tokenStorageService: TokenStorageService
  ) {
    this.router.events.subscribe((event: RouterEvent | any) => {
      if (event instanceof NavigationEnd) {
        this.isShow = event.url.includes('/people') || false;
      }
    });
  }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
  }

  openToggle() {
    console.log('before', this.isEXpand);
    this.isEXpand = !this.isEXpand;
    console.log('after', this.isEXpand);
  }

  createCommunity() {
    if (this.user.AccountType === 'user') {
      this.router.navigateByUrl('community');
    } else {
      this.router.navigateByUrl('community/community-post');
    }
  }
}
