import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, debounceTime, fromEvent, map } from 'rxjs';
import { Customer } from 'src/app/constant/customer';
import { CommunityPostService } from 'src/app/services/community-post.service';
import { CommunityService } from 'src/app/services/community.service';
import { CustomerService } from 'src/app/services/customer.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toaster.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UploadFilesService } from 'src/app/services/upload-files.service';

@Component({
  selector: 'app-view-community',
  templateUrl: './view-community.component.html',
  styleUrls: ['./view-community.component.scss'],
})
export class ViewCommunityComponent implements OnInit, AfterViewInit {
  customer: Customer = new Customer();
  registerForm!: FormGroup;
  isragister = false;
  registrationMessage = '';
  confirm_password = '';
  msg = '';
  allCountryData: any;
  communityId = '';
  profilePic: any = {};
  coverPic: any = {};
  activeTab = 1;
  communityDetails: any = {};
  memberList = [];
  postId = '';
  isExpand = false;
  isLike = false;
  userProfileId: number;
  communityPostList = [];
  adminList = [];

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService,
    private communityService: CommunityService,
    private communityPostService: CommunityPostService,
    private toaster: ToastService
  ) {
    // this.communityId = this.route.snapshot.paramMap.get('title');
    this.communityId = history?.state?.data?.id;
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
    this.communityService.getCommunityById(this.communityId).subscribe(
      (res: any) => {
        if (res) {
          this.spinner.hide();
          res.forEach((element) => {
            if (element.Id) {
              this.communityDetails = element;
              this.memberList = element.memberList;
              this.memberList.forEach((ele) => {
                if (ele.isAdmin === 'Y') {
                  this.adminList.push(ele.profileId);
                }
              });
            }
          });
          console.log(this.adminList);
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  getCommunityPost(): void {
    this.spinner.show();
    this.communityPostService.getPostsByProfileId(this.communityId).subscribe(
      (res: any) => {
        if (res) {
          this.communityPostList = res;
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  clickOnLike() {
    this.isLike = !this.isLike;
  }

  openDropDown(id) {
    console.log(id);
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
      (res) => {
        if (res) {
          this.spinner.hide();
          this.getCommunityPost();
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
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
    this.communityService.createCommunityAdmin(data).subscribe(
      (res: any) => {
        if (res) {
          this.toaster.success(res.message);
          this.getCommunityDetails();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  goToViewProfile(id: any): void {
    this.router.navigate([`settings/view-profile/${id}`]);
  }
}
