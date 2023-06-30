import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AddCommunityComponent } from '../community/add-community/add-community.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.css']
})
export class MyListComponent {
  isEXpand = false;
  isShow = false;
  constructor(
    private router: Router,
    private modalService: NgbModal
  ) {
    this.router.events.subscribe((event: RouterEvent | any) => {
      if (event instanceof NavigationEnd) {
        this.isShow = event.url.includes('/people') || false;
      }
    })
  }

  openToggle() {
    console.log('before', this.isEXpand);
    this.isEXpand = !this.isEXpand;
    console.log('after', this.isEXpand);
  }

  createCommunity() {
    const modalRef = this.modalService.open(AddCommunityComponent, { centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Post';
    modalRef.componentInstance.closeIcon = true;
    // modelRef.result.then(res => {
    //   return res = user_id
    // });
  }
}
