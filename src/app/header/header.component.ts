import { Component, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import {
  NgbActiveModal,
  NgbDropdown,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from '../home/forgot-password/forgot-password.component';
import { CustomerService } from '../services/customer.service';
import { ToastService } from '../services/toaster.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @ViewChild('userMenuOrigin') userMenuOrigin:
    | EventEmitter<NgbModalRef[]>
    | undefined;
  @ViewChild('userMenuList') userMenuList:
    | EventEmitter<NgbModalRef[]>
    | undefined;
  @ViewChild('notificationList') notificationList:
    | EventEmitter<NgbModalRef[]>
    | undefined;
  @ViewChild('messageList') messageList:
    | EventEmitter<NgbModalRef[]>
    | undefined;
  @ViewChild('userSearchDropdownRef', { static: false, read: NgbDropdown })
  userSearchNgbDropdown: NgbDropdown;
  isOpenUserMenu = false;
  userMenusOverlayDialog: any;
  userMenus = [];
  isBreakpointLessThenSmall = false;
  isDark = false;
  userList: any = [];
  searchText = '';

  constructor(
    private modaleService: NgbModal,
    public activeteModal: NgbActiveModal,
    public sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private customerService: CustomerService,
    private toaster: ToastService
  ) {
    this.sharedService.getUserDetails();
  }

  openUserMenu(): void {
    this.userMenusOverlayDialog = this.modaleService.open(this.userMenuList, {
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'user-menu-panale',
    });
  }

  openNotificationList(): void {
    this.userMenusOverlayDialog = this.modaleService.open(
      this.notificationList,
      {
        keyboard: true,
        modalDialogClass: 'user-menu-panale',
      }
    );
    this.sharedService.getNotificationList();
  }

  openMessageList(): void {
    this.userMenusOverlayDialog = this.modaleService.open(this.messageList, {
      keyboard: false,
      size: 'sm',
      modalDialogClass: 'user-menu-panale',
    });
  }

  closeMenu(e: MouseEvent, type: string) {
    if (e && type) {
      e.preventDefault();
      this.userMenusOverlayDialog.close();

      switch (type) {
        case 'profile':
          this.goToViewProfile();
          break;
        case 'logout':
          this.logout();
          break;
        case 'setting':
          this.goToSetting();
          break;
        case 'change-password':
          this.forgotPasswordOpen();
          break;
        default:
          break;
      }
    }
  }

  logout(): void {
    this.spinner.show();
    // this.isCollapsed = true;
    this.tokenStorageService.signOut();
    // this.toaster.success('Logout successfully');
    this.router.navigate(['/login']);
    // this.sellService.cartData$.next(null);
    // this.isDomain = false;
  }

  goToSetting() {
    const userId = sessionStorage.getItem('user_id');
    this.router.navigate([`settings/general/edit-profile/${userId}`]);
  }

  goToViewProfile() {
    const profileId = sessionStorage.getItem('profileId');
    this.router.navigate([`settings/general/view-profile/${profileId}`]);
  }

  forgotPasswordOpen() {
    const modalRef = this.modaleService.open(ForgotPasswordComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Submit';
    modalRef.componentInstance.closeIcon = true;
    // modelRef.result.then(res => {
    //   return res = user_id
    // });
  }

  getUserList(): void {
    this.customerService.getProfileList(this.searchText).subscribe({
      next: (res: any) => {
        if (res?.data?.length > 0) {
          this.userList = res.data;
          this.userSearchNgbDropdown.open();
        } else {
          this.userList = [];
          this.userSearchNgbDropdown.close();
        }
      },
      error: () => {
        this.userList = [];
        this.userSearchNgbDropdown.close();
      },
    });
  }

  openProfile(id) {
    if (id) {
      this.router.navigate([`settings/general/view-profile/${id}`]);
      this.searchText = '';
    }
  }

  viewUserProfile(profileId) {
    this.router.navigate([`settings/general/view-profile/${profileId}`]);
    this.userMenusOverlayDialog.close();
  }
}
