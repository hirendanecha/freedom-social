import { Component, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @ViewChild('userMenuOrigin') userMenuOrigin: EventEmitter<NgbModalRef[]> | undefined;
  @ViewChild('userMenuList') userMenuList: EventEmitter<NgbModalRef[]> | undefined;
  @ViewChild('notificationList') notificationList: EventEmitter<NgbModalRef[]> | undefined;
  @ViewChild('messageList') messageList: EventEmitter<NgbModalRef[]> | undefined;
  isOpenUserMenu = false;
  userMenusOverlayDialog: any;
  userMenus = [];
  isBreakpointLessThenSmall = false;
  isDark = false;
  constructor(
    private modaleService: NgbModal
  ) {

  }

  openUserMenu(): void {
    this.userMenusOverlayDialog = this.modaleService.open(this.userMenuList, {
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'footer-user-menu-panale'
    });
  }

  openNotificationList(): void {
    this.userMenusOverlayDialog = this.modaleService.open(this.notificationList, {
      keyboard: true,
      modalDialogClass: 'footer-notification-menu-panale'
    });
  }

  openMessageList(): void {
    this.userMenusOverlayDialog = this.modaleService.open(this.messageList, {
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'footer-message-menu-panale'
    });
  }

  changeDarkUi() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('dark-ui');
  } 
}
