import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../constant/customer';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class SettingComponent implements OnInit {
  customer = new Customer();
  constructor(
    private modalService: NgbModal,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    const userId = window.sessionStorage.user_id;
    this.getUserDetails(userId);
  }
  getUserDetails(id): void {
    this.spinner.show();
    this.customerService.getCustomer(id).subscribe(
      (data: any) => {
        if (data) {
          this.spinner.hide();
          this.customer = data[0];
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }
}
