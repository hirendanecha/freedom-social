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
  profileId = '';
  activeTab = 1;
  communityDetails: any = {};
  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService,
    private communityService: CommunityService
  ) {
    this.communityId = this.route.snapshot.paramMap.get('id');
  }
  ngOnInit(): void {
    this.getCommunityDetails();
  }

  ngAfterViewInit(): void {}

  getCommunityDetails(): void {
    this.spinner.show();
    this.communityService.getCommunityById(this.communityId).subscribe(
      (res: any) => {
        if (res) {
          this.spinner.hide();
          res.forEach((element) => {
            if (element.Id) {
              this.communityDetails = element;
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
}
