import {
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Customer } from 'src/app/@shared/constant/customer';
import { CommunityPostService } from 'src/app/@shared/services/community-post.service';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { ToastService } from 'src/app/@shared/services/toast.service';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss'],
})
export class ViewPageComponent implements OnInit, AfterViewInit {
  customer: Customer = new Customer();
  pageId = '';
  profilePic: any = {};
  coverPic: any = {};
  activeTab = 1;
  pageDetails: any = {};
  memberList = [];
  postId = '';
  isExpand = false;
  isLike = false;
  userProfileId: number;
  pagePostList = [];
  adminList = [];

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService,
    private communityService: CommunityService,
    private communityPostService: CommunityPostService,
    private toastService: ToastService
  ) {
    this.pageId = history?.state?.data?.id;
    this.userProfileId = Number(sessionStorage.getItem('profileId'));
  }
  ngOnInit(): void {
    this.getCommunityDetails();
  }

  ngAfterViewInit(): void {
    this.getCommunityPost();
  }

  getCommunityDetails(): void {
    this.spinner.show();
    this.communityService.getCommunityById(this.pageId).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res) {
          res.forEach((element) => {
            if (element.Id) {
              this.pageDetails = element;
              this.memberList = element.memberList;
              this.memberList.forEach((ele) => {
                if (ele.isAdmin === 'Y') {
                  this.adminList.push(ele.profileId);
                }
              });
            }
          });
        }
      },
      error:
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
    });
  }

  getCommunityPost(): void {
    this.spinner.show();
    this.communityPostService.getPostsByProfileId(this.pageId).subscribe(
      {
        next: (res: any) => {
          if (res) {
            this.pagePostList = res;
          }
        },
        error:
          (error) => {
            this.spinner.hide();
            console.log(error);
          }
      });
  }

  clickOnLike() {
    this.isLike = !this.isLike;
  }

  openDropDown(id) {
    this.postId = id;
    if (this.postId) {
      this.isExpand = true;
    } else {
      this.isExpand = false;
    }
  }

  deletePost(id): void {
    this.spinner.show();
    this.communityPostService.deletePost(id).subscribe(
      {
        next: (res) => {
          if (res) {
            this.spinner.hide();
            this.getCommunityPost();
          }
        },
        error:
          (error) => {
            this.spinner.hide();
          }
      });
  }

  createCommunityAdmin(member): void {
    let data = {};
    if (member.isAdmin === 'Y') {
      data = {
        id: member?.Id,
        isAdmin: 'N',
      };
    } else {
      data = {
        id: member?.Id,
        isAdmin: 'Y',
      };
    }
    this.communityService.createCommunityAdmin(data).subscribe({
      next: (res: any) => {
        if (res) {
          this.toastService.success(res.message);
          this.getCommunityDetails();
        }
      },
      error:
        (error) => {
          console.log(error);
        }
    });
  }

  goToViewProfile(id: any): void {
    this.router.navigate([`settings/view-profile/${id}`]);
  }
}
