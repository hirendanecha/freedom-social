import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationModalComponent } from 'src/app/@shared/confirmation-modal/confirmation-modal.component';
import { Customer } from 'src/app/constant/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toaster.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss'],
})
export class DeleteAccountComponent implements OnInit {
  customer = new Customer();
  profileId: number;
  constructor(
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService,
    private modalService: NgbModal,
    private toaster: ToastService,
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {
    this.profileId = +sessionStorage.getItem('user_id');
  }

  ngOnInit(): void {}

  getProfile(id): void {
    this.spinner.show();
    this.customerService.getProfile(id).subscribe(
      (res: any) => {
        if (res.data) {
          this.spinner.hide();
          this.customer = res.data[0];
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  deleteAccount(id): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Delete Account';
    modalRef.componentInstance.confirmButtonLabel = 'Delete';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.message =
      'Are you sure want to delete your account?';
    modalRef.result.then((res) => {
      console.log(res);
      if (res === 'success') {
        this.customerService.deleteCustomer(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              this.tokenStorageService.signOut();
              this.router.navigateByUrl('register');
            }
          },
          error: (error) => {
            console.log(error);
            this.toaster.success(error.message);
          },
        });
      }
    });
  }
}
