import { Component, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../../../@shared/services/shared.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../@shared/services/token-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerService } from '../../../../@shared/services/customer.service';
import { ForgotPasswordComponent } from 'src/app/layouts/auth-layout/pages/forgot-password/forgot-password.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
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
  constructor(
    private modalService: NgbModal,
    public sharedService: SharedService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private spinner: NgxSpinnerService,
    private customerService: CustomerService
  ) {
    // this.sharedService.getProfilePic();
  }

  openUserMenu(): void {
    this.userMenusOverlayDialog = this.modalService.open(this.userMenuList, {
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'footer-user-menu-panale',
    });
  }

  openNotificationList(): void {
    this.userMenusOverlayDialog = this.modalService.open(
      this.notificationList,
      {
        keyboard: true,
        modalDialogClass: 'footer-notification-menu-panale',
        size: 'sm',
      }
    );
    this.sharedService.getNotificationList();
  }

  openMessageList(): void {
    this.userMenusOverlayDialog = this.modalService.open(this.messageList, {
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'footer-message-menu-panale',
    });
  }

  closeMenu(e: MouseEvent, type: string) {
    this.userMenusOverlayDialog.close();
    if (e && type) {
      e.preventDefault();

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
    // this.isCollapsed = true;
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']);
    // this.sellService.cartData$.next(null);
    // this.isDomain = false;
  }

  goToSetting() {
    const userId = sessionStorage.getItem('user_id');
    this.router.navigate([`settings/edit-profile/${userId}`]);
  }

  goToViewProfile() {
    const userId = sessionStorage.getItem('user_id');
    this.router.navigate([`settings/view-profile/${userId}`]);
  }

  forgotPasswordOpen() {
    const modalRef = this.modalService.open(ForgotPasswordComponent, {
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

  readUnreadNotification(id, isRead): void {
    this.customerService.readUnreadNotification(id, isRead).subscribe({
      next: (res) => {
        this.sharedService.getNotificationList();
        // this.toastService.success(res.message);
      },
    });
  }

  viewUserPost(id) {
    this.router.navigate([`post/${id}`]);
    this.userMenusOverlayDialog.close();
  }
}
