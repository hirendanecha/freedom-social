import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AddCommunityComponent } from '../community/add-community/add-community.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.css'],
})
export class MyListComponent {
  isEXpand = false;
  isShow = false;
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

  openToggle() {
    console.log('before', this.isEXpand);
    this.isEXpand = !this.isEXpand;
    console.log('after', this.isEXpand);
  }

  createCommunity() {
    const user = this.tokenStorageService.getUser();
    if (user.AccountType === 'user') {
      this.router.navigateByUrl('community');
    } else {
      this.router.navigateByUrl('community/community-post');
    }
    // const modalRef = this.modalService.open(AddCommunityComponent, { centered: true, backdrop: 'static', keyboard: false });
    // modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    // modalRef.componentInstance.confirmButtonLabel = 'Create';
    // modalRef.componentInstance.closeIcon = true;
    // modelRef.result.then(res => {
    //   return res = user_id
    // });
  }
}
