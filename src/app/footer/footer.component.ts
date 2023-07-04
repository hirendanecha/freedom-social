import { Component, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
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
    private modaleService: NgbModal,
    public sharedService: SharedService
  ) {}

  openUserMenu(): void {
    this.userMenusOverlayDialog = this.modaleService.open(this.userMenuList, {
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'footer-user-menu-panale',
    });
  }

  openNotificationList(): void {
    this.userMenusOverlayDialog = this.modaleService.open(
      this.notificationList,
      {
        keyboard: true,
        modalDialogClass: 'footer-notification-menu-panale',
        size: 'sm',
      }
    );
  }

  openMessageList(): void {
    this.userMenusOverlayDialog = this.modaleService.open(this.messageList, {
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'footer-message-menu-panale',
    });
  }

  closeMenu(e: MouseEvent, type: string) {
    this.userMenusOverlayDialog.close();
    console.log(e);
    if (e && type) {
      e.preventDefault();

      switch (type) {
        case 'logout':
          break;
        case 'setting':
          break;
        case 'profile':
          break;
        default:
          break;
      }
    }
  }
}
