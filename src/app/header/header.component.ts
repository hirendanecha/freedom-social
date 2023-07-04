import { Component, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
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
  constructor(
    private modaleService: NgbModal,
    public activeteModal: NgbActiveModal,
    public sharedService: SharedService
  ) {}

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
