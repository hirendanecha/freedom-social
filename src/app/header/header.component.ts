import { Component, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
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
    if (localStorage.getItem('theme') === 'dark') {
      this.isDark = true;
      document.body.classList.toggle('dark-ui');
    } else {
      this.isDark = false;
      document.body.classList.remove('dark-ui');
    }
  }


  openUserMenu(): void {
    this.userMenusOverlayDialog = this.modaleService.open(this.userMenuList, {
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'user-menu-panale'
    });
  }

  openNotificationList(): void {
    this.userMenusOverlayDialog = this.modaleService.open(this.notificationList, {
      keyboard: true,
      modalDialogClass: 'user-menu-panale'
    });
  }

  openMessageList(): void {
    this.userMenusOverlayDialog = this.modaleService.open(this.messageList, {
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'user-menu-panale'
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

}
