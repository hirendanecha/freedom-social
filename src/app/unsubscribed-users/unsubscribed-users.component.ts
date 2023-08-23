import { Component, OnInit } from '@angular/core';
import { UnsubscribeProfileService } from '../services/unsubscribe.service';

@Component({
  selector: 'app-unsubscribed-users',
  templateUrl: './unsubscribed-users.component.html',
  styleUrls: ['./unsubscribed-users.component.scss']
})
export class UnsubscribedUsersComponent implements OnInit  {

  profiles: any[] = [];

  constructor(
    private unsubscribeProfileService: UnsubscribeProfileService
  ) {}

  ngOnInit(): void {
    this.getUnsubscribeProfiles();
  }

  getUnsubscribeProfiles(): void {
    const profileId = +sessionStorage.getItem('profileId');

    if (profileId > 0) {
      this.unsubscribeProfileService.getByProfileId(profileId).subscribe({
        next: (res: any) => {
          if (res?.length > 0) {
            this.profiles = res;
          }
        }
      });
    }
  }

  removeUnsubscribeProfile(id: number): void {
    this.unsubscribeProfileService.remove(id).subscribe({
      next: (res) => {
        this.getUnsubscribeProfiles();
      }
    });
  }
}
