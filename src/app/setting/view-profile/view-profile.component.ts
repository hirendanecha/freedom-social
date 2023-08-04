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
import { Subject, debounceTime, fromEvent } from 'rxjs';
import { Customer } from 'src/app/constant/customer';
import { CommunityService } from 'src/app/services/community.service';
import { CustomerService } from 'src/app/services/customer.service';
import { SharedService } from 'src/app/services/shared.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UploadFilesService } from 'src/app/services/upload-files.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
})
export class ViewProfileComponent implements OnInit, AfterViewInit {
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
  communityList: any = [];
  constructor(
    private modalService: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private tokenStorage: TokenStorageService,
    private uploadService: UploadFilesService,
    public sharedService: SharedService,
    private communityService: CommunityService
  ) {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.profileId = sessionStorage.getItem('profileId');
    if (this.profileId) {
      this.getProfile(this.profileId);
    }
  }
  ngOnInit(): void {
    if (!this.tokenStorage.getToken()) {
      this.router.navigate([`/login`]);
    }
    this.modalService.close();
  }

  ngAfterViewInit(): void {}

  getProfile(id): void {
    this.spinner.show();
    this.customerService.getProfile(id).subscribe(
      (res: any) => {
        if (res.data) {
          this.spinner.hide();
          this.customer = res.data[0];
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  getCommunities(): void {
    this.spinner.show();
    this.communityService.getCommunityByUserId(this.userId).subscribe(
      (res: any) => {
        if (res.data) {
          this.spinner.hide();
          res.data.forEach((element) => {
            if (element.Id) {
              this.communityList.push(element);
            }
          });
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  goToCommunityDetails(id): void {
    this.router.navigate([`community/${id}`]);
  }
}