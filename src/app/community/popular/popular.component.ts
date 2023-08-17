import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.scss'],
})
export class PopularComponent implements OnInit {
  popularCommunityList = [];
  communityId = '';
  isExpand = false;
  constructor(
    private communityService: CommunityService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCommunityList();
  }

  getCommunityList(): void {
    this.spinner.show();
    const profileId = sessionStorage.getItem('profileId');
    this.communityService.getCommunity(profileId).subscribe(
      (res: any) => {
        if (res.data) {
          this.spinner.hide();
          this.popularCommunityList = res.data;
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  joinCommunity(id): void {
    const profileId = sessionStorage.getItem('profileId');
    const data = {
      profileId: profileId,
      communityId: id,
      IsActive: 'Y',
    };
    this.communityService.createCommunityAdmin(data).subscribe(
      (res: any) => {
        if (res) {
          this.router.navigate(['/favorite']);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  goToCommunityDetails(id): void {
    this.router.navigate([`community/${id}`]);
  }

  openDropDown(id) {
    this.communityId = id;
    if (this.communityId) {
      this.isExpand = true;
    } else {
      this.isExpand = false;
    }
  }
}
