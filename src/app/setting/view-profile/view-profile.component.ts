import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Customer } from 'src/app/constant/customer';
import { CommunityService } from 'src/app/services/community.service';
import { CustomerService } from 'src/app/services/customer.service';
import { SharedService } from 'src/app/services/shared.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
})
export class ViewProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  customer: Customer = new Customer();
  registerForm!: FormGroup;
  isragister = false;
  registrationMessage = '';
  confirm_password = '';
  msg = '';
  allCountryData: any;
  userId = '';
  profilePic: any = {};
  coverPic: any = {};
  profileId = '';
  activeTab = 1;
  communityList = [];
  communityId = '';
  isExpand = false;
  constructor(
    private modalService: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private tokenStorage: TokenStorageService,
    public sharedService: SharedService,
    private communityService: CommunityService
  ) {
    this.profileId = this.route.snapshot.paramMap.get('id');
    if (this.profileId) {
      this.getProfile(this.profileId);
    } else {
      this.profileId = sessionStorage.getItem('profileId');
    }
  }
  ngOnInit(): void {
    if (!this.tokenStorage.getToken()) {
      this.router.navigate([`/login`]);
    }
    this.modalService.close();
  }

  ngAfterViewInit(): void { }

  getProfile(id): void {
    this.spinner.show();
    this.customerService.getProfile(id).subscribe(
      {
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            this.customer = res.data[0];
            this.userId = res.data[0].UserID;
          }
        },
        error:
          (error) => {
            this.spinner.hide();
            console.log(error);
          }
      });
  }

  getCommunities(): void {
    this.spinner.show();
    this.communityList = [];
    this.communityService.getCommunityByUserId(this.profileId).subscribe(
      {
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            // this.communityList = res.data;
            res.data.forEach((element) => {
              if (element.Id) {
                this.communityList.push(element);
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

  goToCommunityDetails(community): void {
    const communityName = community.CommunityName.replaceAll(
      ' ',
      '-'
    ).toLowerCase();
    console.log(communityName);
    this.router.navigate([`community/${communityName}`], {
      state: {
        data: { id: community.Id },
      },
    });
  }

  openDropDown(id) {
    this.communityId = id;
    if (this.communityId) {
      this.isExpand = true;
    } else {
      this.isExpand = false;
    }
  }
  openEditProfile(): void {
    this.router.navigate([`settings/edit-profile/${this.profileId}`])
  }

  ngOnDestroy(): void {
    this.communityList = [];
  }
}
