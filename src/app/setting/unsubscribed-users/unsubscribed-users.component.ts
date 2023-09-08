import { Component, OnInit } from '@angular/core';
import { UnsubscribeProfileService } from '../../services/unsubscribe-profile.service';
import { ToastService } from '../../services/toaster.service';

@Component({
  selector: 'app-unsubscribed-users',
  templateUrl: './unsubscribed-users.component.html',
  styleUrls: ['./unsubscribed-users.component.scss'],
})
export class UnsubscribedUsersComponent implements OnInit {
  profiles: any[] = [];

  constructor(
    private unsubscribeProfileService: UnsubscribeProfileService,
    private toaster: ToastService
  ) {}

  ngOnInit(): void {
    this.getUnsubscribeProfiles();
  }

  getUnsubscribeProfiles(): void {
    const profileId = +sessionStorage.getItem('profileId');

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
        this.toaster.success(res.message);
      },
    });
  }
}
