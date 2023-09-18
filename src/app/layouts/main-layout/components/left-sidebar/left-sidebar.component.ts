import { Component, OnInit } from '@angular/core';
import { WalletLinkComponent } from '../../../../@shared/modals/wallet-download-modal/1776-wallet.component';
import { NgbActiveOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { ClaimTokenModalComponent } from 'src/app/@shared/modals/clai-1776-token-modal/claim-token-modal.component';
import { BreakpointService } from 'src/app/@shared/services/breakpoint.service';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
})
export class LeftSidebarComponent implements OnInit {

  isSettingMenuCollapse = true;
  user: any = {};

  constructor(
    private modalService: NgbModal,
    public sharedService: SharedService,
    private customerService: CustomerService,
    private activeOffcanvas: NgbActiveOffcanvas,
    public breakpointService: BreakpointService,
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  openWalletPopUp() {
    this.closeSidebar();

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
    this.closeSidebar();

    const modalRef = this.modalService.open(ClaimTokenModalComponent, {
      centered: true,
      keyboard: true,
      size: 'lg',
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Post';
    modalRef.componentInstance.closeIcon = true;
  }

  getUserDetails(): void {
    const id = window.sessionStorage.user_id;
    if (id) {
      this.customerService.getCustomer(id).subscribe(
        {
          next: (data: any) => {
            if (data) {
              this.user = data;
            }
          },
          error:
            (err) => {
              console.log(err);
            }
        });
    }
  }

  closeSidebar(): void {
    this.activeOffcanvas.dismiss('close');
  }
}
