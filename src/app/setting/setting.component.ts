import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../constant/customer';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  customer: any;
  constructor(
    private modalService: NgbModal,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService
  ) {
    this.sharedService.getProfilePic();
    this.customer = this.sharedService.getUserDetails();
    console.log(this.customer);
  }

  ngOnInit(): void {
    const userId = window.sessionStorage.user_id;
    const profileId = window.sessionStorage.profileId;
    // if (profileId) {
    //   this.getProfile(profileId);
    // } else {
    //   this.getUserDetails(userId);
    // }
  }
  // getUserDetails(id): void {
  //   this.spinner.show();
  //   this.customerService.getCustomer(id).subscribe(
  //     (data: any) => {
  //       if (data) {
  //         this.spinner.hide();
  //         this.customer = data[0];
  //       }
  //     },
  //     (err) => {
  //       this.spinner.hide();
  //       console.log(err);
  //     }
  //   );
  // }

  // getProfile(id): void {
  //   this.spinner.show();
  //   this.customerService.getProfile(id).subscribe(
  //     (res: any) => {
  //       if (res.data) {
  //         this.spinner.hide();
  //         this.customer = res.data[0];
  //       }
  //     },
  //     (error) => {
  //       this.spinner.hide();
  //       console.log(error);
  //     }
  //   );
  // }
}
