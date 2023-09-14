import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { WalletLinkComponent } from '../../../@shared/modals/wallet-download-modal/1776-wallet.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { ClaimTokenModalComponent } from 'src/app/@shared/modals/clai-1776-token-modal/claim-token-modal.component';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
})
export class LeftSidebarComponent implements OnInit {

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
  isSettingMenuCollapse = true;
  isShowMyList = false;
  user: any = {};
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public sharedService: SharedService,
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
    const modalRef = this.modalService.open(ClaimTokenModalComponent, {
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
        {
          next: (data: any) => {
            if (data[0]) {
              this.user = data[0];
            }
          },
          error:
            (err) => {
              console.log(err);
            }
        });
    }
  }
  openLoacalCommunity() {
    this.router.navigateByUrl('/communities');
  }

  isActive(url: string): boolean {
    return this.router.isActive(url, true);
  }
}
