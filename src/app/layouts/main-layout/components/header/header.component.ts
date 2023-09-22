import { Component, ViewChild } from '@angular/core';
import {
  NgbDropdown,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../../../@shared/services/shared.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../../../@shared/services/customer.service';
import { ProfileMenusModalComponent } from '../profile-menus-modal/profile-menus-modal.component';
import { NotificationsModalComponent } from '../notifications-modal/notifications-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
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
    private modalService: NgbModal,
    public sharedService: SharedService,
    private router: Router,
    private customerService: CustomerService,
  ) {
    this.sharedService.getNotificationList();
  }

  openProfileMenuModal(): void {
    this.userMenusOverlayDialog = this.modalService.open(ProfileMenusModalComponent, {
      keyboard: true,
      modalDialogClass: 'profile-menus-modal',
    });
  }

  openNotificationsModal(): void {
    this.userMenusOverlayDialog = this.modalService.open(NotificationsModalComponent, {
      keyboard: true,
      modalDialogClass: 'notifications-modal',
    });
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
      this.router.navigate([`settings/view-profile/${id}`]);
      this.searchText = '';
    }
  }
}
