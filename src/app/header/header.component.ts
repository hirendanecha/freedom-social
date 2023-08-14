import { Component, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from '../home/forgot-password/forgot-password.component';
import { CustomerService } from '../services/customer.service';

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
    private customerService: CustomerService
  ) {
    // this.sharedService.getProfilePic();
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
  }

  openMessageList(): void {
    this.userMenusOverlayDialog = this.modaleService.open(this.messageList, {
      keyboard: false,
      size: 'sm',
      modalDialogClass: 'user-menu-panale',
    });
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
    this.router.navigate(['/login']);
    // this.sellService.cartData$.next(null);
    // this.isDomain = false;
  }

  goToSetting() {
    const userId = sessionStorage.getItem('user_id');
    console.log(userId);
    this.router.navigate([`settings/edit-profile/${userId}`]);
  }

  goToViewProfile() {
    const profileId = sessionStorage.getItem('profileId');
    console.log(profileId);
    this.router.navigate([`settings/view-profile/${profileId}`]);
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
    this.customerService.getProfileList(this.searchText).subscribe(
      (res: any) => {
        if (res) {
          this.userList = res.data;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openProfile(id) {
    if (id) {
      this.router.navigate([`settings/view-profile/${id}`]);
      this.searchText = '';
    }
  }
}
