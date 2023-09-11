import { Component } from '@angular/core';
import { SeeFirstUserService } from '../services/see-first-user.service';
import { CustomerService } from '../services/customer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ToastService } from '../services/toaster.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationsComponent {
  notificationList: any[] = [];

  constructor(
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toaster: ToastService
  ) { }

  ngOnInit(): void {
    this.getNotificationList();
  }

  getNotificationList() {
    this.spinner.show();
    const id = sessionStorage.getItem('profileId');
    this.customerService.getNotificationList(Number(id)).subscribe(
      {
        next: (res: any) => {
          this.spinner.hide();
          this.notificationList = res?.data;
        },
        error:
          (error) => {
            this.spinner.hide();
            console.log(error);
          }
      });
  }

  viewUserPost(id) {
    this.router.navigate([`post/${id}`]);
  }

  removeNotification(id: number): void {
    this.customerService.deleteNotification(id).subscribe({
      next: (res) => {
        this.getNotificationList();
        this.toaster.success(res.message);
      },
    });
  }

  readUnreadNotification(id, isRead): void {
    this.customerService.readUnreadNotification(id, isRead).subscribe({
      next: (res) => {
        this.toaster.success(res.message);
        this.getNotificationList();
      },
    });
  }
}
