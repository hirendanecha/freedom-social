import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { UnsubscribeProfileService } from 'src/app/@shared/services/unsubscribe-profile.service';

@Component({
  selector: 'app-unsubscribed-users',
  templateUrl: './unsubscribed-users.component.html',
  styleUrls: ['./unsubscribed-users.component.scss'],
})
export class UnsubscribedUsersComponent implements OnInit {
  profiles: any[] = [];

  constructor(
    private unsubscribeProfileService: UnsubscribeProfileService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getUnsubscribeProfiles();
  }

  getUnsubscribeProfiles(): void {
    const profileId = +localStorage.getItem('profileId');

    if (profileId > 0) {
      this.unsubscribeProfileService.getByProfileId(profileId).subscribe({
        next: (res: any) => {
          this.profiles = res?.length > 0 ? res : [];
        },
      });
    }
  }

  removeUnsubscribeProfile(id: number): void {
    this.unsubscribeProfileService.remove(id).subscribe({
      next: (res: any) => {
        this.getUnsubscribeProfiles();
        this.toastService.success(res.message);
      },
    });
  }
}
