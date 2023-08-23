import { Component } from '@angular/core';
import { SeeFirstUserService } from '../services/see-first-user.service';

@Component({
  selector: 'app-see-first-user',
  templateUrl: './see-first-user.component.html',
  styleUrls: ['./see-first-user.component.scss']
})
export class SeeFirstUserComponent {
  profiles: any[] = [];

  constructor(
    private seeFirstUserService: SeeFirstUserService
  ) {}

  ngOnInit(): void {
    this.getSeeFirstUsers();
  }

  getSeeFirstUsers(): void {
    const profileId = +sessionStorage.getItem('profileId');

    if (profileId > 0) {
      this.seeFirstUserService.getByProfileId(profileId).subscribe({
        next: (res: any) => {
          if (res?.length > 0) {
            this.profiles = res;
          }
        }
      });
    }
  }

  removeSeeFirstUser(id: number): void {
    this.seeFirstUserService.remove(id).subscribe({
      next: (res) => {
        this.getSeeFirstUsers();
      }
    });
  }
}
