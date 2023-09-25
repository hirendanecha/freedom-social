import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbActiveOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';
import { ForgotPasswordComponent } from 'src/app/layouts/auth-layout/pages/forgot-password/forgot-password.component';

@Component({
  selector: 'app-profile-menus-modal',
  templateUrl: './profile-menus-modal.component.html',
  styleUrls: ['./profile-menus-modal.component.scss']
})
export class ProfileMenusModalComponent {

  constructor(
    public sharedService: SharedService,
    private activeModal: NgbActiveModal,
    private activeOffcanvas: NgbActiveOffcanvas,
    private modalService: NgbModal,
    private toastService: ToastService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
  ) {}

  closeMenu(e: MouseEvent, type: string) {
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

    this.activeModal?.dismiss();
    this.activeOffcanvas?.dismiss();
  }

  logout(): void {
    // this.isCollapsed = true;
    this.tokenStorageService.signOut();
    this.toastService.success('Logout successfully');
    this.router.navigate(['/login']);
    // this.isDomain = false;
  }

  goToSetting() {
    const userId = localStorage.getItem('user_id');
    this.router.navigate([`settings/edit-profile/${userId}`]);
  }

  goToViewProfile() {
    const profileId = localStorage.getItem('profileId');
    this.router.navigate([`settings/view-profile/${profileId}`]);
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
}
