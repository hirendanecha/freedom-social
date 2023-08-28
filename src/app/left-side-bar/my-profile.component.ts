import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { WalletLinkComponent } from './wallet-download-modal/1776-wallet.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClaimTokenComponent } from './clai-1776-token/claim-token.component';
import { SharedService } from '../services/shared.service';
import { TokenStorageService } from '../services/token-storage.service';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  isEXpand = false;
  isShowPeoplePages = false;
  isFriendRequest = false;
  isBlockList = false;
  isSuggesation = false;
  isAllFriends = false;
  isEvents = false;
  isHome = false;
  isCommunity = false;
  isPageResearch = false;
  isSetting = false;
  isShowMyList = false;
  user: any = {};
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public sharedService: SharedService,
    private tokenStorageService: TokenStorageService,
    private customerService: CustomerService
  ) {
    this.router.events.subscribe((event: RouterEvent | any) => {
      if (event instanceof NavigationEnd) {
        this.isHome = event.url.includes('/home') || false;
        this.isShowPeoplePages = event.url.includes('/people') || false;
        this.isAllFriends = event.url.includes('/people/all-friends') || false;
        this.isBlockList = event.url.includes('/block-list') || false;
        this.isSuggesation = event.url.includes('/suggesation') || false;
        this.isFriendRequest = event.url.includes('/friend-request') || false;
        this.isEvents = event.url.includes('/events') || false;
        this.isCommunity = event.url.includes('/community') || false;
        this.isPageResearch = event.url.includes('/communities-post') || false;
        this.isSetting = event.url.includes('/settings') || false;
      }
    });
  }

  ngOnInit(): void {
    this.getUserDetails();
  }

  openWalletPopUp() {
    const modalRef = this.modalService.open(WalletLinkComponent, {
      centered: true,
      keyboard: true,
      size: 'md',
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Post';
    modalRef.componentInstance.closeIcon = true;
  }
  openClaimTokenPopUp() {
    const modalRef = this.modalService.open(ClaimTokenComponent, {
      centered: true,
      keyboard: true,
      size: 'lg',
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Post';
    modalRef.componentInstance.closeIcon = true;
  }

  openToggle() {
    this.isEXpand = !this.isEXpand;
  }
  openMyListToggle() {
    this.isShowMyList = !this.isShowMyList;
  }

  getUserDetails(): void {
    const id = window.sessionStorage.user_id;
    if (id) {
      this.customerService?.getCustomer(id).subscribe(
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

  openLoacalCommunity() {
    if (this.user.AccountType === 'user') {
      this.router.navigateByUrl('community/community-registration');
    } else {
      this.router.navigateByUrl('community');
    }
  }
}
