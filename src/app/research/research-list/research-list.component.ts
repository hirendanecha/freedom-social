import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-research-list',
  templateUrl: './research-list.component.html',
  styleUrls: ['./research-list.component.scss']
})
export class ResearchListComponent {

  researches: any = [];
  btnGroupFeedTypeCtrl: FormControl;
  btnGroupViewTypeCtrl: FormControl;

  groupPosts: any = [];

  constructor(
    private profileService: ProfileService,
    private spinner: NgxSpinnerService
  ) {
    this.btnGroupFeedTypeCtrl = new FormControl('All');
    this.btnGroupViewTypeCtrl = new FormControl('TopStories');

    this.groupsAndPosts();
    this.getGroups();
  }

  groupsAndPosts(): void {
    this.spinner.show();

    this.profileService.groupsAndPosts().subscribe({
      next: (res: any) => {
        if (res?.length > 0) {
          this.groupPosts = res;
        }

        this.spinner.hide();
      },
      error: (err) => {
        this.groupPosts = [];
        this.spinner.hide();
      }
    });
  }

  getGroups(): void {
    this.spinner.show();

    this.profileService.getGroups().subscribe({
      next: (res: any) => {
        if (res?.length > 0) {
          this.researches = res;
        }

        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
      }
    });
  }
}
